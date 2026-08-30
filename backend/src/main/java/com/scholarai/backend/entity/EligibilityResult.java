package com.scholarai.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "eligibility_results")
public class EligibilityResult {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "student_id")
    private UUID studentId;

    @Column(name = "scholarship_id", length = 100, nullable = false)
    private String scholarshipId;

    @Column(name = "evaluation_status", length = 30, nullable = false)
    private String evaluationStatus = "ELIGIBLE"; // ELIGIBLE, POSSIBLE_MATCH, NOT_ELIGIBLE

    @Column(name = "match_score", nullable = false)
    private Integer matchScore = 100;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "matched_criteria", columnDefinition = "jsonb", nullable = false)
    private List<String> matchedCriteria = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "failed_criteria", columnDefinition = "jsonb", nullable = false)
    private List<String> failedCriteria = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "missing_information", columnDefinition = "jsonb", nullable = false)
    private List<String> missingInformation = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "required_documents", columnDefinition = "jsonb", nullable = false)
    private List<Object> requiredDocuments = new ArrayList<>();

    @Column(name = "recommendation_rank")
    private Integer recommendationRank = 0;

    @Column(name = "evaluation_explanation", columnDefinition = "TEXT", nullable = false)
    private String evaluationExplanation;

    @Column(name = "evaluated_at")
    private OffsetDateTime evaluatedAt;

    public EligibilityResult() {}

    @PrePersist
    protected void onCreate() {
        if (evaluatedAt == null) evaluatedAt = OffsetDateTime.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getStudentId() { return studentId; }
    public void setStudentId(UUID studentId) { this.studentId = studentId; }

    public String getScholarshipId() { return scholarshipId; }
    public void setScholarshipId(String scholarshipId) { this.scholarshipId = scholarshipId; }

    public String getEvaluationStatus() { return evaluationStatus; }
    public void setEvaluationStatus(String evaluationStatus) { this.evaluationStatus = evaluationStatus; }

    public Integer getMatchScore() { return matchScore; }
    public void setMatchScore(Integer matchScore) { this.matchScore = matchScore; }

    public List<String> getMatchedCriteria() { return matchedCriteria; }
    public void setMatchedCriteria(List<String> matchedCriteria) { this.matchedCriteria = matchedCriteria; }

    public List<String> getFailedCriteria() { return failedCriteria; }
    public void setFailedCriteria(List<String> failedCriteria) { this.failedCriteria = failedCriteria; }

    public List<String> getMissingInformation() { return missingInformation; }
    public void setMissingInformation(List<String> missingInformation) { this.missingInformation = missingInformation; }

    public List<Object> getRequiredDocuments() { return requiredDocuments; }
    public void setRequiredDocuments(List<Object> requiredDocuments) { this.requiredDocuments = requiredDocuments; }

    public Integer getRecommendationRank() { return recommendationRank; }
    public void setRecommendationRank(Integer recommendationRank) { this.recommendationRank = recommendationRank; }

    public String getEvaluationExplanation() { return evaluationExplanation; }
    public void setEvaluationExplanation(String evaluationExplanation) { this.evaluationExplanation = evaluationExplanation; }

    public OffsetDateTime getEvaluatedAt() { return evaluatedAt; }
    public void setEvaluatedAt(OffsetDateTime evaluatedAt) { this.evaluatedAt = evaluatedAt; }
}
