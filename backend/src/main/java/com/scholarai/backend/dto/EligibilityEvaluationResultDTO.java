package com.scholarai.backend.dto;

import java.util.ArrayList;
import java.util.List;

public class EligibilityEvaluationResultDTO {
    private String scholarshipId;
    private String scholarshipName;
    private String evaluationStatus; // ELIGIBLE, POSSIBLE_MATCH, NOT_ELIGIBLE
    private String tier; // STRONG_MATCH, GOOD_MATCH, POSSIBLE_MATCH, INELIGIBLE
    private boolean isEligible;
    private int matchScore;
    private List<String> matchedCriteria = new ArrayList<>();
    private List<String> failedCriteria = new ArrayList<>();
    private List<String> missingInformation = new ArrayList<>();
    private List<Object> requiredDocuments = new ArrayList<>();
    private String deadlineStatus = "OPEN"; // OPEN, CLOSING_SOON, CLOSED, YEAR_ROUND
    private String explanation;
    private Object scholarship;

    public EligibilityEvaluationResultDTO() {}

    public String getScholarshipId() { return scholarshipId; }
    public void setScholarshipId(String scholarshipId) { this.scholarshipId = scholarshipId; }

    public String getScholarshipName() { return scholarshipName; }
    public void setScholarshipName(String scholarshipName) { this.scholarshipName = scholarshipName; }

    public String getEvaluationStatus() { return evaluationStatus; }
    public void setEvaluationStatus(String evaluationStatus) { this.evaluationStatus = evaluationStatus; }

    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }

    public boolean isEligible() { return isEligible; }
    public void setEligible(boolean eligible) { isEligible = eligible; }

    public int getMatchScore() { return matchScore; }
    public void setMatchScore(int matchScore) { this.matchScore = matchScore; }

    public List<String> getMatchedCriteria() { return matchedCriteria; }
    public void setMatchedCriteria(List<String> matchedCriteria) { this.matchedCriteria = matchedCriteria; }

    public List<String> getFailedCriteria() { return failedCriteria; }
    public void setFailedCriteria(List<String> failedCriteria) { this.failedCriteria = failedCriteria; }

    public List<String> getMissingInformation() { return missingInformation; }
    public void setMissingInformation(List<String> missingInformation) { this.missingInformation = missingInformation; }

    public List<Object> getRequiredDocuments() { return requiredDocuments; }
    public void setRequiredDocuments(List<Object> requiredDocuments) { this.requiredDocuments = requiredDocuments; }

    public String getDeadlineStatus() { return deadlineStatus; }
    public void setDeadlineStatus(String deadlineStatus) { this.deadlineStatus = deadlineStatus; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public Object getScholarship() { return scholarship; }
    public void setScholarship(Object scholarship) { this.scholarship = scholarship; }
}
