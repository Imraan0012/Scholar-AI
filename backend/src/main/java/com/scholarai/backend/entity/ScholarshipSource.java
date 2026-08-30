package com.scholarai.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "scholarship_sources")
public class ScholarshipSource {

    @Id
    @Column(name = "id", length = 100, nullable = false)
    private String id;

    @Column(name = "name", length = 300, nullable = false)
    private String name;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "provider_type", length = 100, nullable = false)
    private String providerType;

    @Column(name = "portal_url", columnDefinition = "TEXT", nullable = false)
    private String portalUrl;

    @Column(name = "portal_name", length = 300)
    private String portalName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "state_code", length = 10)
    private String stateCode;

    @Column(name = "reliability_tier", length = 100)
    private String reliabilityTier = "LEVEL_1_OFFICIAL_GOVT";

    @Column(name = "verification_status", length = 50, nullable = false)
    private String verificationStatus = "VERIFIED";

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @Column(name = "active_schemes_count")
    private Integer activeSchemesCount = 0;

    @Column(name = "sync_frequency", length = 50)
    private String syncFrequency = "WEEKLY";

    @Column(name = "last_verified_at")
    private OffsetDateTime lastVerifiedAt;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    public ScholarshipSource() {}

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

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getProviderType() { return providerType; }
    public void setProviderType(String providerType) { this.providerType = providerType; }

    public String getPortalUrl() { return portalUrl; }
    public void setPortalUrl(String portalUrl) { this.portalUrl = portalUrl; }

    public String getPortalName() { return portalName; }
    public void setPortalName(String portalName) { this.portalName = portalName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getStateCode() { return stateCode; }
    public void setStateCode(String stateCode) { this.stateCode = stateCode; }

    public String getReliabilityTier() { return reliabilityTier; }
    public void setReliabilityTier(String reliabilityTier) { this.reliabilityTier = reliabilityTier; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public Integer getActiveSchemesCount() { return activeSchemesCount; }
    public void setActiveSchemesCount(Integer activeSchemesCount) { this.activeSchemesCount = activeSchemesCount; }

    public String getSyncFrequency() { return syncFrequency; }
    public void setSyncFrequency(String syncFrequency) { this.syncFrequency = syncFrequency; }

    public OffsetDateTime getLastVerifiedAt() { return lastVerifiedAt; }
    public void setLastVerifiedAt(OffsetDateTime lastVerifiedAt) { this.lastVerifiedAt = lastVerifiedAt; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
