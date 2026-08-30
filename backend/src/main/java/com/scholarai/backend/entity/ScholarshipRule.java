package com.scholarai.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "scholarship_eligibility_rules")
public class ScholarshipRule {

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

    @Column(name = "rule_category", length = 50, nullable = false)
    private String ruleCategory = "GENERAL";

    @Column(name = "condition_field", length = 100, nullable = false)
    private String conditionField;

    @Column(name = "operator", length = 30, nullable = false)
    private String operator = "==";

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "value_json", columnDefinition = "jsonb", nullable = false)
    private Object valueJson;

    @Column(name = "unit", length = 30)
    private String unit = "NONE";

    @Column(name = "is_mandatory", nullable = false)
    private Boolean isMandatory = true;

    @Column(name = "rule_description", columnDefinition = "TEXT", nullable = false)
    private String ruleDescription;

    @Column(name = "failure_message", columnDefinition = "TEXT", nullable = false)
    private String failureMessage;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    public ScholarshipRule() {}

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

    public String getRuleCategory() { return ruleCategory; }
    public void setRuleCategory(String ruleCategory) { this.ruleCategory = ruleCategory; }

    public String getConditionField() { return conditionField; }
    public void setConditionField(String conditionField) { this.conditionField = conditionField; }

    public String getOperator() { return operator; }
    public void setOperator(String operator) { this.operator = operator; }

    public Object getValueJson() { return valueJson; }
    public void setValueJson(Object valueJson) { this.valueJson = valueJson; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Boolean getIsMandatory() { return isMandatory; }
    public void setIsMandatory(Boolean mandatory) { isMandatory = mandatory; }

    public String getRuleDescription() { return ruleDescription; }
    public void setRuleDescription(String ruleDescription) { this.ruleDescription = ruleDescription; }

    public String getFailureMessage() { return failureMessage; }
    public void setFailureMessage(String failureMessage) { this.failureMessage = failureMessage; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
