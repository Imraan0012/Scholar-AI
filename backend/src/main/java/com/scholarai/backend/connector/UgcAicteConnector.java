package com.scholarai.backend.connector;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class UgcAicteConnector implements ScholarshipSourceConnector {

    @Override
    public String getSourceId() { return "src-apex-ugc-aicte"; }

    @Override
    public String getSourceName() { return "AICTE & UGC Higher Education Apex Portals"; }

    @Override
    public String getCategory() { return "APEX_BODY"; }

    @Override
    public String getState() { return "ALL_INDIA"; }

    @Override
    public String getPortalUrl() { return "https://www.aicte-india.org"; }

    @Override
    public List<Map<String, Object>> discoverSchemes() {
        List<Map<String, Object>> list = new ArrayList<>();

        // 1. AICTE Pragati Scholarship for Girls (Degree)
        Map<String, Object> s1 = new HashMap<>();
        s1.put("id", "aicte-pragati-scholarship-girls");
        s1.put("name", "AICTE Pragati Scholarship Scheme for Girl Students (Degree)");
        s1.put("provider", "All India Council for Technical Education (AICTE)");
        s1.put("provider_type", "GOVERNMENT");
        s1.put("government_level", "CENTRAL");
        s1.put("state", "ALL_INDIA");
        s1.put("ministry_or_department", "AICTE / Ministry of Education");
        s1.put("academic_year", "2026-27");
        s1.put("application_type", "FRESH_AND_RENEWAL");
        s1.put("description", "Empowering young women pursuing technical degree education with annual financial support for tuition and learning expenses.");
        s1.put("amount_display", "₹50,000 per annum for every year of study");
        s1.put("amount_min", 50000);
        s1.put("amount_max", 50000);
        s1.put("amount_type", "ANNUAL_STIPEND");
        s1.put("official_website_url", "https://www.aicte-india.org");
        s1.put("official_application_url", "https://scholarships.gov.in");
        s1.put("source_reliability", "LEVEL_1_OFFICIAL_GOVT");
        s1.put("verification_status", "VERIFIED");
        s1.put("official_scheme_id", "AICTE_PRAGATI_DEGREE");
        list.add(s1);

        // 2. AICTE Saksham Scholarship for Specially Abled Students
        Map<String, Object> s2 = new HashMap<>();
        s2.put("id", "aicte-saksham-scholarship");
        s2.put("name", "AICTE Saksham Scholarship Scheme for Specially-Abled Students (Degree & Diploma)");
        s2.put("provider", "All India Council for Technical Education (AICTE)");
        s2.put("provider_type", "GOVERNMENT");
        s2.put("government_level", "CENTRAL");
        s2.put("state", "ALL_INDIA");
        s2.put("ministry_or_department", "AICTE / Ministry of Education");
        s2.put("academic_year", "2026-27");
        s2.put("application_type", "FRESH_AND_RENEWAL");
        s2.put("description", "Financial support of ₹50,000/year to specially abled students (disability >= 40%) pursuing approved technical degree/diploma courses.");
        s2.put("amount_display", "₹50,000 per annum");
        s2.put("amount_min", 50000);
        s2.put("amount_max", 50000);
        s2.put("amount_type", "ANNUAL_STIPEND");
        s2.put("official_website_url", "https://www.aicte-india.org");
        s2.put("official_application_url", "https://scholarships.gov.in");
        s2.put("source_reliability", "LEVEL_1_OFFICIAL_GOVT");
        s2.put("verification_status", "VERIFIED");
        s2.put("official_scheme_id", "AICTE_SAKSHAM_PWD");
        list.add(s2);

        // 3. UGC Ishan Uday Special Scholarship for North Eastern Region (NER)
        Map<String, Object> s3 = new HashMap<>();
        s3.put("id", "ugc-ishan-uday-ner");
        s3.put("name", "UGC Ishan Uday Special Scholarship Scheme for North Eastern Region (NER)");
        s3.put("provider", "University Grants Commission (UGC)");
        s3.put("provider_type", "GOVERNMENT");
        s3.put("government_level", "CENTRAL");
        s3.put("state", "ASSAM");
        s3.put("ministry_or_department", "University Grants Commission / Ministry of Education");
        s3.put("academic_year", "2026-27");
        s3.put("application_type", "FRESH_AND_RENEWAL");
        s3.put("description", "Dedicated national fellowship for students with domicile in the North Eastern states (Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura) pursuing general degree or technical/professional courses.");
        s3.put("amount_display", "₹5,400 / month (General) to ₹7,800 / month (Technical/Medical)");
        s3.put("amount_min", 54000);
        s3.put("amount_max", 78000);
        s3.put("amount_type", "MONTHLY_STIPEND");
        s3.put("official_website_url", "https://www.ugc.gov.in");
        s3.put("official_application_url", "https://scholarships.gov.in");
        s3.put("source_reliability", "LEVEL_1_OFFICIAL_GOVT");
        s3.put("verification_status", "VERIFIED");
        s3.put("official_scheme_id", "UGC_ISHAN_UDAY_NER");
        list.add(s3);

        return list;
    }
}
