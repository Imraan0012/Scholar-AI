package com.scholarai.backend.ml;

import com.scholarai.backend.entity.Scholarship;
import com.scholarai.backend.entity.ScholarshipRule;
import com.scholarai.backend.entity.StudentProfile;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

class DecisionTreeEngineTest {

    @Test
    void testPredictEligibleWhenProfileSatisfiesCriteria() {
        DecisionTreeEngine engine = new DecisionTreeEngine();

        StudentProfile profile = new StudentProfile();
        profile.setEducationLevel("UNDERGRADUATE");
        profile.setClass12Percentage(new BigDecimal("88.5"));
        profile.setUndergraduateCgpa(new BigDecimal("8.7"));
        profile.setAnnualFamilyIncome(new BigDecimal("250000"));
        profile.setDomicileState("MAHARASHTRA");
        profile.setCategory("OBC");
        profile.setGender("FEMALE");

        Scholarship scholarship = new Scholarship();
        scholarship.setId("sch-test-1");
        scholarship.setName("National Merit Scholarship");

        ScholarshipRule incomeRule = new ScholarshipRule();
        incomeRule.setConditionField("annual_family_income");
        incomeRule.setValueJson(600000);
        incomeRule.setIsMandatory(true);
        incomeRule.setRuleDescription("Family income <= 6 LPA");

        scholarship.setRules(Collections.singletonList(incomeRule));

        DecisionTreePrediction prediction = engine.predict(profile, scholarship);

        assertNotNull(prediction);
        assertTrue(prediction.isEligible());
        assertTrue(prediction.getMatchScore() >= 80.0);
        assertEquals("STRONG_MATCH", prediction.getTier());
        assertFalse(prediction.getDecisionPath().isEmpty());
    }

    @Test
    void testPredictIneligibleWhenIncomeExceedsLimit() {
        DecisionTreeEngine engine = new DecisionTreeEngine();

        StudentProfile profile = new StudentProfile();
        profile.setEducationLevel("UNDERGRADUATE");
        profile.setAnnualFamilyIncome(new BigDecimal("1200000")); // 12 LPA

        Scholarship scholarship = new Scholarship();
        scholarship.setId("sch-test-2");
        scholarship.setName("Low Income Aid");

        ScholarshipRule incomeRule = new ScholarshipRule();
        incomeRule.setConditionField("annual_family_income");
        incomeRule.setValueJson(250000); // 2.5 LPA max
        incomeRule.setIsMandatory(true);

        scholarship.setRules(Collections.singletonList(incomeRule));

        DecisionTreePrediction prediction = engine.predict(profile, scholarship);

        assertNotNull(prediction);
        assertFalse(prediction.isEligible());
        assertEquals("INELIGIBLE", prediction.getTier());
    }
}
