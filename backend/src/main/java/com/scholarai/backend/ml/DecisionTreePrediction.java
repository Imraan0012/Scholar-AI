package com.scholarai.backend.ml;

import java.util.ArrayList;
import java.util.List;

public class DecisionTreePrediction {

    private double matchScore;
    private double confidence = 75.0;
    private String tier;
    private boolean eligible;
    private String explanation;
    private List<String> decisionPath = new ArrayList<>();
    private List<String> keyStrengths = new ArrayList<>();
    private List<String> criticalGaps = new ArrayList<>();

    public DecisionTreePrediction() {}

    public DecisionTreePrediction(double matchScore, String tier, boolean eligible, String explanation) {
        this.matchScore = matchScore;
        this.tier = tier;
        this.eligible = eligible;
        this.explanation = explanation;
    }

    public double getMatchScore() { return matchScore; }
    public void setMatchScore(double matchScore) { this.matchScore = matchScore; }

    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }

    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }

    public boolean isEligible() { return eligible; }
    public void setEligible(boolean eligible) { this.eligible = eligible; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public List<String> getDecisionPath() { return decisionPath; }
    public void setDecisionPath(List<String> decisionPath) { this.decisionPath = decisionPath; }

    public List<String> getKeyStrengths() { return keyStrengths; }
    public void setKeyStrengths(List<String> keyStrengths) { this.keyStrengths = keyStrengths; }

    public List<String> getCriticalGaps() { return criticalGaps; }
    public void setCriticalGaps(List<String> criticalGaps) { this.criticalGaps = criticalGaps; }
}
