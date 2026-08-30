package com.scholarai.backend.ml;

import com.scholarai.backend.entity.Scholarship;
import com.scholarai.backend.entity.ScholarshipRule;
import com.scholarai.backend.entity.StudentProfile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.*;

/**
 * Connects directly to the dedicated Python ML Decision Tree Microservice (Port 8001)
 * with robust deterministic native fallback.
 */
@Component
public class DecisionTreeEngine {

    private static final Logger log = LoggerFactory.getLogger(DecisionTreeEngine.class);
    private final RestTemplate restTemplate;

    @Value("${scholarai.ml.service-url:http://localhost:8001}")
    private String mlServiceUrl;

    public DecisionTreeEngine() {
        this.restTemplate = new RestTemplate();
    }

    public DecisionTreePrediction predict(StudentProfile profile, Scholarship scholarship) {
        // 1. First attempt inference via Python ML Decision Tree Service (Port 8001)
        try {
            String url = mlServiceUrl + "/predict";

            Map<String, Object> reqBody = new HashMap<>();
            reqBody.put("studentProfile", buildProfileMap(profile));
            reqBody.put("scholarship", buildScholarshipMap(scholarship));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(reqBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> body = response.getBody();

                DecisionTreePrediction pred = new DecisionTreePrediction();
                pred.setEligible(Boolean.TRUE.equals(body.get("isEligible")));
                pred.setMatchScore(((Number) body.getOrDefault("matchScore", 50.0)).doubleValue());
                pred.setTier((String) body.getOrDefault("tier", "POSSIBLE_MATCH"));
                pred.setExplanation((String) body.getOrDefault("explanation", ""));
                pred.setConfidence(((Number) body.getOrDefault("confidence", 75.0)).doubleValue());

                List<String> strengths = (List<String>) body.getOrDefault("keyStrengths", new ArrayList<>());
                List<String> gaps = (List<String>) body.getOrDefault("criticalGaps", new ArrayList<>());
                List<String> path = (List<String>) body.getOrDefault("decisionPath", new ArrayList<>());

                pred.setKeyStrengths(strengths);
                pred.setCriticalGaps(gaps);
                pred.setDecisionPath(path);

                return pred;
            }
        } catch (Exception e) {
            log.debug("Python ML service unavailable or error ({}). Using native Decision Tree engine.", e.getMessage());
        }

        // 2. Fallback: Native Java Deterministic Feature Classifier
        return predictNative(profile, scholarship);
    }

    private Map<String, Object> buildProfileMap(StudentProfile p) {
        Map<String, Object> map = new HashMap<>();
        if (p == null) return map;
        map.put("educationLevel", p.getEducationLevel());
        map.put("currentYear", p.getCurrentYear());
        map.put("class10Percentage", p.getClass10Percentage());
        map.put("class12Percentage", p.getClass12Percentage());
        map.put("undergraduateCgpa", p.getUndergraduateCgpa() != null ? p.getUndergraduateCgpa() : p.getCurrentCgpa());
        map.put("annualFamilyIncome", p.getAnnualFamilyIncome());
        map.put("gender", p.getGender());
        map.put("category", p.getCategory());
        map.put("isObcNcl", p.getIsObcNcl());
        map.put("isEws", p.getIsEws());
        map.put("domicileState", p.getDomicileState());
        map.put("hasIncomeCertificate", p.getHasIncomeCertificate());
        map.put("hasCategoryCertificate", p.getHasCategoryCertificate());
        map.put("hasDomicileCertificate", p.getHasDomicileCertificate());
        map.put("hasDisability", p.getHasDisability());
        map.put("disabilityPercentage", p.getDisabilityPercentage());
        map.put("isMinority", p.getIsMinority());
        map.put("isFirstGraduate", p.getIsFirstGraduate());
        map.put("isSingleGirlChild", p.getIsSingleGirlChild());
        map.put("isOrphan", p.getIsOrphan());
        map.put("isSingleParent", p.getIsSingleParent());
        map.put("isWardOfDefenseOrCapf", p.getIsWardOfDefenseOrCapf());
        map.put("isFarmerFamily", p.getIsFarmerFamily());
        return map;
    }

    private Map<String, Object> buildScholarshipMap(Scholarship s) {
        Map<String, Object> map = new HashMap<>();
        if (s == null) return map;
        map.put("id", s.getId());
        map.put("name", s.getName());
        map.put("governmentLevel", s.getGovernmentLevel());
        map.put("state", s.getState());

        List<Map<String, Object>> rulesList = new ArrayList<>();
        if (s.getRules() != null) {
            for (ScholarshipRule r : s.getRules()) {
                Map<String, Object> rMap = new HashMap<>();
                rMap.put("conditionField", r.getConditionField());
                rMap.put("operator", r.getOperator());
                rMap.put("valueJson", r.getValueJson());
                rMap.put("isMandatory", r.getIsMandatory());
                rulesList.add(rMap);
            }
        }
        map.put("rules", rulesList);
        return map;
    }

    private DecisionTreePrediction predictNative(StudentProfile profile, Scholarship scholarship) {
        FeatureVector fv = FeatureVector.fromProfile(profile);
        DecisionTreePrediction prediction = new DecisionTreePrediction();

        List<ScholarshipRule> rules = scholarship.getRules() != null ? scholarship.getRules() : new ArrayList<>();
        List<String> strengths = new ArrayList<>();
        List<String> gaps = new ArrayList<>();
        List<String> path = new ArrayList<>();

        int totalRules = rules.size();
        int passedRules = 0;
        int mandatoryFailed = 0;
        double accumulatedScore = 50.0;

        if (totalRules == 0) {
            accumulatedScore = 80.0;
            strengths.add("General financial aid criteria satisfied");
            path.add("No specific constraints defined -> Default positive branch");
        } else {
            for (ScholarshipRule rule : rules) {
                String field = rule.getConditionField() != null ? rule.getConditionField().toLowerCase() : "";
                boolean mandatory = rule.getIsMandatory() != null && rule.getIsMandatory();
                String desc = rule.getRuleDescription() != null ? rule.getRuleDescription() : "";
                String ruleVal = rule.getValueJson() != null ? rule.getValueJson().toString().toUpperCase() : "";

                boolean passed = true;

                switch (field) {
                    case "education_level": {
                        String studentEdu = (profile.getEducationLevel() != null ? profile.getEducationLevel() : "").toUpperCase().trim();
                        if (ruleVal.contains("ANY") || ruleVal.contains("ALL") || ruleVal.isEmpty()) {
                            passed = true;
                        } else {
                            passed = ruleVal.contains(studentEdu) ||
                                    (ruleVal.contains("UNDERGRADUATE") && ("CLASS_12_PASSED".equals(studentEdu) || "TWELFTH_COMPLETED".equals(studentEdu))) ||
                                    (ruleVal.contains("POLYTECHNIC") && "DIPLOMA".equals(studentEdu));
                        }
                        if (!passed) {
                            gaps.add("Requires education level in " + ruleVal + " (Current: " + studentEdu + ")");
                        } else {
                            strengths.add("Education level satisfies scheme scope");
                        }
                        break;
                    }
                    case "eligible_branches":
                    case "branch":
                    case "specialization": {
                        String studentBranch = (profile.getBranch() != null ? profile.getBranch() : "").toUpperCase().trim();
                        if (studentBranch.isEmpty() || "NOT APPLICABLE".equals(studentBranch)) {
                            passed = !mandatory;
                        } else {
                            passed = ruleVal.contains("ANY") || ruleVal.contains("ALL") || ruleVal.contains(studentBranch) || studentBranch.contains(ruleVal);
                        }
                        if (!passed) {
                            gaps.add("Requires branch in " + ruleVal + " (Your branch: " + profile.getBranch() + ")");
                        } else {
                            strengths.add("Branch criteria satisfied");
                        }
                        break;
                    }
                    case "eligible_courses":
                    case "course": {
                        String studentCourse = (profile.getCourse() != null ? profile.getCourse() : "").toUpperCase().trim();
                        if (studentCourse.isEmpty()) {
                            passed = !mandatory;
                        } else {
                            passed = ruleVal.contains("ANY") || ruleVal.contains("ALL") || ruleVal.contains(studentCourse) || studentCourse.contains(ruleVal);
                        }
                        if (!passed) {
                            gaps.add("Requires course in " + ruleVal + " (Your course: " + profile.getCourse() + ")");
                        } else {
                            strengths.add("Course criteria satisfied");
                        }
                        break;
                    }
                    case "institution":
                    case "institution_name":
                    case "target_institutions": {
                        String studentInst = (profile.getInstitutionName() != null ? profile.getInstitutionName() : "").toUpperCase().trim();
                        if (studentInst.isEmpty()) {
                            passed = !mandatory;
                        } else {
                            passed = ruleVal.contains("ANY") || ruleVal.contains("ALL") || ruleVal.contains(studentInst) || studentInst.contains(ruleVal);
                        }
                        if (!passed) {
                            gaps.add("Restricted to students of " + ruleVal + " (Your institution: " + profile.getInstitutionName() + ")");
                        } else {
                            strengths.add("Institution requirement satisfied");
                        }
                        break;
                    }
                    case "current_year": {
                        int studentYear = profile.getCurrentYear() != null ? profile.getCurrentYear() : 1;
                        if (!ruleVal.isEmpty() && !ruleVal.contains("ANY")) {
                            passed = ruleVal.contains(String.valueOf(studentYear));
                            if (!passed) gaps.add("Scheme is restricted to Year " + ruleVal + " (You are in Year " + studentYear + ")");
                            else strengths.add("Year of study (Year " + studentYear + ") is eligible");
                        }
                        break;
                    }
                    case "annual_family_income":
                    case "annual_income": {
                        double maxIncome = 800000.0;
                        if (rule.getValueJson() != null) {
                            try {
                                maxIncome = Double.parseDouble(rule.getValueJson().toString().replaceAll("[^0-9.]", ""));
                            } catch (Exception ignored) {}
                        }
                        if (fv.annualIncome > 0 && fv.annualIncome > maxIncome) {
                            passed = false;
                            gaps.add("Annual income (₹" + ((long) fv.annualIncome) + ") exceeds limit of ₹" + ((long) maxIncome));
                        } else {
                            passed = true;
                            strengths.add("Family income (₹" + ((long) fv.annualIncome) + ") is within ceiling of ₹" + ((long) maxIncome));
                        }
                        break;
                    }
                    case "min_class_12_percentage":
                    case "class_12_percentage":
                    case "class12_percentage": {
                        double minMarks = 60.0;
                        if (rule.getValueJson() != null) {
                            try {
                                minMarks = Double.parseDouble(rule.getValueJson().toString().replaceAll("[^0-9.]", ""));
                            } catch (Exception ignored) {}
                        }
                        if (fv.class12Percentage > 0 && fv.class12Percentage < minMarks) {
                            passed = false;
                            gaps.add("Class 12 score (" + fv.class12Percentage + "%) is below required " + minMarks + "%");
                        } else {
                            passed = true;
                            strengths.add("Class 12 academic benchmark satisfied");
                        }
                        break;
                    }
                    case "min_cgpa":
                    case "undergraduate_cgpa":
                    case "cgpa": {
                        double minCgpa = 6.0;
                        if (rule.getValueJson() != null) {
                            try {
                                minCgpa = Double.parseDouble(rule.getValueJson().toString().replaceAll("[^0-9.]", ""));
                            } catch (Exception ignored) {}
                        }
                        double studentCgpa = fv.undergraduateCgpa > 0 ? fv.undergraduateCgpa : (profile.getCurrentCgpa() != null ? profile.getCurrentCgpa().doubleValue() : 0.0);
                        if (studentCgpa > 0 && studentCgpa < minCgpa) {
                            passed = false;
                            gaps.add("CGPA (" + studentCgpa + ") is below required " + minCgpa);
                        } else {
                            passed = true;
                            strengths.add("Current CGPA meets scheme academic requirement");
                        }
                        break;
                    }
                    case "category": {
                        String studentCat = (profile.getCategory() != null ? profile.getCategory() : "GENERAL").toUpperCase().trim();
                        if (ruleVal.contains("ANY") || ruleVal.contains("ALL") || ruleVal.isEmpty()) {
                            passed = true;
                        } else {
                            passed = ruleVal.contains(studentCat) || ("SEBC".equals(studentCat) && ruleVal.contains("OBC"));
                        }
                        if (!passed) gaps.add("Exclusive to " + ruleVal + " categories (Your category: " + studentCat + ")");
                        else strengths.add("Category requirement verified");
                        break;
                    }
                    case "domicile_state": {
                        String schState = (scholarship.getState() != null ? scholarship.getState() : "ALL_INDIA").toUpperCase();
                        if (!"ALL_INDIA".equals(schState) || (!ruleVal.contains("ALL_INDIA") && !ruleVal.contains("ALL") && !ruleVal.isEmpty())) {
                            String studentState = (profile.getDomicileState() != null ? profile.getDomicileState() : "").toUpperCase();
                            if (!studentState.contains(schState) && !schState.contains(studentState) && !ruleVal.contains(studentState)) {
                                passed = false;
                                gaps.add("Requires domicile in " + (ruleVal.isEmpty() ? schState : ruleVal));
                            } else {
                                passed = true;
                                strengths.add("State domicile (" + studentState + ") verified");
                            }
                        }
                        break;
                    }
                    case "gender": {
                        if (ruleVal.contains("FEMALE")) {
                            if (fv.genderCode == 1.0) {
                                passed = false;
                                gaps.add("Scheme is exclusively for female applicants");
                            } else {
                                strengths.add("Female applicant quota verified");
                            }
                        }
                        break;
                    }
                    case "has_disability": {
                        boolean hasDis = profile.getHasDisability() != null && profile.getHasDisability();
                        passed = hasDis;
                        if (!passed) gaps.add("Requires certified benchmark disability (UDID card)");
                        else strengths.add("Disability quota verified");
                        break;
                    }
                    case "is_ward_of_defense_or_capf":
                    case "is_ex_serviceman_ward": {
                        boolean isWard = profile.getIsWardOfDefenseOrCapf() != null && profile.getIsWardOfDefenseOrCapf();
                        passed = isWard;
                        if (!passed) gaps.add("Reserved exclusively for wards of Armed Forces / CAPF personnel");
                        else strengths.add("Defense / CAPF ward quota verified");
                        break;
                    }
                    default:
                        passed = true;
                        break;
                }

                if (passed) {
                    passedRules++;
                    path.add("✓ Rule [" + (desc.isEmpty() ? field : desc) + "] -> PASSED");
                } else {
                    if (mandatory) mandatoryFailed++;
                    path.add("✕ Rule [" + (desc.isEmpty() ? field : desc) + "] -> FAILED");
                }
            }

            double ruleRatio = (double) passedRules / Math.max(1, totalRules);
            accumulatedScore = Math.round((ruleRatio * 60.0 + 40.0) * 10.0) / 10.0;
        }

        boolean isEligible = mandatoryFailed == 0;
        String tier;
        if (isEligible && accumulatedScore >= 80.0) {
            tier = "STRONG_MATCH";
        } else if (isEligible && accumulatedScore >= 60.0) {
            tier = "GOOD_MATCH";
        } else if (mandatoryFailed == 1 && accumulatedScore >= 50.0) {
            tier = "POSSIBLE_MATCH";
        } else {
            tier = "INELIGIBLE";
            accumulatedScore = Math.min(accumulatedScore, 35.0);
        }

        String explanation;
        if (isEligible) {
            explanation = "Decision Tree matched profile with " + ((int) accumulatedScore) + "% confidence based on academic scores, family income, and state domicile criteria.";
        } else if ("POSSIBLE_MATCH".equals(tier)) {
            explanation = "Potential match identified; verify supplementary criteria: " + (gaps.isEmpty() ? "institutional verification" : String.join(", ", gaps));
        } else {
            explanation = "Criteria not currently met: " + (gaps.isEmpty() ? "scheme scope limitations" : String.join(", ", gaps));
        }

        prediction.setMatchScore(accumulatedScore);
        prediction.setTier(tier);
        prediction.setEligible(isEligible);
        prediction.setExplanation(explanation);
        prediction.setKeyStrengths(strengths);
        prediction.setCriticalGaps(gaps);
        prediction.setDecisionPath(path);

        return prediction;
    }
}
