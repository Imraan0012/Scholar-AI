package com.scholarai.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholarai.backend.dto.EligibilityEvaluationResultDTO;
import com.scholarai.backend.entity.EligibilityResult;
import com.scholarai.backend.entity.Scholarship;
import com.scholarai.backend.entity.ScholarshipRule;
import com.scholarai.backend.entity.StudentProfile;
import com.scholarai.backend.repository.EligibilityResultRepository;
import com.scholarai.backend.repository.ScholarshipRepository;
import com.scholarai.backend.util.DeadlineStatusUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
public class EligibilityService {

    private static final Logger log = LoggerFactory.getLogger(EligibilityService.class);
    private final ScholarshipRepository scholarshipRepository;
    private final EligibilityResultRepository eligibilityResultRepository;
    private final com.scholarai.backend.ml.DecisionTreeEngine decisionTreeEngine;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public EligibilityService(ScholarshipRepository scholarshipRepository,
                              EligibilityResultRepository eligibilityResultRepository,
                              com.scholarai.backend.ml.DecisionTreeEngine decisionTreeEngine) {
        this.scholarshipRepository = scholarshipRepository;
        this.eligibilityResultRepository = eligibilityResultRepository;
        this.decisionTreeEngine = decisionTreeEngine;
    }

    public static class RuleConditionResult {
        public String field;
        public boolean passed;
        public boolean mandatory;
        public String detail;
        public String description;

        public RuleConditionResult(String field, boolean passed, boolean mandatory, String detail, String description) {
            this.field = field;
            this.passed = passed;
            this.mandatory = mandatory;
            this.detail = detail;
            this.description = description;
        }
    }

    private JsonNode normalizeJsonNode(Object rawVal) {
        if (rawVal == null) return objectMapper.nullNode();
        JsonNode node = objectMapper.valueToTree(rawVal);
        if (node.isTextual()) {
            String text = node.asText().trim();
            if ((text.startsWith("[") && text.endsWith("]")) || 
                (text.startsWith("{") && text.endsWith("}")) ||
                (text.startsWith("\"") && text.endsWith("\""))) {
                try {
                    node = objectMapper.readTree(text);
                } catch (Exception ignored) {}
            }
        }
        return node;
    }

    /**
     * Evaluates a single rule condition against a student profile vector.
     */
    public RuleConditionResult evaluateCondition(ScholarshipRule rule, StudentProfile profile, Scholarship scholarship) {
        String field = rule.getConditionField() != null ? rule.getConditionField().toLowerCase().trim() : "";
        boolean mandatory = rule.getIsMandatory() != null && rule.getIsMandatory();
        JsonNode valNode = normalizeJsonNode(rule.getValueJson());
        String ruleDesc = rule.getRuleDescription() != null ? rule.getRuleDescription() : "";

        boolean passed = true;
        String detail = "";

        switch (field) {
            case "education_level": {
                String studentLevel = (profile.getEducationLevel() != null ? profile.getEducationLevel() : "").toUpperCase().trim();
                String normalizedLevel = "TWELFTH_COMPLETED".equals(studentLevel) ? "CLASS_12_PASSED" : studentLevel;

                if (valNode.isArray()) {
                    List<String> validLevels = new ArrayList<>();
                    valNode.forEach(v -> validLevels.add(v.asText().toUpperCase().trim()));
                    passed = validLevels.contains(studentLevel) || validLevels.contains(normalizedLevel) ||
                             validLevels.contains("ANY") ||
                             (("CLASS_12_PASSED".equals(studentLevel) || "TWELFTH_COMPLETED".equals(studentLevel)) && validLevels.contains("UNDERGRADUATE")) ||
                             ("DIPLOMA".equals(studentLevel) && validLevels.contains("POLYTECHNIC"));
                } else {
                    String req = valNode.asText("").toUpperCase().trim();
                    passed = req.equals(studentLevel) || req.equals(normalizedLevel) || "ANY".equals(req) || req.isEmpty();
                }
                detail = passed ? "Education level (" + profile.getEducationLevel() + ") satisfies scheme scope"
                        : "Requires education level in " + valNode + " (Current: " + (profile.getEducationLevel() != null ? profile.getEducationLevel() : "Unspecified") + ")";
                break;
            }

            case "current_year": {
                int studentYear = profile.getCurrentYear() != null ? profile.getCurrentYear() : 1;
                if (valNode.isArray()) {
                    List<Integer> validYears = new ArrayList<>();
                    valNode.forEach(v -> validYears.add(v.asInt()));
                    passed = validYears.contains(studentYear) || validYears.isEmpty();
                } else if (valNode.isNumber()) {
                    passed = (valNode.asInt() == studentYear);
                } else {
                    passed = true;
                }
                detail = passed ? "Year of study (Year " + studentYear + ") is eligible"
                        : "Scheme is for Year " + valNode + " (You are in Year " + studentYear + ")";
                break;
            }

            case "min_class_10_percentage": {
                BigDecimal score = profile.getClass10Percentage() != null ? profile.getClass10Percentage() : BigDecimal.ZERO;
                BigDecimal req = BigDecimal.ZERO;
                if (valNode.isNumber()) req = new BigDecimal(valNode.asText());
                else if (valNode.isTextual()) req = new BigDecimal(valNode.asText().replaceAll("[^0-9.]", ""));
                passed = score.compareTo(req) >= 0 || score.compareTo(BigDecimal.ZERO) == 0;
                detail = passed ? "Class 10 score (" + score + "%) meets minimum requirement of " + req + "%"
                        : "Requires minimum " + req + "% in Class 10 (Your score: " + score + "%)";
                break;
            }

            case "min_class_12_percentage": {
                BigDecimal score = profile.getClass12Percentage() != null ? profile.getClass12Percentage() : BigDecimal.ZERO;
                BigDecimal req = BigDecimal.ZERO;
                if (valNode.isNumber()) req = new BigDecimal(valNode.asText());
                else if (valNode.isTextual()) req = new BigDecimal(valNode.asText().replaceAll("[^0-9.]", ""));
                passed = score.compareTo(req) >= 0;
                detail = passed ? "Class 12 score (" + score + "%) meets cutoff of " + req + "%"
                        : "Requires minimum " + req + "% in Class 12 (Your score: " + score + "%)";
                break;
            }

            case "min_cgpa": {
                BigDecimal score = profile.getCurrentCgpa() != null ? profile.getCurrentCgpa() :
                        (profile.getUndergraduateCgpa() != null ? profile.getUndergraduateCgpa() : BigDecimal.ZERO);
                BigDecimal req = BigDecimal.ZERO;
                if (valNode.isNumber()) req = new BigDecimal(valNode.asText());
                else if (valNode.isTextual()) req = new BigDecimal(valNode.asText().replaceAll("[^0-9.]", ""));
                passed = score.compareTo(req) >= 0 || score.compareTo(BigDecimal.ZERO) == 0;
                detail = passed ? "CGPA (" + score + ") satisfies minimum requirement of " + req
                        : "Requires minimum " + req + " CGPA (Your CGPA: " + score + ")";
                break;
            }

            case "annual_family_income":
            case "annual_income": {
                BigDecimal income = profile.getAnnualFamilyIncome() != null ? profile.getAnnualFamilyIncome() : BigDecimal.ZERO;
                BigDecimal limit = new BigDecimal("999999999");
                if (valNode.isNumber()) limit = new BigDecimal(valNode.asText());
                else if (valNode.isTextual()) limit = new BigDecimal(valNode.asText().replaceAll("[^0-9.]", ""));
                passed = income.compareTo(limit) <= 0;
                detail = passed ? "Family income ₹" + income + " is within ceiling of ₹" + limit
                        : "Family income ₹" + income + " exceeds ceiling of ₹" + limit;
                break;
            }

            case "category": {
                String cat = (profile.getCategory() != null ? profile.getCategory() : "GENERAL").toUpperCase().trim();
                if (valNode.isArray()) {
                    List<String> validCats = new ArrayList<>();
                    valNode.forEach(v -> validCats.add(v.asText().toUpperCase().trim()));
                    passed = validCats.contains(cat) || validCats.contains("ANY") || ("SEBC".equals(cat) && validCats.contains("OBC"));
                } else {
                    String req = valNode.asText("").toUpperCase().trim();
                    passed = req.equals(cat) || "ANY".equals(req) || req.isEmpty() || ("SEBC".equals(cat) && "OBC".equals(req));
                }
                detail = passed ? "Reservation category (" + cat + ") is eligible"
                        : "Exclusive to " + valNode + " categories (Your category: " + cat + ")";
                break;
            }

            case "domicile_state": {
                String studentState = (profile.getDomicileState() != null ? profile.getDomicileState() : "").trim().toLowerCase();
                String schState = (scholarship != null && scholarship.getState() != null ? scholarship.getState() : "ALL_INDIA").trim().toLowerCase();

                if (valNode.isArray()) {
                    List<String> validStates = new ArrayList<>();
                    valNode.forEach(v -> validStates.add(v.asText().trim().toLowerCase()));
                    passed = validStates.contains(studentState) || validStates.contains("all_india") || validStates.contains("all") || "all_india".equals(schState);
                } else {
                    String req = valNode.asText("").trim().toLowerCase();
                    if ("all_india".equals(req) || "all".equals(req) || req.isEmpty() || "all_india".equals(schState)) {
                        passed = true;
                    } else {
                        passed = studentState.contains(req) || req.contains(studentState);
                    }
                }
                detail = passed ? "State domicile (" + profile.getDomicileState() + ") satisfies requirement"
                        : "Restricted to native domicile holders of " + valNode + " (Your domicile: " + profile.getDomicileState() + ")";
                break;
            }

            case "gender": {
                String studentGender = (profile.getGender() != null ? profile.getGender() : "ANY").toUpperCase().trim();
                if (valNode.isArray()) {
                    List<String> validGenders = new ArrayList<>();
                    valNode.forEach(v -> validGenders.add(v.asText().toUpperCase().trim()));
                    passed = validGenders.contains(studentGender) || validGenders.contains("ANY");
                } else {
                    String req = valNode.asText("ANY").toUpperCase().trim();
                    passed = "ANY".equals(req) || req.isEmpty() || studentGender.equals(req);
                }
                detail = passed ? "Gender requirement satisfied"
                        : "Scheme is exclusively for " + valNode + " applicants";
                break;
            }

            case "has_disability": {
                boolean hasDis = profile.getHasDisability() != null && profile.getHasDisability();
                passed = hasDis == valNode.asBoolean(true);
                detail = passed ? "Specially-abled quota verified" : "Requires certified benchmark disability (UDID card)";
                break;
            }

            case "min_disability_percentage": {
                BigDecimal dis = profile.getDisabilityPercentage() != null ? profile.getDisabilityPercentage() : BigDecimal.ZERO;
                BigDecimal req = BigDecimal.ZERO;
                if (valNode.isNumber()) req = new BigDecimal(valNode.asText());
                else if (valNode.isTextual()) req = new BigDecimal(valNode.asText().replaceAll("[^0-9.]", ""));
                boolean hasDis = profile.getHasDisability() != null && profile.getHasDisability();
                passed = hasDis && dis.compareTo(req) >= 0;
                detail = passed ? "Benchmark disability (" + dis + "%) meets requirement of " + req + "%"
                        : "Requires minimum " + req + "% certified disability (Current: " + dis + "%)";
                break;
            }

            case "is_minority": {
                boolean isMin = profile.getIsMinority() != null && profile.getIsMinority();
                passed = isMin == valNode.asBoolean(true);
                detail = passed ? "Notified minority community status verified" : "Scheme restricted to notified national minority communities";
                break;
            }

            case "is_single_girl_child": {
                boolean sgc = profile.getIsSingleGirlChild() != null && profile.getIsSingleGirlChild();
                passed = sgc == valNode.asBoolean(true);
                detail = passed ? "Single girl child scheme criteria verified" : "Scheme exclusively for single girl child applicants";
                break;
            }

            case "is_orphan": {
                boolean orphan = profile.getIsOrphan() != null && profile.getIsOrphan();
                passed = orphan == valNode.asBoolean(true);
                detail = passed ? "Orphan / State ward priority verified" : "Scheme dedicated to orphan / state ward students";
                break;
            }

            case "is_ex_serviceman_ward":
            case "is_ward_of_defense_or_capf": {
                boolean ward = profile.getIsWardOfDefenseOrCapf() != null && profile.getIsWardOfDefenseOrCapf();
                passed = ward == valNode.asBoolean(true);
                detail = passed ? "Ward of Armed Forces / Ex-Serviceman quota verified" : "Scheme reserved for wards of Armed Forces personnel";
                break;
            }

            case "is_first_graduate":
            case "is_first_gen_learner": {
                boolean firstGen = profile.getIsFirstGraduate() != null && profile.getIsFirstGraduate();
                passed = firstGen == valNode.asBoolean(true);
                detail = passed ? "First-generation college learner criteria verified" : "Scheme priority for first-generation learners";
                break;
            }

            case "eligible_branches":
            case "branch":
            case "specialization": {
                String studentBranch = (profile.getBranch() != null ? profile.getBranch() : "").toUpperCase().trim();
                if (studentBranch.isEmpty() || "NOT APPLICABLE".equals(studentBranch)) {
                    passed = !mandatory;
                    detail = passed ? "All branches eligible" : "Specific degree branch required";
                } else if (valNode.isArray()) {
                    List<String> validBranches = new ArrayList<>();
                    valNode.forEach(v -> validBranches.add(v.asText().toUpperCase().trim()));
                    passed = validBranches.contains("ANY") || validBranches.contains("ALL") || validBranches.stream().anyMatch(b -> studentBranch.contains(b) || b.contains(studentBranch));
                    detail = passed ? "Degree branch (" + profile.getBranch() + ") satisfies scheme criteria"
                            : "Restricted to branches in " + valNode + " (Your branch: " + profile.getBranch() + ")";
                } else {
                    String req = valNode.asText("").toUpperCase().trim();
                    passed = "ANY".equals(req) || "ALL".equals(req) || req.isEmpty() || studentBranch.contains(req) || req.contains(studentBranch);
                    detail = passed ? "Degree branch (" + profile.getBranch() + ") is eligible"
                            : "Requires branch: " + req + " (Your branch: " + profile.getBranch() + ")";
                }
                break;
            }

            case "eligible_courses":
            case "course": {
                String studentCourse = (profile.getCourse() != null ? profile.getCourse() : "").toUpperCase().trim();
                if (studentCourse.isEmpty()) {
                    passed = !mandatory;
                    detail = passed ? "All courses eligible" : "Enrolled degree course required";
                } else if (valNode.isArray()) {
                    List<String> validCourses = new ArrayList<>();
                    valNode.forEach(v -> validCourses.add(v.asText().toUpperCase().trim()));
                    passed = validCourses.contains("ANY") || validCourses.contains("ALL") || validCourses.stream().anyMatch(c -> studentCourse.contains(c) || c.contains(studentCourse));
                    detail = passed ? "Enrolled course (" + profile.getCourse() + ") satisfies scheme criteria"
                            : "Restricted to degree programs in " + valNode + " (Your course: " + profile.getCourse() + ")";
                } else {
                    String req = valNode.asText("").toUpperCase().trim();
                    passed = "ANY".equals(req) || "ALL".equals(req) || req.isEmpty() || studentCourse.contains(req) || req.contains(studentCourse);
                    detail = passed ? "Enrolled course (" + profile.getCourse() + ") is eligible"
                            : "Requires course: " + req + " (Your course: " + profile.getCourse() + ")";
                }
                break;
            }

            case "institution":
            case "institution_name":
            case "target_institutions": {
                String studentInst = (profile.getInstitutionName() != null ? profile.getInstitutionName() : "").toUpperCase().trim();
                if (studentInst.isEmpty()) {
                    passed = !mandatory;
                    detail = passed ? "All institutions eligible" : "Enrolled university/college name required";
                } else if (valNode.isArray()) {
                    List<String> validInsts = new ArrayList<>();
                    valNode.forEach(v -> validInsts.add(v.asText().toUpperCase().trim()));
                    passed = validInsts.contains("ANY") || validInsts.contains("ALL") || validInsts.stream().anyMatch(inst -> studentInst.contains(inst) || inst.contains(studentInst));
                    detail = passed ? "Enrolled institution (" + profile.getInstitutionName() + ") matches eligible institutes"
                            : "Restricted to students of " + valNode + " (Your institution: " + profile.getInstitutionName() + ")";
                } else {
                    String req = valNode.asText("").toUpperCase().trim();
                    passed = "ANY".equals(req) || "ALL".equals(req) || req.isEmpty() || studentInst.contains(req) || req.contains(studentInst);
                    detail = passed ? "Enrolled institution (" + profile.getInstitutionName() + ") matches"
                            : "Restricted to students of: " + req + " (Your institution: " + profile.getInstitutionName() + ")";
                }
                break;
            }

            default: {
                passed = true;
                detail = ruleDesc.isEmpty() ? "Requirement verified" : ruleDesc;
                break;
            }
        }

        return new RuleConditionResult(field, passed, mandatory, detail, ruleDesc.isEmpty() ? detail : ruleDesc);
    }

    /**
     * Evaluates a single scholarship for a student profile.
     */
    public EligibilityEvaluationResultDTO evaluateScholarship(StudentProfile profile, Scholarship scholarship) {
        List<ScholarshipRule> rules = scholarship.getRules() != null ? scholarship.getRules() : Collections.emptyList();
        List<String> matchedCriteria = new ArrayList<>();
        List<String> failedCriteria = new ArrayList<>();
        List<String> missingInformation = new ArrayList<>();

        int mandatoryFailedCount = 0;
        int totalRules = rules.size();
        int passedRules = 0;

        for (ScholarshipRule rule : rules) {
            RuleConditionResult res = evaluateCondition(rule, profile, scholarship);
            if (res.passed) {
                passedRules++;
                matchedCriteria.add(res.description);
            } else {
                if (res.mandatory) {
                    mandatoryFailedCount++;
                    failedCriteria.add(res.detail);
                } else {
                    missingInformation.add(res.detail);
                }
            }
        }

        // Decision Tree ML Prediction
        com.scholarai.backend.ml.DecisionTreePrediction mlPred = decisionTreeEngine.predict(profile, scholarship);

        int ruleScore = totalRules > 0 ? Math.round(((float) passedRules / totalRules) * 100) : 100;
        int matchScore = (int) Math.round((ruleScore * 0.6) + (mlPred.getMatchScore() * 0.4));

        String evaluationStatus;
        String tier;

        if (mandatoryFailedCount > 0) {
            evaluationStatus = "NOT_ELIGIBLE";
            tier = "INELIGIBLE";
            matchScore = Math.min(matchScore, 35);
        } else if (!mlPred.isEligible()) {
            if (passedRules >= Math.max(1, totalRules * 0.75)) {
                evaluationStatus = "POSSIBLE_MATCH";
                tier = "POSSIBLE_MATCH";
            } else {
                evaluationStatus = "NOT_ELIGIBLE";
                tier = "INELIGIBLE";
            }
        } else if (!missingInformation.isEmpty() || matchScore < 75 || "POSSIBLE_MATCH".equals(mlPred.getTier())) {
            evaluationStatus = "POSSIBLE_MATCH";
            tier = "POSSIBLE_MATCH";
        } else {
            evaluationStatus = "ELIGIBLE";
            tier = matchScore >= 90 ? "STRONG_MATCH" : "GOOD_MATCH";
        }

        String deadlineStatus = DeadlineStatusUtil.calculateDeadlineStatus(
                scholarship.getAcademicYear(),
                null
        );

        String explanation;
        if ("ELIGIBLE".equals(evaluationStatus)) {
            explanation = "Matched with " + matchScore + "% confidence via Decision Tree engine: Academic criteria, income ceiling, state domicile (" + (profile.getDomicileState() != null ? profile.getDomicileState() : "All India") + "), and social category verified.";
        } else if ("POSSIBLE_MATCH".equals(evaluationStatus)) {
            explanation = "Potential match: Core requirements met, but supplementary verification needed (" + (missingInformation.isEmpty() ? "bonafide proof" : String.join("; ", missingInformation)) + ").";
        } else {
            explanation = "Not currently eligible: " + (failedCriteria.isEmpty() ? mlPred.getExplanation() : String.join("; ", failedCriteria));
        }

        EligibilityEvaluationResultDTO dto = new EligibilityEvaluationResultDTO();
        dto.setScholarshipId(scholarship.getId());
        dto.setScholarshipName(scholarship.getName());
        dto.setEvaluationStatus(evaluationStatus);
        dto.setTier(tier);
        dto.setEligible("ELIGIBLE".equals(evaluationStatus));
        dto.setMatchScore(matchScore);
        dto.setMatchedCriteria(matchedCriteria);
        dto.setFailedCriteria(failedCriteria);
        dto.setMissingInformation(missingInformation);
        dto.setDeadlineStatus(deadlineStatus);
        dto.setExplanation(explanation);
        dto.setScholarship(scholarship);

        log.debug("Evaluated User: {} | Scholarship: {} | Status: {} | Score: {}",
                profile.getUserId(), scholarship.getId(), evaluationStatus, matchScore);

        return dto;
    }

    /**
     * Evaluates all active scholarships in the database for the given student profile
     * and deterministically persists the results to the database.
     */
    @Transactional
    public List<EligibilityEvaluationResultDTO> evaluateAndPersistAll(StudentProfile profile) {
        if (profile == null || profile.getId() == null) {
            return Collections.emptyList();
        }

        List<Scholarship> allScholarships = scholarshipRepository.findAll();
        List<EligibilityEvaluationResultDTO> results = new ArrayList<>();

        // Clear previous evaluation results for this student
        eligibilityResultRepository.deleteByStudentId(profile.getId());

        List<EligibilityResult> toSave = new ArrayList<>();

        for (Scholarship s : allScholarships) {
            EligibilityEvaluationResultDTO res = evaluateScholarship(profile, s);
            results.add(res);

            EligibilityResult entity = new EligibilityResult();
            entity.setStudentId(profile.getId());
            entity.setScholarshipId(s.getId());
            entity.setEvaluationStatus(res.getEvaluationStatus());
            entity.setMatchScore(res.getMatchScore());
            entity.setEvaluationExplanation(res.getExplanation());
            entity.setMatchedCriteria(res.getMatchedCriteria());
            entity.setFailedCriteria(res.getFailedCriteria());
            entity.setMissingInformation(res.getMissingInformation());

            toSave.add(entity);
        }

        eligibilityResultRepository.saveAll(toSave);
        log.info("Persisted {} eligibility results for student user {}", toSave.size(), profile.getUserId());

        return results;
    }

    public List<EligibilityEvaluationResultDTO> getResultsForStudent(UUID studentId) {
        List<EligibilityResult> entities = eligibilityResultRepository.findByStudentId(studentId);
        List<EligibilityEvaluationResultDTO> list = new ArrayList<>();

        for (EligibilityResult e : entities) {
            EligibilityEvaluationResultDTO dto = new EligibilityEvaluationResultDTO();
            dto.setScholarshipId(e.getScholarshipId());
            dto.setEvaluationStatus(e.getEvaluationStatus());
            dto.setTier("ELIGIBLE".equals(e.getEvaluationStatus()) ? "STRONG_MATCH" : ("POSSIBLE_MATCH".equals(e.getEvaluationStatus()) ? "POSSIBLE_MATCH" : "INELIGIBLE"));
            dto.setEligible("ELIGIBLE".equals(e.getEvaluationStatus()));
            dto.setMatchScore(e.getMatchScore() != null ? e.getMatchScore() : 0);
            dto.setExplanation(e.getEvaluationExplanation());
            dto.setMatchedCriteria(e.getMatchedCriteria());
            dto.setFailedCriteria(e.getFailedCriteria());
            dto.setMissingInformation(e.getMissingInformation());

            scholarshipRepository.findById(e.getScholarshipId()).ifPresent(s -> {
                dto.setScholarshipName(s.getName());
                dto.setScholarship(s);
            });

            list.add(dto);
        }
        return list;
    }
}
