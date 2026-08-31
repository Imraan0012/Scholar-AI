package com.scholarai.backend.service;

import com.scholarai.backend.dto.EligibilityEvaluationResultDTO;
import com.scholarai.backend.entity.Scholarship;
import com.scholarai.backend.entity.ScholarshipRule;
import com.scholarai.backend.entity.StudentProfile;
import com.scholarai.backend.repository.EligibilityResultRepository;
import com.scholarai.backend.repository.ScholarshipRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class EligibilityServiceTest {

    private EligibilityService eligibilityService;
    private ScholarshipRepository scholarshipRepository;
    private EligibilityResultRepository eligibilityResultRepository;

    @BeforeEach
    void setUp() {
        scholarshipRepository = Mockito.mock(ScholarshipRepository.class);
        eligibilityResultRepository = Mockito.mock(EligibilityResultRepository.class);
        com.scholarai.backend.ml.DecisionTreeEngine decisionTreeEngine = new com.scholarai.backend.ml.DecisionTreeEngine();
        eligibilityService = new EligibilityService(scholarshipRepository, eligibilityResultRepository, decisionTreeEngine);
    }

    @Test
    void testEligibleWhenAllMandatoryRulesPass() {
        StudentProfile profile = new StudentProfile();
        profile.setEducationLevel("UNDERGRADUATE");
        profile.setAnnualFamilyIncome(new BigDecimal("200000"));
        profile.setCategory("OBC");
        profile.setDomicileState("MAHARASHTRA");
        profile.setGender("FEMALE");

        Scholarship scholarship = new Scholarship();
        scholarship.setId("sch-1");
        scholarship.setName("Merit Scholarship for Girls");

        ScholarshipRule rule1 = new ScholarshipRule();
        rule1.setConditionField("annual_family_income");
        rule1.setValueJson(250000);
        rule1.setIsMandatory(true);
        rule1.setRuleDescription("Annual family income <= 2.5 LPA");

        ScholarshipRule rule2 = new ScholarshipRule();
        rule2.setConditionField("gender");
        rule2.setValueJson("FEMALE");
        rule2.setIsMandatory(true);
        rule2.setRuleDescription("Gender must be Female");

        scholarship.setRules(Arrays.asList(rule1, rule2));

        EligibilityEvaluationResultDTO result = eligibilityService.evaluateScholarship(profile, scholarship);

        assertTrue(result.isEligible());
        assertEquals("ELIGIBLE", result.getEvaluationStatus());
        assertEquals(100, result.getMatchScore());
        assertTrue(result.getFailedCriteria().isEmpty());
    }

    @Test
    void testNotEligibleWhenMandatoryRuleFails() {
        StudentProfile profile = new StudentProfile();
        profile.setEducationLevel("UNDERGRADUATE");
        profile.setAnnualFamilyIncome(new BigDecimal("600000"));

        Scholarship scholarship = new Scholarship();
        scholarship.setId("sch-2");
        scholarship.setName("Low Income Grant");

        ScholarshipRule rule = new ScholarshipRule();
        rule.setConditionField("annual_family_income");
        rule.setValueJson(250000);
        rule.setIsMandatory(true);
        rule.setRuleDescription("Income limit <= 2.5 LPA");

        scholarship.setRules(List.of(rule));

        EligibilityEvaluationResultDTO result = eligibilityService.evaluateScholarship(profile, scholarship);

        assertFalse(result.isEligible());
        assertEquals("NOT_ELIGIBLE", result.getEvaluationStatus());
        assertEquals("INELIGIBLE", result.getTier());
        assertTrue(result.getMatchScore() <= 35);
        assertEquals(1, result.getFailedCriteria().size());
    }
}
