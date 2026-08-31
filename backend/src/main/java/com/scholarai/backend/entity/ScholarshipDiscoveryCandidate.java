package com.scholarai.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "scholarship_discovery_candidates")
public class ScholarshipDiscoveryCandidate {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "source_id", length = 100, nullable = false)
    private String sourceId;

    @Column(name = "external_scheme_id", length = 150)
    private String externalSchemeId;

    @Column(name = "candidate_name", length = 300, nullable = false)
    private String candidateName;

    @Column(name = "provider", length = 300, nullable = false)
    private String provider;

    @Column(name = "state", length = 100, nullable = false)
    private String state = "ALL_INDIA";

    @Column(name = "government_level", length = 80, nullable = false)
    private String governmentLevel = "CENTRAL";

    @Column(name = "amount_display", length = 200)
    private String amountDisplay;

    @Column(name = "source_url", columnDefinition = "TEXT", nullable = false)
    private String sourceUrl;

    @Column(name = "candidate_payload", columnDefinition = "JSONB", nullable = false)
    private String candidatePayload;

    @Column(name = "content_hash", length = 64, nullable = false)
    private String contentHash;

    @Column(name = "duplicate_of", length = 100)
    private String duplicateOf;

    @Column(name = "confidence_score")
    private Double confidenceScore = 1.0;

    @Column(name = "status", length = 50, nullable = false)
    private String status = "PENDING_REVIEW"; // PENDING_REVIEW, APPROVED, REJECTED, PUBLISHED

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "reviewed_at")
    private OffsetDateTime reviewedAt;

    @Column(name = "reviewed_by", length = 100)
    private String reviewedBy;

    public ScholarshipDiscoveryCandidate() {}

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getSourceId() { return sourceId; }
    public void setSourceId(String sourceId) { this.sourceId = sourceId; }

    public String getExternalSchemeId() { return externalSchemeId; }
    public void setExternalSchemeId(String externalSchemeId) { this.externalSchemeId = externalSchemeId; }

    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getGovernmentLevel() { return governmentLevel; }
    public void setGovernmentLevel(String governmentLevel) { this.governmentLevel = governmentLevel; }

    public String getAmountDisplay() { return amountDisplay; }
    public void setAmountDisplay(String amountDisplay) { this.amountDisplay = amountDisplay; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public String getCandidatePayload() { return candidatePayload; }
    public void setCandidatePayload(String candidatePayload) { this.candidatePayload = candidatePayload; }

    public String getContentHash() { return contentHash; }
    public void setContentHash(String contentHash) { this.contentHash = contentHash; }

    public String getDuplicateOf() { return duplicateOf; }
    public void setDuplicateOf(String duplicateOf) { this.duplicateOf = duplicateOf; }

    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(OffsetDateTime reviewedAt) { this.reviewedAt = reviewedAt; }

    public String getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }
}
