package com.scholarai.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "scholarship_scan_runs")
public class ScholarshipScanRun {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "started_at", nullable = false)
    private OffsetDateTime startedAt;

    @Column(name = "completed_at")
    private OffsetDateTime completedAt;

    @Column(name = "status", length = 50, nullable = false)
    private String status = "RUNNING"; // QUEUED, RUNNING, COMPLETED, PARTIAL, FAILED

    @Column(name = "sources_total", nullable = false)
    private Integer sourcesTotal = 0;

    @Column(name = "sources_checked", nullable = false)
    private Integer sourcesChecked = 0;

    @Column(name = "sources_successful", nullable = false)
    private Integer sourcesSuccessful = 0;

    @Column(name = "sources_failed", nullable = false)
    private Integer sourcesFailed = 0;

    @Column(name = "raw_candidates", nullable = false)
    private Integer rawCandidates = 0;

    @Column(name = "duplicates", nullable = false)
    private Integer duplicates = 0;

    @Column(name = "new_candidates", nullable = false)
    private Integer newCandidates = 0;

    @Column(name = "auto_published", nullable = false)
    private Integer autoPublished = 0;

    @Column(name = "pending_review", nullable = false)
    private Integer pendingReview = 0;

    @Column(name = "scholarships_updated", nullable = false)
    private Integer scholarshipsUpdated = 0;

    @Column(name = "deadlines_updated", nullable = false)
    private Integer deadlinesUpdated = 0;

    @Column(name = "closed_count", nullable = false)
    private Integer closedCount = 0;

    @Column(name = "reopened_count", nullable = false)
    private Integer reopenedCount = 0;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "error_summary", columnDefinition = "JSONB")
    private String errorSummary = "{}";

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    public ScholarshipScanRun() {}

    @PrePersist
    protected void onCreate() {
        if (startedAt == null) startedAt = OffsetDateTime.now();
        if (createdAt == null) createdAt = OffsetDateTime.now();
        if (updatedAt == null) updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public OffsetDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(OffsetDateTime startedAt) { this.startedAt = startedAt; }

    public OffsetDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(OffsetDateTime completedAt) { this.completedAt = completedAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getSourcesTotal() { return sourcesTotal; }
    public void setSourcesTotal(Integer sourcesTotal) { this.sourcesTotal = sourcesTotal; }

    public Integer getSourcesChecked() { return sourcesChecked; }
    public void setSourcesChecked(Integer sourcesChecked) { this.sourcesChecked = sourcesChecked; }

    public Integer getSourcesSuccessful() { return sourcesSuccessful; }
    public void setSourcesSuccessful(Integer sourcesSuccessful) { this.sourcesSuccessful = sourcesSuccessful; }

    public Integer getSourcesFailed() { return sourcesFailed; }
    public void setSourcesFailed(Integer sourcesFailed) { this.sourcesFailed = sourcesFailed; }

    public Integer getRawCandidates() { return rawCandidates; }
    public void setRawCandidates(Integer rawCandidates) { this.rawCandidates = rawCandidates; }

    public Integer getDuplicates() { return duplicates; }
    public void setDuplicates(Integer duplicates) { this.duplicates = duplicates; }

    public Integer getNewCandidates() { return newCandidates; }
    public void setNewCandidates(Integer newCandidates) { this.newCandidates = newCandidates; }

    public Integer getAutoPublished() { return autoPublished; }
    public void setAutoPublished(Integer autoPublished) { this.autoPublished = autoPublished; }

    public Integer getPendingReview() { return pendingReview; }
    public void setPendingReview(Integer pendingReview) { this.pendingReview = pendingReview; }

    public Integer getScholarshipsUpdated() { return scholarshipsUpdated; }
    public void setScholarshipsUpdated(Integer scholarshipsUpdated) { this.scholarshipsUpdated = scholarshipsUpdated; }

    public Integer getDeadlinesUpdated() { return deadlinesUpdated; }
    public void setDeadlinesUpdated(Integer deadlinesUpdated) { this.deadlinesUpdated = deadlinesUpdated; }

    public Integer getClosedCount() { return closedCount; }
    public void setClosedCount(Integer closedCount) { this.closedCount = closedCount; }

    public Integer getReopenedCount() { return reopenedCount; }
    public void setReopenedCount(Integer reopenedCount) { this.reopenedCount = reopenedCount; }

    public String getErrorSummary() { return errorSummary; }
    public void setErrorSummary(String errorSummary) { this.errorSummary = errorSummary; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
