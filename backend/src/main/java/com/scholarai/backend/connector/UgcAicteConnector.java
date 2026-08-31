package com.scholarai.backend.connector;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class UgcAicteConnector implements ScholarshipSourceConnector {

    private static final Logger log = LoggerFactory.getLogger(UgcAicteConnector.class);

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

        // 1. AICTE Swanath Scholarship Scheme (Degree & Diploma)
        Map<String, Object> s1 = new HashMap<>();
        s1.put("id", "aicte-swanath-scholarship-scheme");
        s1.put("name", "AICTE Swanath Scholarship Scheme for Orphans and Wards of COVID/Armed Forces");
        s1.put("provider", "All India Council for Technical Education (AICTE)");
        s1.put("provider_type", "GOVERNMENT");
        s1.put("government_level", "CENTRAL");
        s1.put("state", "ALL_INDIA");
        s1.put("ministry_or_department", "AICTE / Ministry of Education");
        s1.put("academic_year", "2026-27");
        s1.put("application_type", "FRESH_AND_RENEWAL");
        s1.put("description", "Dedicated scheme providing ₹50,000/year to orphans, children whose parents died due to COVID-19, and wards of Armed Forces / Central Paramilitary Forces martyred in action.");
        s1.put("amount_display", "₹50,000 per annum for every year of technical study");
        s1.put("amount_min", 50000);
        s1.put("amount_max", 50000);
        s1.put("amount_type", "ANNUAL_STIPEND");
        s1.put("official_website_url", "https://www.aicte-india.org/schemes/students-development-schemes/Swanath-Scholarship-Scheme");
        s1.put("official_application_url", "https://scholarships.gov.in");
        s1.put("source_reliability", "LEVEL_1_OFFICIAL_GOVT");
        s1.put("verification_status", "VERIFIED");
        s1.put("official_scheme_id", "AICTE_SWANATH_SCHEME");
        list.add(s1);

        // 2. UGC Post-Graduate Merit Scholarship for University Rank Holders
        Map<String, Object> s2 = new HashMap<>();
        s2.put("id", "ugc-pg-merit-rank-holders");
        s2.put("name", "UGC Post-Graduate Merit Scholarship for University Rank Holders");
        s2.put("provider", "University Grants Commission (UGC)");
        s2.put("provider_type", "GOVERNMENT");
        s2.put("government_level", "CENTRAL");
        s2.put("state", "ALL_INDIA");
        s2.put("ministry_or_department", "University Grants Commission / Ministry of Education");
        s2.put("academic_year", "2026-27");
        s2.put("application_type", "FRESH_AND_RENEWAL");
        s2.put("description", "National award providing ₹3,100/month for two years to 1st and 2nd rank holders at the undergraduate level admitted into regular, full-time master's degree courses.");
        s2.put("amount_display", "₹3,100 / month for 2 years (Total ₹74,400)");
        s2.put("amount_min", 37200);
        s2.put("amount_max", 37200);
        s2.put("amount_type", "MONTHLY_STIPEND");
        s2.put("official_website_url", "https://www.ugc.gov.in");
        s2.put("official_application_url", "https://scholarships.gov.in");
        s2.put("source_reliability", "LEVEL_1_OFFICIAL_GOVT");
        s2.put("verification_status", "VERIFIED");
        s2.put("official_scheme_id", "UGC_RANK_HOLDERS_PG");
        list.add(s2);

        // 3. UGC Post-Doctoral Fellowship for Women (PDFWM)
        Map<String, Object> s3 = new HashMap<>();
        s3.put("id", "ugc-post-doctoral-fellowship-women");
        s3.put("name", "UGC Post-Doctoral Fellowship for Women Candidates");
        s3.put("provider", "University Grants Commission (UGC)");
        s3.put("provider_type", "GOVERNMENT");
        s3.put("government_level", "CENTRAL");
        s3.put("state", "ALL_INDIA");
        s3.put("ministry_or_department", "University Grants Commission");
        s3.put("academic_year", "2026-27");
        s3.put("application_type", "FRESH_AND_RENEWAL");
        s3.put("description", "Prestigious 5-year fellowship for unemployed women PhD holders to pursue advanced research in Sciences, Engineering, Technology, Humanities, and Social Sciences.");
        s3.put("amount_display", "₹47,000 / month + HRA + ₹50,000 / year contingency grant");
        s3.put("amount_min", 564000);
        s3.put("amount_max", 650000);
        s3.put("amount_type", "MONTHLY_RESEARCH_FELLOWSHIP");
        s3.put("official_website_url", "https://www.ugc.gov.in");
        s3.put("official_application_url", "https://www.ugc.gov.in/pdfwm/");
        s3.put("source_reliability", "LEVEL_1_OFFICIAL_GOVT");
        s3.put("verification_status", "VERIFIED");
        s3.put("official_scheme_id", "UGC_PDFWM_2026");
        list.add(s3);

        log.info("[UGC/AICTE CONNECTOR] Discovered {} active apex body scholarship programs.", list.size());
        return list;
    }
}
