package com.scholarai.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "student_applications", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "scholarship_id"})
})
public class StudentApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "scholarship_id", length = 100, nullable = false)
    private String scholarshipId;

    @Column(name = "status", length = 50, nullable = false)
    private String status = "APPLIED";

    @Column(name = "applied_at")
    private OffsetDateTime appliedAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    public StudentApplication() {}

    public StudentApplication(UUID studentId, String scholarshipId, String status) {
        this.studentId = studentId;
        this.scholarshipId = scholarshipId;
        this.status = status;
    }

    @PrePersist
    protected void onCreate() {
        if (appliedAt == null) appliedAt = OffsetDateTime.now();
        if (updatedAt == null) updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getStudentId() { return studentId; }
    public void setStudentId(UUID studentId) { this.studentId = studentId; }

    public String getScholarshipId() { return scholarshipId; }
    public void setScholarshipId(String scholarshipId) { this.scholarshipId = scholarshipId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public OffsetDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(OffsetDateTime appliedAt) { this.appliedAt = appliedAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
