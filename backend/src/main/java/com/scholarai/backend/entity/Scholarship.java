package com.scholarai.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "scholarships")
public class Scholarship {

    @Id
    @Column(name = "id", length = 100, nullable = false)
    private String id;

    @Column(name = "name", length = 300, nullable = false)
    private String name;

    @Column(name = "provider", length = 300, nullable = false)
    private String provider;

    @Column(name = "provider_type", length = 80, nullable = false)
    private String providerType = "GOVERNMENT";

    @Column(name = "government_level", length = 80, nullable = false)
    private String governmentLevel = "CENTRAL";

    @Column(name = "state", length = 100, nullable = false)
    private String state = "ALL_INDIA";

    @Column(name = "ministry_or_department", length = 300)
    private String ministryOrDepartment;

    @Column(name = "academic_year", length = 20, nullable = false)
    private String academicYear = "2026-27";

    @Column(name = "application_type", length = 30, nullable = false)
    private String applicationType = "FRESH_AND_RENEWAL";

    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "amount_display", length = 200, nullable = false)
    private String amountDisplay;

    @Column(name = "amount_min", precision = 12, scale = 2)
    private BigDecimal amountMin = BigDecimal.ZERO;

    @Column(name = "amount_max", precision = 12, scale = 2, nullable = false)
    private BigDecimal amountMax;

    @Column(name = "amount_type", length = 80, nullable = false)
    private String amountType = "ANNUAL_GRANT";

    @Column(name = "official_website_url", columnDefinition = "TEXT", nullable = false)
    private String officialWebsiteUrl;

    @Column(name = "official_application_url", columnDefinition = "TEXT", nullable = false)
    private String officialApplicationUrl;

    @Column(name = "official_guideline_pdf_url", columnDefinition = "TEXT")
    private String officialGuidelinePdfUrl;

    @Column(name = "source_reliability", length = 50, nullable = false)
    private String sourceReliability = "LEVEL_1_OFFICIAL_GOVT";

    @Column(name = "verification_status", length = 50, nullable = false)
    private String verificationStatus = "VERIFIED";

    @Column(name = "last_verified_at")
    private OffsetDateTime lastVerifiedAt;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "scholarship", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties(value = {"scholarship", "hibernateLazyInitializer", "handler"}, ignoreUnknown = true)
    private List<ScholarshipRule> rules = new ArrayList<>();

    @OneToMany(mappedBy = "scholarship", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties(value = {"scholarship", "hibernateLazyInitializer", "handler"}, ignoreUnknown = true)
    private List<ScholarshipDocument> documents = new ArrayList<>();

    public Scholarship() {}

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
        if (updatedAt == null) updatedAt = OffsetDateTime.now();
        if (lastVerifiedAt == null) lastVerifiedAt = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getProviderType() { return providerType; }
    public void setProviderType(String providerType) { this.providerType = providerType; }

    public String getGovernmentLevel() { return governmentLevel; }
    public void setGovernmentLevel(String governmentLevel) { this.governmentLevel = governmentLevel; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getMinistryOrDepartment() { return ministryOrDepartment; }
    public void setMinistryOrDepartment(String ministryOrDepartment) { this.ministryOrDepartment = ministryOrDepartment; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public String getApplicationType() { return applicationType; }
    public void setApplicationType(String applicationType) { this.applicationType = applicationType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAmountDisplay() { return amountDisplay; }
    public void setAmountDisplay(String amountDisplay) { this.amountDisplay = amountDisplay; }

    public BigDecimal getAmountMin() { return amountMin; }
    public void setAmountMin(BigDecimal amountMin) { this.amountMin = amountMin; }

    public BigDecimal getAmountMax() { return amountMax; }
    public void setAmountMax(BigDecimal amountMax) { this.amountMax = amountMax; }

    public String getAmountType() { return amountType; }
    public void setAmountType(String amountType) { this.amountType = amountType; }

    public String getOfficialWebsiteUrl() { return officialWebsiteUrl; }
    public void setOfficialWebsiteUrl(String officialWebsiteUrl) { this.officialWebsiteUrl = officialWebsiteUrl; }

    public String getOfficialApplicationUrl() { return officialApplicationUrl; }
    public void setOfficialApplicationUrl(String officialApplicationUrl) { this.officialApplicationUrl = officialApplicationUrl; }

    public String getOfficialGuidelinePdfUrl() { return officialGuidelinePdfUrl; }
    public void setOfficialGuidelinePdfUrl(String officialGuidelinePdfUrl) { this.officialGuidelinePdfUrl = officialGuidelinePdfUrl; }

    public String getSourceReliability() { return sourceReliability; }
    public void setSourceReliability(String sourceReliability) { this.sourceReliability = sourceReliability; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public OffsetDateTime getLastVerifiedAt() { return lastVerifiedAt; }
    public void setLastVerifiedAt(OffsetDateTime lastVerifiedAt) { this.lastVerifiedAt = lastVerifiedAt; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<ScholarshipRule> getRules() { return rules; }
    public void setRules(List<ScholarshipRule> rules) { this.rules = rules; }

    public List<ScholarshipDocument> getDocuments() { return documents; }
    public void setDocuments(List<ScholarshipDocument> documents) { this.documents = documents; }
}
