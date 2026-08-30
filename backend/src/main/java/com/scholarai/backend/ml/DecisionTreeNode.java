package com.scholarai.backend.ml;

import java.util.function.Predicate;

/**
 * Node representation in the Decision Tree for deterministic & probabilistic matching.
 */
public class DecisionTreeNode {

    private String featureName;
    private Predicate<FeatureVector> condition;
    private DecisionTreeNode leftTrue;
    private DecisionTreeNode rightFalse;
    private boolean isLeaf;
    private double matchProbability;
    private String tier;
    private String explanation;

    public DecisionTreeNode() {}

    public static DecisionTreeNode leaf(double matchProbability, String tier, String explanation) {
        DecisionTreeNode node = new DecisionTreeNode();
        node.isLeaf = true;
        node.matchProbability = matchProbability;
        node.tier = tier;
        node.explanation = explanation;
        return node;
    }

    public static DecisionTreeNode branch(String featureName, Predicate<FeatureVector> condition, DecisionTreeNode leftTrue, DecisionTreeNode rightFalse) {
        DecisionTreeNode node = new DecisionTreeNode();
        node.isLeaf = false;
        node.featureName = featureName;
        node.condition = condition;
        node.leftTrue = leftTrue;
        node.rightFalse = rightFalse;
        return node;
    }

    public boolean evaluate(FeatureVector fv) {
        if (condition == null) return true;
        return condition.test(fv);
    }

    public boolean isLeaf() { return isLeaf; }
    public String getFeatureName() { return featureName; }
    public DecisionTreeNode getLeftTrue() { return leftTrue; }
    public DecisionTreeNode getRightFalse() { return rightFalse; }
    public double getMatchProbability() { return matchProbability; }
    public String getTier() { return tier; }
    public String getExplanation() { return explanation; }
}
