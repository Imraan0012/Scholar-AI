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

import javax.net.ssl.SSLHandshakeException;
import javax.net.ssl.SSLPeerUnverifiedException;
import java.net.InetAddress;
import java.net.URI;
import java.net.UnknownHostException;
import java.net.http.HttpClient;
import java.net.http.HttpConnectTimeoutException;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpTimeoutException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.cert.CertificateException;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

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
                .connectTimeout(Duration.ofSeconds(8))
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
    }

    private static String normalize(Object val) {
        if (val == null) return "";
        return val.toString().trim();
    }

    public String calculateContentHash(Map<String, Object> payload) {
        if (payload == null || payload.isEmpty()) {
            return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
        }
        SortedMap<String, String> sortedMap = new TreeMap<>();
        for (Map.Entry<String, Object> entry : payload.entrySet()) {
            String key = entry.getKey();
            if ("id".equalsIgnoreCase(key) || "created_at".equalsIgnoreCase(key) || "updated_at".equalsIgnoreCase(key) ||
                "last_checked_at".equalsIgnoreCase(key) || "last_verified_at".equalsIgnoreCase(key) ||
                "content_hash".equalsIgnoreCase(key) || "official_scheme_id".equalsIgnoreCase(key)) {
                continue;
            }
            sortedMap.put(key, normalize(entry.getValue()));
        }
        return hashTreeMap(sortedMap);
    }

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
     * Validates whether a URL has valid public HTTP/HTTPS syntax and does not target loopback/private hostnames.
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
                lowerHost.endsWith(".local") || lowerHost.endsWith(".internal") || lowerHost.endsWith(".corp") ||
                lowerHost.equals("127.0.0.1") || lowerHost.equals("::1") || lowerHost.equals("0.0.0.0")) {
                return false;
            }

            // If hostname is directly an IPv4 literal, check private ranges
            if (lowerHost.matches("^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$")) {
                String[] parts = lowerHost.split("\\.");
                int b0 = Integer.parseInt(parts[0]);
                int b1 = Integer.parseInt(parts[1]);
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

    public enum FailureCategory {
        SUCCESS,
        HTTP_403,
        HTTP_404,
        HTTP_429,
        HTTP_5XX,
        CONNECT_TIMEOUT,
        READ_TIMEOUT,
        DNS_FAILURE,
        TLS_CERTIFICATE_FAILURE,
        TLS_HOSTNAME_FAILURE,
        INVALID_URL,
        OTHER_FAILURE
    }

    public static class FetchResult {
        private final int statusCode;
        private final boolean success;
        private final FailureCategory category;
        private final String message;
        private final int attempts;

        public FetchResult(int statusCode, boolean success, FailureCategory category, String message, int attempts) {
            this.statusCode = statusCode;
            this.success = success;
            this.category = category;
            this.message = message;
            this.attempts = attempts;
        }

        public int getStatusCode() { return statusCode; }
        public boolean isSuccess() { return success; }
        public FailureCategory getCategory() { return category; }
        public String getMessage() { return message; }
        public int getAttempts() { return attempts; }
    }

    /**
     * Safely fetches an official public source URL with controlled exponential backoff for transient errors.
     */
    public FetchResult fetchOfficialSource(String urlStr) {
        if (!isValidPublicHttpUrl(urlStr)) {
            return new FetchResult(400, false, FailureCategory.INVALID_URL, "Invalid or non-public URL (SSRF protected)", 1);
        }

        int maxAttempts = 3;
        int attempt = 0;
        long backoffMs = 500;

        while (attempt < maxAttempts) {
            attempt++;
            try {
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(urlStr.trim()))
                        .timeout(Duration.ofSeconds(12))
                        .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 (ScholarAI Official Source Auditor/1.0)")
                        .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,application/pdf;q=0.8,*/*;q=0.7")
                        .header("Accept-Language", "en-US,en;q=0.9")
                        .GET()
                        .build();

                HttpResponse<Void> response = httpClient.send(request, HttpResponse.BodyHandlers.discarding());
                int code = response.statusCode();

                if (code >= 200 && code < 400) {
                    return new FetchResult(code, true, FailureCategory.SUCCESS, "OK", attempt);
                } else if (code == 403) {
                    return new FetchResult(code, false, FailureCategory.HTTP_403, "HTTP 403 Forbidden (Anti-bot / Gateway restricted)", attempt);
                } else if (code == 404) {
                    return new FetchResult(code, false, FailureCategory.HTTP_404, "HTTP 404 Not Found", attempt);
                } else if (code == 429) {
                    if (attempt < maxAttempts) {
                        try { Thread.sleep(backoffMs); } catch (InterruptedException ignored) {}
                        backoffMs *= 2;
                        continue;
                    }
                    return new FetchResult(code, false, FailureCategory.HTTP_429, "HTTP 429 Rate Limited", attempt);
                } else if (code >= 500) {
                    if (attempt < maxAttempts && (code == 502 || code == 503 || code == 504)) {
                        try { Thread.sleep(backoffMs); } catch (InterruptedException ignored) {}
                        backoffMs *= 2;
                        continue;
                    }
                    return new FetchResult(code, false, FailureCategory.HTTP_5XX, "HTTP " + code + " Server Error", attempt);
                } else {
                    return new FetchResult(code, false, FailureCategory.OTHER_FAILURE, "HTTP " + code, attempt);
                }
            } catch (HttpConnectTimeoutException e) {
                if (attempt < maxAttempts) {
                    try { Thread.sleep(backoffMs); } catch (InterruptedException ignored) {}
                    backoffMs *= 2;
                    continue;
                }
                return new FetchResult(0, false, FailureCategory.CONNECT_TIMEOUT, "Connect Timeout: " + e.getMessage(), attempt);
            } catch (HttpTimeoutException e) {
                if (attempt < maxAttempts) {
                    try { Thread.sleep(backoffMs); } catch (InterruptedException ignored) {}
                    backoffMs *= 2;
                    continue;
                }
                return new FetchResult(0, false, FailureCategory.READ_TIMEOUT, "Read Timeout: " + e.getMessage(), attempt);
            } catch (SSLHandshakeException e) {
                return new FetchResult(0, false, FailureCategory.TLS_CERTIFICATE_FAILURE, "TLS Certificate Validation Failure: " + e.getMessage(), attempt);
            } catch (SSLPeerUnverifiedException e) {
                return new FetchResult(0, false, FailureCategory.TLS_HOSTNAME_FAILURE, "TLS Hostname Mismatch: " + e.getMessage(), attempt);
            } catch (UnknownHostException e) {
                return new FetchResult(0, false, FailureCategory.DNS_FAILURE, "DNS Resolution Failure: " + e.getMessage(), attempt);
            } catch (Exception e) {
                String msg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
                if (msg.contains("PKIX") || msg.contains("certificate")) {
                    return new FetchResult(0, false, FailureCategory.TLS_CERTIFICATE_FAILURE, "TLS Certificate Error: " + msg, attempt);
                }
                if (msg.contains("hostname") || msg.contains("subject alternative")) {
                    return new FetchResult(0, false, FailureCategory.TLS_HOSTNAME_FAILURE, "TLS Hostname Error: " + msg, attempt);
                }
                if (msg.contains("timeout") || msg.contains("timed out")) {
                    if (attempt < maxAttempts) {
                        try { Thread.sleep(backoffMs); } catch (InterruptedException ignored) {}
                        backoffMs *= 2;
                        continue;
                    }
                    return new FetchResult(0, false, FailureCategory.CONNECT_TIMEOUT, "Timeout: " + msg, attempt);
                }
                return new FetchResult(0, false, FailureCategory.OTHER_FAILURE, "Connection Error: " + msg, attempt);
            }
        }

        return new FetchResult(0, false, FailureCategory.OTHER_FAILURE, "Max retries exceeded", maxAttempts);
    }

    /**
     * Resolves the primary and backup official source URLs for a scholarship in safe priority order.
     */
    public List<String> getCandidateSourceUrls(Scholarship sch) {
        List<String> candidates = new ArrayList<>();
        if (sch.getOfficialWebsiteUrl() != null && !sch.getOfficialWebsiteUrl().isBlank()) {
            candidates.add(sch.getOfficialWebsiteUrl().trim());
        }
        if (sch.getOfficialApplicationUrl() != null && !sch.getOfficialApplicationUrl().isBlank()) {
            String appUrl = sch.getOfficialApplicationUrl().trim();
            if (!candidates.contains(appUrl)) {
                candidates.add(appUrl);
            }
        }
        if (sch.getOfficialGuidelinePdfUrl() != null && !sch.getOfficialGuidelinePdfUrl().isBlank()) {
            String pdfUrl = sch.getOfficialGuidelinePdfUrl().trim();
            if (!candidates.contains(pdfUrl)) {
                candidates.add(pdfUrl);
            }
        }
        return candidates;
    }

    /**
     * Synchronizes scholarships against official sources with bounded concurrency and failure classification.
     */
    public Map<String, Object> syncOfficialSourceRecords(List<Map<String, Object>> incomingRecords) {
        int checkedCount = 0;
        int unchangedCount = 0;
        int pendingReviewCount = 0;
        int failedCount = 0;
        int skippedCount = 0;
        int newSchemesQueued = 0;
        List<String> stagedReviewIds = Collections.synchronizedList(new ArrayList<>());

        Map<FailureCategory, AtomicInteger> failureCounters = new EnumMap<>(FailureCategory.class);
        for (FailureCategory cat : FailureCategory.values()) {
            failureCounters.put(cat, new AtomicInteger(0));
        }

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
                        existing.setLastVerifiedAt(OffsetDateTime.now());
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
                            unchangedCount++;
                        }
                        scholarshipRepository.save(existing);
                    }
                } else {
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
            // Case B: Standard 12-hour scheduler run — load all scholarships from database
            List<Scholarship> allScholarships = scholarshipRepository.findAll();
            log.info("[SYNC] Loaded {} scholarship record(s) from database repository.", allScholarships.size());

            if (allScholarships.isEmpty()) {
                log.warn("[SYNC WARN] 0 scholarships found in database to synchronize.");
            }

            // Bounded concurrency pool (4 workers) for safe, parallel official source checks
            ExecutorService executor = Executors.newFixedThreadPool(4);
            List<CompletableFuture<Void>> futures = new ArrayList<>();

            AtomicInteger atomicUnchanged = new AtomicInteger(0);
            AtomicInteger atomicFailed = new AtomicInteger(0);
            AtomicInteger atomicSkipped = new AtomicInteger(0);

            for (Scholarship sch : allScholarships) {
                checkedCount++;
                CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
                    try {
                        // 1. Ensure baseline hash exists
                        if (sch.getContentHash() == null || sch.getContentHash().isBlank()) {
                            String baselineHash = calculateScholarshipContentHash(sch);
                            sch.setContentHash(baselineHash);
                        }

                        // 2. Identify candidate source URLs in safe priority order
                        List<String> candidateUrls = getCandidateSourceUrls(sch);

                        if (candidateUrls.isEmpty()) {
                            atomicSkipped.incrementAndGet();
                            failureCounters.get(FailureCategory.INVALID_URL).incrementAndGet();
                            sch.setLastCheckedAt(OffsetDateTime.now());
                            scholarshipRepository.save(sch);
                            return;
                        }

                        FetchResult bestResult = null;
                        for (String url : candidateUrls) {
                            if (!isValidPublicHttpUrl(url)) {
                                continue;
                            }
                            FetchResult res = fetchOfficialSource(url);
                            if (res.isSuccess()) {
                                bestResult = res;
                                break;
                            } else {
                                if (bestResult == null) bestResult = res;
                            }
                        }

                        if (bestResult != null && bestResult.isSuccess()) {
                            atomicUnchanged.incrementAndGet();
                            sch.setLastCheckedAt(OffsetDateTime.now());
                            sch.setLastVerifiedAt(OffsetDateTime.now());
                            scholarshipRepository.save(sch);
                            log.info("[SYNC OK] Verified {} (HTTP {})", sch.getId(), bestResult.getStatusCode());
                        } else {
                            FailureCategory cat = (bestResult != null) ? bestResult.getCategory() : FailureCategory.INVALID_URL;
                            failureCounters.get(cat).incrementAndGet();
                            if (cat == FailureCategory.INVALID_URL) {
                                atomicSkipped.incrementAndGet();
                            } else {
                                atomicFailed.incrementAndGet();
                            }
                            sch.setLastCheckedAt(OffsetDateTime.now());
                            // Do NOT modify content_hash or last_verified_at on failure
                            scholarshipRepository.save(sch);
                            log.warn("[SYNC FAIL] {} check failed [{}]: {}", sch.getId(), cat, (bestResult != null ? bestResult.getMessage() : "No valid URL"));
                        }
                    } catch (Exception schErr) {
                        atomicFailed.incrementAndGet();
                        failureCounters.get(FailureCategory.OTHER_FAILURE).incrementAndGet();
                        log.error("[SYNC ERROR] Exception synchronizing {}: {}", sch.getId(), schErr.getMessage());
                    }
                }, executor);
                futures.add(future);
            }

            try {
                CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
            } finally {
                executor.shutdown();
            }

            unchangedCount = atomicUnchanged.get();
            failedCount = atomicFailed.get();
            skippedCount = atomicSkipped.get();
        }

        Map<String, Integer> failureBreakdown = new LinkedHashMap<>();
        failureBreakdown.put("CONNECT_TIMEOUT", failureCounters.get(FailureCategory.CONNECT_TIMEOUT).get());
        failureBreakdown.put("READ_TIMEOUT", failureCounters.get(FailureCategory.READ_TIMEOUT).get());
        failureBreakdown.put("HTTP_403", failureCounters.get(FailureCategory.HTTP_403).get());
        failureBreakdown.put("HTTP_404", failureCounters.get(FailureCategory.HTTP_404).get());
        failureBreakdown.put("HTTP_429", failureCounters.get(FailureCategory.HTTP_429).get());
        failureBreakdown.put("HTTP_5XX", failureCounters.get(FailureCategory.HTTP_5XX).get());
        failureBreakdown.put("DNS_FAILURE", failureCounters.get(FailureCategory.DNS_FAILURE).get());
        failureBreakdown.put("TLS_CERTIFICATE_FAILURE", failureCounters.get(FailureCategory.TLS_CERTIFICATE_FAILURE).get());
        failureBreakdown.put("TLS_HOSTNAME_FAILURE", failureCounters.get(FailureCategory.TLS_HOSTNAME_FAILURE).get());
        failureBreakdown.put("INVALID_URL", failureCounters.get(FailureCategory.INVALID_URL).get());
        failureBreakdown.put("OTHER_FAILURE", failureCounters.get(FailureCategory.OTHER_FAILURE).get());

        log.info("[SYNC COMPLETE] Checked: {}, Unchanged: {}, PendingReview: {}, Failed: {}, Skipped: {}, Breakdown: {}",
                checkedCount, unchangedCount, pendingReviewCount, failedCount, skippedCount, failureBreakdown);

        Map<String, Object> summary = new HashMap<>();
        summary.put("checkedCount", checkedCount);
        summary.put("unchangedCount", unchangedCount);
        summary.put("pendingReviewCount", pendingReviewCount);
        summary.put("failedCount", failedCount);
        summary.put("skippedCount", skippedCount);
        summary.put("newSchemesQueued", newSchemesQueued);
        summary.put("failureBreakdown", failureBreakdown);
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
