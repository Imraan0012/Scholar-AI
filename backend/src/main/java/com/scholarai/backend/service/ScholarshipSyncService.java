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

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.OffsetDateTime;
import java.util.*;

@Service
public class ScholarshipSyncService {

    private static final Logger log = LoggerFactory.getLogger(ScholarshipSyncService.class);

    private final ScholarshipRepository scholarshipRepository;
    private final ScholarshipUpdateReviewRepository reviewRepository;
    private final ObjectMapper objectMapper;

    public ScholarshipSyncService(ScholarshipRepository scholarshipRepository,
                                  ScholarshipUpdateReviewRepository reviewRepository,
                                  ObjectMapper objectMapper) {
        this.scholarshipRepository = scholarshipRepository;
        this.reviewRepository = reviewRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Computes a deterministic SHA-256 hash of official scholarship payload attributes.
     */
    public String calculateContentHash(Map<String, Object> payload) {
        try {
            // Sort keys deterministically
            SortedMap<String, Object> sortedMap = new TreeMap<>(payload);
            String json = objectMapper.writeValueAsString(sortedMap);
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(json.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder(2 * encodedHash.length);
            for (byte b : encodedHash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            log.error("[ScholarshipSyncService] Hash calculation error: {}", e.getMessage());
            return UUID.randomUUID().toString().replace("-", "");
        }
    }

    /**
     * Audits and checks official scholarship sources.
     * Preserves all existing records. If unchanged, updates last_checked_at only.
     * If changed, stages the change into the review queue.
     */
    @Transactional
    public Map<String, Object> syncOfficialSourceRecords(List<Map<String, Object>> incomingRecords) {
        int checkedCount = 0;
        int unchangedCount = 0;
        int pendingReviewCount = 0;
        int newSchemesQueued = 0;
        List<String> stagedReviewIds = new ArrayList<>();

        for (Map<String, Object> record : incomingRecords) {
            String scholarshipId = (String) record.get("id");
            if (scholarshipId == null || scholarshipId.isBlank()) continue;

            checkedCount++;
            String newHash = calculateContentHash(record);
            Optional<Scholarship> existingOpt = scholarshipRepository.findById(scholarshipId);

            if (existingOpt.isPresent()) {
                Scholarship existing = existingOpt.get();
                existing.setLastCheckedAt(OffsetDateTime.now());

                // If content hash matches existing verified hash, no change occurred
                if (existing.getContentHash() != null && existing.getContentHash().equals(newHash)) {
                    scholarshipRepository.save(existing);
                    unchangedCount++;
                } else {
                    // Check if an identical review is already pending
                    List<ScholarshipUpdateReview> existingPending = reviewRepository
                            .findByScholarshipIdAndStatus(scholarshipId, "PENDING_REVIEW");

                    if (existingPending.isEmpty()) {
                        // Detect changed fields
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
                            review.setSourceId((String) record.getOrDefault("source_id", "OFFICIAL_PORTAL"));
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
                            log.error("[ScholarshipSyncService] Failed to stage review for {}: {}", scholarshipId, e.getMessage());
                        }
                    }
                    scholarshipRepository.save(existing);
                }
            } else {
                // Potential new scholarship scheme discovered
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
                    log.error("[ScholarshipSyncService] Failed to queue new scheme review: {}", e.getMessage());
                }
            }
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("checkedCount", checkedCount);
        summary.put("unchangedCount", unchangedCount);
        summary.put("pendingReviewCount", pendingReviewCount);
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
