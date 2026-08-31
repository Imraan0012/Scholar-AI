package com.scholarai.backend.connector;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class CentralNspConnector implements ScholarshipSourceConnector {

    @Override
    public String getSourceId() { return "src-central-nsp"; }

    @Override
    public String getSourceName() { return "National Scholarship Portal (NSP Central)"; }

    @Override
    public String getCategory() { return "CENTRAL_GOVERNMENT"; }

    @Override
    public String getState() { return "ALL_INDIA"; }

    @Override
    public String getPortalUrl() { return "https://scholarships.gov.in"; }

    @Override
    public List<Map<String, Object>> discoverSchemes() {
        List<Map<String, Object>> list = new ArrayList<>();

        // 1. PM-USP CSSS
        Map<String, Object> s1 = new HashMap<>();
        s1.put("id", "nsp-pm-usp-csss");
        s1.put("name", "PM-USP Central Sector Scheme of Scholarships for College and University Students");
        s1.put("provider", "Department of Higher Education, Ministry of Education, Govt. of India");
        s1.put("provider_type", "GOVERNMENT");
        s1.put("government_level", "CENTRAL");
        s1.put("state", "ALL_INDIA");
        s1.put("ministry_or_department", "Ministry of Education");
        s1.put("academic_year", "2026-27");
        s1.put("application_type", "FRESH_AND_RENEWAL");
        s1.put("description", "Financial assistance for meritorious students from low-income families pursuing regular undergraduate and postgraduate degrees.");
        s1.put("amount_display", "₹12,000 / year (UG) to ₹20,000 / year (PG)");
        s1.put("amount_min", 12000);
        s1.put("amount_max", 20000);
        s1.put("amount_type", "ANNUAL_STIPEND");
        s1.put("official_website_url", "https://www.education.gov.in/en/scholarships-education");
        s1.put("official_application_url", "https://scholarships.gov.in");
        s1.put("source_reliability", "LEVEL_1_OFFICIAL_GOVT");
        s1.put("verification_status", "VERIFIED");
        s1.put("official_scheme_id", "NSP_CSSS_UG_PG");
        list.add(s1);

        // 2. Post Matric Scholarship for SC Students (MoSJE)
        Map<String, Object> s2 = new HashMap<>();
        s2.put("id", "nsp-post-matric-sc-central");
        s2.put("name", "Post Matric Scholarship for SC Students (Centrally Sponsored)");
        s2.put("provider", "Ministry of Social Justice and Empowerment, Govt. of India");
        s2.put("provider_type", "GOVERNMENT");
        s2.put("government_level", "CENTRAL");
        s2.put("state", "ALL_INDIA");
        s2.put("ministry_or_department", "Ministry of Social Justice and Empowerment");
        s2.put("academic_year", "2026-27");
        s2.put("application_type", "FRESH_AND_RENEWAL");
        s2.put("description", "Complete fee reimbursement and maintenance allowance for Scheduled Caste students pursuing post-matriculation courses.");
        s2.put("amount_display", "100% Tuition Fee Reimbursement + ₹13,500 / year maintenance");
        s2.put("amount_min", 13500);
        s2.put("amount_max", 150000);
        s2.put("amount_type", "TUITION_PLUS_MAINTENANCE");
        s2.put("official_website_url", "https://socialjustice.gov.in");
        s2.put("official_application_url", "https://scholarships.gov.in");
        s2.put("source_reliability", "LEVEL_1_OFFICIAL_GOVT");
        s2.put("verification_status", "VERIFIED");
        s2.put("official_scheme_id", "NSP_MOSJE_PMS_SC");
        list.add(s2);

        // 3. National Fellowship and Scholarship for Higher Education of ST Students
        Map<String, Object> s3 = new HashMap<>();
        s3.put("id", "nsp-st-higher-education-fellowship");
        s3.put("name", "National Fellowship and Scholarship for Higher Education of ST Students");
        s3.put("provider", "Ministry of Tribal Affairs, Govt. of India");
        s3.put("provider_type", "GOVERNMENT");
        s3.put("government_level", "CENTRAL");
        s3.put("state", "ALL_INDIA");
        s3.put("ministry_or_department", "Ministry of Tribal Affairs");
        s3.put("academic_year", "2026-27");
        s3.put("application_type", "FRESH_AND_RENEWAL");
        s3.put("description", "Provides financial assistance to meritorious ST students for pursuing graduate and postgraduate studies in top-class institutions like IITs, IIMs, and AIIMS.");
        s3.put("amount_display", "Full Tuition Fee + ₹3,000 / month allowance + Books grant");
        s3.put("amount_min", 36000);
        s3.put("amount_max", 250000);
        s3.put("amount_type", "FULL_FUNDING");
        s3.put("official_website_url", "https://tribal.nic.in");
        s3.put("official_application_url", "https://scholarships.gov.in");
        s3.put("source_reliability", "LEVEL_1_OFFICIAL_GOVT");
        s3.put("verification_status", "VERIFIED");
        s3.put("official_scheme_id", "NSP_MOTA_NFST");
        list.add(s3);

        return list;
    }
}
