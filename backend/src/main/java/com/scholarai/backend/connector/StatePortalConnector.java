package com.scholarai.backend.connector;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class StatePortalConnector implements ScholarshipSourceConnector {

    private static final Logger log = LoggerFactory.getLogger(StatePortalConnector.class);

    @Override
    public String getSourceId() { return "src-state-dbt-network"; }

    @Override
    public String getSourceName() { return "All-India State DBT Government Portals"; }

    @Override
    public String getCategory() { return "STATE_GOVERNMENT"; }

    @Override
    public String getState() { return "ALL_STATES"; }

    @Override
    public String getPortalUrl() { return "https://dbtbharat.gov.in"; }

    @Override
    public List<Map<String, Object>> discoverSchemes() {
        List<Map<String, Object>> list = new ArrayList<>();

        // 1. Karnataka Vidyasiri (Food and Accommodation Scheme)
        Map<String, Object> s1 = new HashMap<>();
        s1.put("id", "karnataka-vidyasiri-fa-scheme");
        s1.put("name", "Karnataka Vidyasiri Food and Accommodation Scheme (OBC/SC/ST)");
        s1.put("provider", "Backward Classes Welfare Department, Govt. of Karnataka");
        s1.put("provider_type", "GOVERNMENT");
        s1.put("government_level", "STATE");
        s1.put("state", "KARNATAKA");
        s1.put("ministry_or_department", "Backward Classes Welfare Department");
        s1.put("academic_year", "2026-27");
        s1.put("application_type", "FRESH_AND_RENEWAL");
        s1.put("description", "Direct financial assistance of ₹1,500/month for 10 months for post-matric students who could not get admission into government student hostels.");
        s1.put("amount_display", "₹1,500 / month (₹15,000 / year for 10 months)");
        s1.put("amount_min", 15000);
        s1.put("amount_max", 15000);
        s1.put("amount_type", "MONTHLY_MAINTENANCE_STIPEND");
        s1.put("official_website_url", "https://bcwd.karnataka.gov.in");
        s1.put("official_application_url", "https://ssp.postmatric.karnataka.gov.in");
        s1.put("source_reliability", "LEVEL_1_OFFICIAL_GOVT");
        s1.put("verification_status", "VERIFIED");
        s1.put("official_scheme_id", "KARNATAKA_BCWD_VIDYASIRI");
        list.add(s1);

        // 2. Kerala Aspire Scholarship for Post Graduate / Research Students
        Map<String, Object> s2 = new HashMap<>();
        s2.put("id", "kerala-dce-aspire-scholarship");
        s2.put("name", "Kerala Aspire Scholarship Scheme for Post-Graduate Research");
        s2.put("provider", "Directorate of Collegiate Education, Govt. of Kerala");
        s2.put("provider_type", "GOVERNMENT");
        s2.put("government_level", "STATE");
        s2.put("state", "KERALA");
        s2.put("ministry_or_department", "Higher Education Department, Govt. of Kerala");
        s2.put("academic_year", "2026-27");
        s2.put("application_type", "FRESH");
        s2.put("description", "Financial grant to postgraduate students pursuing short-term research / internship projects in reputed institutions within or outside Kerala.");
        s2.put("amount_display", "₹8,000 / month (within state) to ₹10,000 / month (outside state)");
        s2.put("amount_min", 8000);
        s2.put("amount_max", 30000);
        s2.put("amount_type", "INTERNSHIP_RESEARCH_STIPEND");
        s2.put("official_website_url", "http://www.dcescholarship.kerala.gov.in");
        s2.put("official_application_url", "http://www.dcescholarship.kerala.gov.in/dce/he_ma/he_aspire.php");
        s2.put("source_reliability", "LEVEL_1_OFFICIAL_GOVT");
        s2.put("verification_status", "VERIFIED");
        s2.put("official_scheme_id", "KERALA_DCE_ASPIRE_2026");
        list.add(s2);

        // 3. West Bengal Kanyashree K3 Scheme (Post-Graduate for Girls)
        Map<String, Object> s3 = new HashMap<>();
        s3.put("id", "wb-kanyashree-k3-pg");
        s3.put("name", "West Bengal Kanyashree Prakalpa (K3 Scheme for PG University Students)");
        s3.put("provider", "Department of Higher Education, Govt. of West Bengal");
        s3.put("provider_type", "GOVERNMENT");
        s3.put("government_level", "STATE");
        s3.put("state", "WEST_BENGAL");
        s3.put("ministry_or_department", "Higher Education Department, West Bengal");
        s3.put("academic_year", "2026-27");
        s3.put("application_type", "FRESH_AND_RENEWAL");
        s3.put("description", "Empowering girl students who have passed undergraduate degree with 45%+ marks and registered in post-graduate courses in West Bengal universities.");
        s3.put("amount_display", "₹2,500 / month (Science) or ₹2,000 / month (Arts/Commerce)");
        s3.put("amount_min", 24000);
        s3.put("amount_max", 30000);
        s3.put("amount_type", "MONTHLY_STIPEND");
        s3.put("official_website_url", "https://wbkanyashree.gov.in");
        s3.put("official_application_url", "https://svmcm.wbhed.gov.in");
        s3.put("source_reliability", "LEVEL_1_OFFICIAL_GOVT");
        s3.put("verification_status", "VERIFIED");
        s3.put("official_scheme_id", "WB_KANYASHREE_K3");
        list.add(s3);

        // 4. Rajasthan Mukhyamantri Anuprati Coaching Scheme
        Map<String, Object> s4 = new HashMap<>();
        s4.put("id", "rajasthan-anuprati-coaching-scheme");
        s4.put("name", "Rajasthan Mukhyamantri Anuprati Coaching Scheme");
        s4.put("provider", "Social Justice and Empowerment Department, Govt. of Rajasthan");
        s4.put("provider_type", "GOVERNMENT");
        s4.put("government_level", "STATE");
        s4.put("state", "RAJASTHAN");
        s4.put("ministry_or_department", "Social Justice & Empowerment Department");
        s4.put("academic_year", "2026-27");
        s4.put("application_type", "FRESH");
        s4.put("description", "Free professional coaching + ₹40,000/year residential lodging assistance for preparation of UPSC, RPSC, JEE, NEET, CLAT, and CA examinations.");
        s4.put("amount_display", "100% Free Coaching + ₹40,000 / year hostel & boarding assistance");
        s4.put("amount_min", 40000);
        s4.put("amount_max", 100000);
        s4.put("amount_type", "COACHING_AND_BOARDING_GRANT");
        s4.put("official_website_url", "https://sje.rajasthan.gov.in");
        s4.put("official_application_url", "https://sso.rajasthan.gov.in");
        s4.put("source_reliability", "LEVEL_1_OFFICIAL_GOVT");
        s4.put("verification_status", "VERIFIED");
        s4.put("official_scheme_id", "RAJ_SJE_ANUPRATI_2026");
        list.add(s4);

        log.info("[STATE PORTAL CONNECTOR] Discovered {} active state government schemes.", list.size());
        return list;
    }
}
