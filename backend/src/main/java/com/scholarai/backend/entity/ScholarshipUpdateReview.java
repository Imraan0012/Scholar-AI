package com.scholarai.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "scholarship_update_reviews")
public class ScholarshipUpdateReview {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "scholarship_id", length = 100, nullable = false)
    private String scholarshipId;

    @Column(name = "source_id", length = 100)
    private String sourceId;

    @Column(name = "source_url", columnDefinition = "TEXT", nullable = false)
    private String sourceUrl;

    @Column(name = "changed_fields", columnDefinition = "JSONB", nullable = false)
    private String changedFields = "[]";

    @Column(name = "old_values", columnDefinition = "JSONB", nullable = false)
    private String oldValues = "{}";

    @Column(name = "proposed_values", columnDefinition = "JSONB", nullable = false)
    private String proposedValues = "{}";

    @Column(name = "change_summary", columnDefinition = "TEXT", nullable = false)
    private String changeSummary;

    @Column(name = "status", length = 50, nullable = false)
    private String status = "PENDING_REVIEW";

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "reviewed_at")
    private OffsetDateTime reviewedAt;

    @Column(name = "reviewed_by", length = 100)
    private String reviewedBy;

    public ScholarshipUpdateReview() {}

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getScholarshipId() { return scholarshipId; }
    public void setScholarshipId(String scholarshipId) { this.scholarshipId = scholarshipId; }

    public String getSourceId() { return sourceId; }
    public void setSourceId(String sourceId) { this.sourceId = sourceId; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public String getChangedFields() { return changedFields; }
    public void setChangedFields(String changedFields) { this.changedFields = changedFields; }

    public String getOldValues() { return oldValues; }
    public void setOldValues(String oldValues) { this.oldValues = oldValues; }

    public String getProposedValues() { return proposedValues; }
    public void setProposedValues(String proposedValues) { this.proposedValues = proposedValues; }

    public String getChangeSummary() { return changeSummary; }
    public void setChangeSummary(String changeSummary) { this.changeSummary = changeSummary; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(OffsetDateTime reviewedAt) { this.reviewedAt = reviewedAt; }

    public String getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }
}
