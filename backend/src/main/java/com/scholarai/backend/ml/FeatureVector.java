package com.scholarai.backend.ml;

import com.scholarai.backend.entity.StudentProfile;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * Encapsulates a normalized numerical and encoded categorical feature vector
 * extracted from a student profile for Decision Tree evaluation.
 */
public class FeatureVector {

    public double educationLevelOrdinal;
    public double class10Percentage;
    public double class12Percentage;
    public double undergraduateCgpa;
    public double annualIncome;
    public double domicileStateCode;
    public double categoryCode;
    public double genderCode;
    public double hasDisability;
    public double disabilityPercentage;
    public double isFirstGraduate;
    public double isOrphan;
    public double isSingleGirlChild;
    public double isWardOfDefense;
    public double isMinority;

    private static final Map<String, Double> STATE_CODES = new HashMap<>();
    private static final Map<String, Double> CATEGORY_CODES = new HashMap<>();
    private static final Map<String, Double> GENDER_CODES = new HashMap<>();

    static {
        // State encodings
        String[] states = {
            "ALL_INDIA", "ANDHRA PRADESH", "ARUNACHAL PRADESH", "ASSAM", "BIHAR",
            "CHHATTISGARH", "GOA", "GUJARAT", "HARYANA", "HIMACHAL PRADESH",
            "JHARKHAND", "KARNATAKA", "KERALA", "MADHYA PRADESH", "MAHARASHTRA",
            "MANIPUR", "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA",
            "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL NADU", "TELANGANA",
            "TRIPURA", "UTTAR PRADESH", "UTTARAKHAND", "WEST BENGAL", "DELHI"
        };
        for (int i = 0; i < states.length; i++) {
            STATE_CODES.put(states[i], (double) i);
        }

        // Category encodings
        CATEGORY_CODES.put("GENERAL", 0.0);
        CATEGORY_CODES.put("OPEN", 0.0);
        CATEGORY_CODES.put("OBC", 1.0);
        CATEGORY_CODES.put("OBC-NCL", 1.0);
        CATEGORY_CODES.put("OBC_NCL", 1.0);
        CATEGORY_CODES.put("SC", 2.0);
        CATEGORY_CODES.put("ST", 3.0);
        CATEGORY_CODES.put("EWS", 4.0);

        // Gender encodings
        GENDER_CODES.put("ANY", 0.0);
        GENDER_CODES.put("MALE", 1.0);
        GENDER_CODES.put("FEMALE", 2.0);
        GENDER_CODES.put("OTHER", 3.0);
    }

    public static FeatureVector fromProfile(StudentProfile p) {
        FeatureVector fv = new FeatureVector();
        if (p == null) return fv;

        // 1. Education level ordinal (1: 10th, 2: 12th, 3: Diploma, 4: UG, 5: PG, 6: PhD)
        String edu = (p.getEducationLevel() != null ? p.getEducationLevel() : "").toUpperCase();
        if (edu.contains("PHD") || edu.contains("DOCTORAL") || edu.contains("RESEARCH")) fv.educationLevelOrdinal = 6.0;
        else if (edu.contains("POSTGRADUATE") || edu.contains("MASTER") || edu.contains("M.TECH") || edu.contains("M.SC")) fv.educationLevelOrdinal = 5.0;
        else if (edu.contains("UNDERGRADUATE") || edu.contains("BACHELOR") || edu.contains("B.TECH") || edu.contains("B.E")) fv.educationLevelOrdinal = 4.0;
        else if (edu.contains("DIPLOMA") || edu.contains("POLYTECHNIC")) fv.educationLevelOrdinal = 3.0;
        else if (edu.contains("12") || edu.contains("TWELFTH") || edu.contains("HIGHER_SECONDARY")) fv.educationLevelOrdinal = 2.0;
        else fv.educationLevelOrdinal = 1.0;

        // 2. Marks & CGPA
        fv.class10Percentage = p.getClass10Percentage() != null ? p.getClass10Percentage().doubleValue() : 0.0;
        fv.class12Percentage = p.getClass12Percentage() != null ? p.getClass12Percentage().doubleValue() : 0.0;
        fv.undergraduateCgpa = p.getUndergraduateCgpa() != null ? p.getUndergraduateCgpa().doubleValue() : 0.0;

        // 3. Annual Family Income
        fv.annualIncome = p.getAnnualFamilyIncome() != null ? p.getAnnualFamilyIncome().doubleValue() : 0.0;

        // 4. Domicile State Code
        String state = (p.getDomicileState() != null ? p.getDomicileState() : "ALL_INDIA").toUpperCase();
        fv.domicileStateCode = STATE_CODES.getOrDefault(state, 0.0);

        // 5. Category Code
        String cat = (p.getCategory() != null ? p.getCategory() : "GENERAL").toUpperCase();
        fv.categoryCode = CATEGORY_CODES.getOrDefault(cat, 0.0);

        // 6. Gender Code
        String gen = (p.getGender() != null ? p.getGender() : "ANY").toUpperCase();
        fv.genderCode = GENDER_CODES.getOrDefault(gen, 0.0);

        // 7. Special Category Flags
        fv.hasDisability = (p.getHasDisability() != null && p.getHasDisability()) ? 1.0 : 0.0;
        fv.disabilityPercentage = p.getDisabilityPercentage() != null ? p.getDisabilityPercentage().doubleValue() : 0.0;
        fv.isFirstGraduate = (p.getIsFirstGraduate() != null && p.getIsFirstGraduate()) ? 1.0 : 0.0;
        fv.isOrphan = (p.getIsOrphan() != null && p.getIsOrphan()) ? 1.0 : 0.0;
        fv.isSingleGirlChild = (p.getIsSingleGirlChild() != null && p.getIsSingleGirlChild()) ? 1.0 : 0.0;
        fv.isWardOfDefense = (p.getIsWardOfDefenseOrCapf() != null && p.getIsWardOfDefenseOrCapf()) ? 1.0 : 0.0;
        fv.isMinority = (p.getIsMinority() != null && p.getIsMinority()) ? 1.0 : 0.0;

        return fv;
    }
}
