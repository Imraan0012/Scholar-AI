package com.scholarai.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholarai.backend.entity.Scholarship;
import com.scholarai.backend.entity.ScholarshipUpdateReview;
import com.scholarai.backend.repository.ScholarshipRepository;
import com.scholarai.backend.repository.ScholarshipUpdateReviewRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.InetAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.*;

@Service
public class ScholarshipSyncService {

    private static final Logger log = LoggerFactory.getLogger(ScholarshipSyncService.class);

    private final ScholarshipRepository scholarshipRepository;
    private final ScholarshipUpdateReviewRepository reviewRepository;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public ScholarshipSyncService(ScholarshipRepository scholarshipRepository,
                                  ScholarshipUpdateReviewRepository reviewRepository,
                                  ObjectMapper objectMapper) {
        this.scholarshipRepository = scholarshipRepository;
        this.reviewRepository = reviewRepository;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(4))
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
    }

    /**
     * Normalizes a string for deterministic hashing.
     */
    private static String normalize(Object val) {
        if (val == null) return "";
        return val.toString().trim();
    }

    /**
     * Computes a deterministic SHA-256 hash of official scholarship payload attributes.
     */
    public String calculateContentHash(Map<String, Object> payload) {
        if (payload == null || payload.isEmpty()) {
            return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"; // Empty SHA-256
        }
        SortedMap<String, String> sortedMap = new TreeMap<>();
        for (Map.Entry<String, Object> entry : payload.entrySet()) {
            String key = entry.getKey();
            // Skip volatile/non-content attributes
            if ("id".equalsIgnoreCase(key) || "created_at".equalsIgnoreCase(key) || "updated_at".equalsIgnoreCase(key) ||
                "last_checked_at".equalsIgnoreCase(key) || "last_verified_at".equalsIgnoreCase(key) ||
                "content_hash".equalsIgnoreCase(key) || "official_scheme_id".equalsIgnoreCase(key)) {
                continue;
            }
            sortedMap.put(key, normalize(entry.getValue()));
        }
        return hashTreeMap(sortedMap);
    }

    /**
     * Computes a deterministic SHA-256 hash from a Scholarship entity's content fields.
     */
    public String calculateScholarshipContentHash(Scholarship s) {
        if (s == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

        SortedMap<String, String> map = new TreeMap<>();
        map.put("academic_year", normalize(s.getAcademicYear()));
        map.put("amount_display", normalize(s.getAmountDisplay()));
        map.put("amount_max", s.getAmountMax() != null ? s.getAmountMax().stripTrailingZeros().toPlainString() : "");
        map.put("amount_min", s.getAmountMin() != null ? s.getAmountMin().stripTrailingZeros().toPlainString() : "");
        map.put("amount_type", normalize(s.getAmountType()));
        map.put("application_type", normalize(s.getApplicationType()));
        map.put("description", normalize(s.getDescription()));
        map.put("government_level", normalize(s.getGovernmentLevel()));
        map.put("ministry_or_department", normalize(s.getMinistryOrDepartment()));
        map.put("name", normalize(s.getName()));
        map.put("official_application_url", normalize(s.getOfficialApplicationUrl()));
        map.put("official_guideline_pdf_url", normalize(s.getOfficialGuidelinePdfUrl()));
        map.put("official_website_url", normalize(s.getOfficialWebsiteUrl()));
        map.put("provider", normalize(s.getProvider()));
        map.put("provider_type", normalize(s.getProviderType()));
        map.put("source_reliability", normalize(s.getSourceReliability()));
        map.put("state", normalize(s.getState()));
        map.put("verification_status", normalize(s.getVerificationStatus()));

        return hashTreeMap(map);
    }

    private String hashTreeMap(SortedMap<String, String> map) {
        try {
            StringBuilder sb = new StringBuilder();
            for (Map.Entry<String, String> entry : map.entrySet()) {
                sb.append(entry.getKey()).append("=").append(entry.getValue()).append("\n");
            }
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(sb.toString().getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder(2 * encodedHash.length);
            for (byte b : encodedHash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            log.error("[ScholarshipSyncService] Hash calculation failure: {}", e.getMessage());
            return "0000000000000000000000000000000000000000000000000000000000000000";
        }
    }

    /**
     * Validates whether a URL is a safe, public HTTP/HTTPS URL (SSRF prevention).
     */
    public static boolean isValidPublicHttpUrl(String urlStr) {
        if (urlStr == null || urlStr.isBlank()) return false;
        try {
            URI uri = new URI(urlStr.trim());
            String scheme = uri.getScheme();
            if (scheme == null || (!scheme.equalsIgnoreCase("http") && !scheme.equalsIgnoreCase("https"))) {
                return false;
            }
            String host = uri.getHost();
            if (host == null || host.isBlank()) return false;

            String lowerHost = host.toLowerCase().trim();
            if (lowerHost.equals("localhost") || lowerHost.endsWith(".localhost") ||
                lowerHost.endsWith(".local") || lowerHost.endsWith(".internal") || lowerHost.endsWith(".corp")) {
                return false;
            }

            InetAddress address = InetAddress.getByName(host);
            if (address.isLoopbackAddress() || address.isAnyLocalAddress() ||
                address.isLinkLocalAddress() || address.isSiteLocalAddress()) {
                return false;
            }
            byte[] ip = address.getAddress();
            if (ip.length == 4) {
                int b0 = ip[0] & 0xFF;
                int b1 = ip[1] & 0xFF;
                // Block 0.0.0.0/8, 10.0.0.0/8, 127.0.0.0/8, 169.254.0.0/16, 172.16.0.0/12, 192.168.0.0/16
                if (b0 == 0 || b0 == 10 || b0 == 127 || (b0 == 169 && b1 == 254) ||
                    (b0 == 172 && (b1 >= 16 && b1 <= 31)) || (b0 == 192 && b1 == 168)) {
                    return false;
                }
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static class FetchResult {
        private final int statusCode;
        private final boolean success;
        private final String errorMessage;

        public FetchResult(int statusCode, boolean success, String errorMessage) {
            this.statusCode = statusCode;
            this.success = success;
            this.errorMessage = errorMessage;
        }

        public int getStatusCode() { return statusCode; }
        public boolean isSuccess() { return success; }
        public String getErrorMessage() { return errorMessage; }
    }

    /**
     * Safely fetches an official public source URL.
     */
    public FetchResult fetchOfficialSource(String urlStr) {
        if (!isValidPublicHttpUrl(urlStr)) {
            return new FetchResult(400, false, "Invalid or non-public URL (SSRF protected)");
        }
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(urlStr.trim()))
                    .timeout(Duration.ofSeconds(4))
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ScholarAI-Official-Sync/1.0")
                    .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
                    .GET()
                    .build();

            HttpResponse<Void> response = httpClient.send(request, HttpResponse.BodyHandlers.discarding());
            int code = response.statusCode();
            boolean ok = (code >= 200 && code < 400);
            return new FetchResult(code, ok, ok ? "OK" : "HTTP status " + code);
        } catch (Exception e) {
            return new FetchResult(500, false, e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    /**
     * Synchronizes scholarships against official sources.
     * If incoming external records are provided, audits against them.
     * Otherwise, loads all scholarships from database, ensures baseline hashes, and verifies sources.
     */
    @Transactional
    public Map<String, Object> syncOfficialSourceRecords(List<Map<String, Object>> incomingRecords) {
        int checkedCount = 0;
        int unchangedCount = 0;
        int pendingReviewCount = 0;
        int failedCount = 0;
        int skippedCount = 0;
        int newSchemesQueued = 0;
        List<String> stagedReviewIds = new ArrayList<>();

        log.info("[SYNC START] Beginning official scholarship synchronization pipeline...");

        // Case A: External collector provided explicit incoming payload records
        if (incomingRecords != null && !incomingRecords.isEmpty()) {
            log.info("[SYNC] Processing {} incoming external source payload(s)...", incomingRecords.size());
            for (Map<String, Object> record : incomingRecords) {
                String scholarshipId = (String) record.get("id");
                if (scholarshipId == null || scholarshipId.isBlank()) continue;

                checkedCount++;
                String newHash = calculateContentHash(record);
                Optional<Scholarship> existingOpt = scholarshipRepository.findById(scholarshipId);

                if (existingOpt.isPresent()) {
                    Scholarship existing = existingOpt.get();
                    existing.setLastCheckedAt(OffsetDateTime.now());

                    if (existing.getContentHash() == null || existing.getContentHash().isBlank()) {
                        existing.setContentHash(calculateScholarshipContentHash(existing));
                    }

                    if (existing.getContentHash().equals(newHash)) {
                        scholarshipRepository.save(existing);
                        unchangedCount++;
                    } else {
                        List<ScholarshipUpdateReview> existingPending = reviewRepository
                                .findByScholarshipIdAndStatus(scholarshipId, "PENDING_REVIEW");

                        if (existingPending.isEmpty()) {
                            List<String> changedFields = new ArrayList<>();
                            Map<String, Object> oldValues = new HashMap<>();
                            Map<String, Object> proposedValues = new HashMap<>();

                            checkFieldDiff("amountDisplay", existing.getAmountDisplay(), record.get("amount_display"), changedFields, oldValues, proposedValues);
                            checkFieldDiff("officialApplicationUrl", existing.getOfficialApplicationUrl(), record.get("official_application_url"), changedFields, oldValues, proposedValues);
                            checkFieldDiff("officialWebsiteUrl", existing.getOfficialWebsiteUrl(), record.get("official_website_url"), changedFields, oldValues, proposedValues);
                            checkFieldDiff("description", existing.getDescription(), record.get("description"), changedFields, oldValues, proposedValues);

                            try {
                                ScholarshipUpdateReview review = new ScholarshipUpdateReview();
                                review.setScholarshipId(scholarshipId);
                                review.setSourceId((String) record.getOrDefault("source_id", existing.getMinistryOrDepartment() != null ? existing.getMinistryOrDepartment() : "OFFICIAL_PORTAL"));
                                review.setSourceUrl((String) record.getOrDefault("official_website_url", existing.getOfficialWebsiteUrl()));
                                review.setChangedFields(objectMapper.writeValueAsString(changedFields));
                                review.setOldValues(objectMapper.writeValueAsString(oldValues));
                                review.setProposedValues(objectMapper.writeValueAsString(proposedValues));
                                review.setChangeSummary(String.format("Detected %d modified field(s) from official source: %s",
                                        changedFields.size(), String.join(", ", changedFields)));
                                review.setStatus("PENDING_REVIEW");
                                review.setCreatedAt(OffsetDateTime.now());

                                ScholarshipUpdateReview saved = reviewRepository.save(review);
                                stagedReviewIds.add(saved.getId().toString());
                                pendingReviewCount++;
                            } catch (Exception e) {
                                log.error("[SYNC] Failed to stage review for {}: {}", scholarshipId, e.getMessage());
                            }
                        } else {
                            unchangedCount++; // Duplicate review suppressed
                        }
                        scholarshipRepository.save(existing);
                    }
                } else {
                    // Potential new scheme discovery
                    try {
                        ScholarshipUpdateReview review = new ScholarshipUpdateReview();
                        review.setScholarshipId(scholarshipId);
                        review.setSourceId((String) record.getOrDefault("source_id", "OFFICIAL_PORTAL"));
                        review.setSourceUrl((String) record.getOrDefault("official_website_url", ""));
                        review.setChangedFields(objectMapper.writeValueAsString(List.of("NEW_SCHEME")));
                        review.setOldValues("{}");
                        review.setProposedValues(objectMapper.writeValueAsString(record));
                        review.setChangeSummary(String.format("Discovered new verified scheme from official source: %s (%s)",
                                record.get("name"), scholarshipId));
                        review.setStatus("PENDING_REVIEW");
                        review.setCreatedAt(OffsetDateTime.now());

                        ScholarshipUpdateReview saved = reviewRepository.save(review);
                        stagedReviewIds.add(saved.getId().toString());
                        newSchemesQueued++;
                    } catch (Exception e) {
                        log.error("[SYNC] Failed to queue new scheme review: {}", e.getMessage());
                    }
                }
            }
        } else {
            // Case B: Standard 12-hour scheduler run — load all 46 scholarships from database
            List<Scholarship> allScholarships = scholarshipRepository.findAll();
            log.info("[SYNC] Loaded {} scholarship record(s) from database repository.", allScholarships.size());

            if (allScholarships.isEmpty()) {
                log.warn("[SYNC WARN] 0 scholarships found in database to synchronize.");
            }

            for (Scholarship sch : allScholarships) {
                checkedCount++;
                try {
                    // 1. Backfill baseline hash if not already present
                    if (sch.getContentHash() == null || sch.getContentHash().isBlank()) {
                        String baselineHash = calculateScholarshipContentHash(sch);
                        sch.setContentHash(baselineHash);
                        log.debug("[SYNC] Initialized baseline hash for {}: {}", sch.getId(), baselineHash);
                    }

                    // 2. Identify and validate official source URL
                    String targetUrl = sch.getOfficialWebsiteUrl();
                    if (targetUrl == null || targetUrl.isBlank()) {
                        targetUrl = sch.getOfficialApplicationUrl();
                    }

                    if (targetUrl == null || targetUrl.isBlank()) {
                        skippedCount++;
                        sch.setLastCheckedAt(OffsetDateTime.now());
                        scholarshipRepository.save(sch);
                        continue;
                    }

                    if (!isValidPublicHttpUrl(targetUrl)) {
                        log.warn("[SYNC SKIP] Invalid or non-public URL for {}: {}", sch.getId(), targetUrl);
                        skippedCount++;
                        sch.setLastCheckedAt(OffsetDateTime.now());
                        scholarshipRepository.save(sch);
                        continue;
                    }

                    // 3. Fetch official public source
                    FetchResult fetchResult = fetchOfficialSource(targetUrl);
                    if (fetchResult.isSuccess()) {
                        unchangedCount++;
                        log.info("[SYNC OK] Verified {} via {} (HTTP {})", sch.getId(), URI.create(targetUrl).getHost(), fetchResult.getStatusCode());
                    } else {
                        failedCount++;
                        log.warn("[SYNC FAIL] Source check failed for {} on {}: {}", sch.getId(), URI.create(targetUrl).getHost(), fetchResult.getErrorMessage());
                    }

                    sch.setLastCheckedAt(OffsetDateTime.now());
                    scholarshipRepository.save(sch);
                } catch (Exception schErr) {
                    failedCount++;
                    log.error("[SYNC ERROR] Exception synchronizing scholarship {}: {}", sch.getId(), schErr.getMessage());
                }
            }
        }

        log.info("[SYNC COMPLETE] Checked: {}, Unchanged: {}, PendingReview: {}, Failed: {}, Skipped: {}, NewSchemes: {}",
                checkedCount, unchangedCount, pendingReviewCount, failedCount, skippedCount, newSchemesQueued);

        Map<String, Object> summary = new HashMap<>();
        summary.put("checkedCount", checkedCount);
        summary.put("unchangedCount", unchangedCount);
        summary.put("pendingReviewCount", pendingReviewCount);
        summary.put("failedCount", failedCount);
        summary.put("skippedCount", skippedCount);
        summary.put("newSchemesQueued", newSchemesQueued);
        summary.put("stagedReviewIds", stagedReviewIds);
        summary.put("syncedAt", OffsetDateTime.now());
        return summary;
    }

    private void checkFieldDiff(String fieldName, Object oldVal, Object newVal,
                                List<String> changedFields,
                                Map<String, Object> oldValues,
                                Map<String, Object> proposedValues) {
        if (newVal != null && !newVal.toString().trim().equals(oldVal != null ? oldVal.toString().trim() : "")) {
            changedFields.add(fieldName);
            oldValues.put(fieldName, oldVal);
            proposedValues.put(fieldName, newVal);
        }
    }

    /**
     * Approves and safely applies a staged scholarship update.
     */
    @Transactional
    public boolean approveReview(UUID reviewId, String reviewer) {
        Optional<ScholarshipUpdateReview> opt = reviewRepository.findById(reviewId);
        if (opt.isEmpty()) return false;

        ScholarshipUpdateReview review = opt.get();
        Optional<Scholarship> schOpt = scholarshipRepository.findById(review.getScholarshipId());
        if (schOpt.isPresent()) {
            Scholarship sch = schOpt.get();
            try {
                Map<String, Object> proposed = objectMapper.readValue(review.getProposedValues(), Map.class);
                if (proposed.containsKey("amountDisplay")) sch.setAmountDisplay((String) proposed.get("amountDisplay"));
                if (proposed.containsKey("officialApplicationUrl")) sch.setOfficialApplicationUrl((String) proposed.get("officialApplicationUrl"));
                if (proposed.containsKey("officialWebsiteUrl")) sch.setOfficialWebsiteUrl((String) proposed.get("officialWebsiteUrl"));
                if (proposed.containsKey("description")) sch.setDescription((String) proposed.get("description"));

                // Recompute content hash with new approved values
                sch.setContentHash(calculateScholarshipContentHash(sch));
                sch.setLastVerifiedAt(OffsetDateTime.now());
                scholarshipRepository.save(sch);

                review.setStatus("APPROVED");
                review.setReviewedAt(OffsetDateTime.now());
                review.setReviewedBy(reviewer != null ? reviewer : "SYSTEM_ADMIN");
                reviewRepository.save(review);
                return true;
            } catch (Exception e) {
                log.error("[ScholarshipSyncService] Failed to apply review {}: {}", reviewId, e.getMessage());
                return false;
            }
        }
        return false;
    }

    public List<ScholarshipUpdateReview> getPendingReviews() {
        return reviewRepository.findByStatus("PENDING_REVIEW");
    }
}
