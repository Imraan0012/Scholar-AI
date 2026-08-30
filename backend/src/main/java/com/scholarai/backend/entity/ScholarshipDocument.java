package com.scholarai.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "scholarship_documents")
public class ScholarshipDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "scholarship_id", insertable = false, updatable = false)
    private String scholarshipId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scholarship_id", nullable = false)
    @JsonIgnore
    private Scholarship scholarship;

    @Column(name = "document_code", length = 100, nullable = false)
    private String documentCode;

    @Column(name = "document_name", length = 200, nullable = false)
    private String documentName;

    @Column(name = "issuing_authority", length = 200)
    private String issuingAuthority;

    @Column(name = "is_mandatory", nullable = false)
    private Boolean isMandatory = true;

    @Column(name = "guidance_notes", columnDefinition = "TEXT")
    private String guidanceNotes;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    public ScholarshipDocument() {}

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getScholarshipId() { return scholarshipId; }
    public void setScholarshipId(String scholarshipId) { this.scholarshipId = scholarshipId; }

    public Scholarship getScholarship() { return scholarship; }
    public void setScholarship(Scholarship scholarship) { this.scholarship = scholarship; }

    public String getDocumentCode() { return documentCode; }
    public void setDocumentCode(String documentCode) { this.documentCode = documentCode; }

    public String getDocumentName() { return documentName; }
    public void setDocumentName(String documentName) { this.documentName = documentName; }

    public String getIssuingAuthority() { return issuingAuthority; }
    public void setIssuingAuthority(String issuingAuthority) { this.issuingAuthority = issuingAuthority; }

    public Boolean getIsMandatory() { return isMandatory; }
    public void setIsMandatory(Boolean mandatory) { isMandatory = mandatory; }

    public String getGuidanceNotes() { return guidanceNotes; }
    public void setGuidanceNotes(String guidanceNotes) { this.guidanceNotes = guidanceNotes; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
