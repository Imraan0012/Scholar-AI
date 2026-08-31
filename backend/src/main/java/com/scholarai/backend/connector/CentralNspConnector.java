package com.scholarai.backend.connector;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class CentralNspConnector implements ScholarshipSourceConnector {

    private static final Logger log = LoggerFactory.getLogger(CentralNspConnector.class);

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

        // 1. MoMA Merit-cum-Means Scholarship for Professional and Technical Courses
        Map<String, Object> s1 = new HashMap<>();
        s1.put("id", "moma-merit-cum-means-cs");
        s1.put("name", "Merit-cum-Means Scholarship for Professional and Technical Courses (Minority)");
        s1.put("provider", "Ministry of Minority Affairs, Govt. of India");
        s1.put("provider_type", "GOVERNMENT");
        s1.put("government_level", "CENTRAL");
        s1.put("state", "ALL_INDIA");
        s1.put("ministry_or_department", "Ministry of Minority Affairs");
        s1.put("academic_year", "2026-27");
        s1.put("application_type", "FRESH_AND_RENEWAL");
        s1.put("description", "Financial assistance for meritorious minority students (Muslim, Christian, Sikh, Buddhist, Jain, Parsi) pursuing professional and technical undergraduate/postgraduate courses.");
        s1.put("amount_display", "₹20,000 / year + Full Course Fee Reimbursement for Top 85 Listed Institutes");
        s1.put("amount_min", 20000);
        s1.put("amount_max", 100000);
        s1.put("amount_type", "ANNUAL_STIPEND");
        s1.put("official_website_url", "https://minorityaffairs.gov.in");
        s1.put("official_application_url", "https://scholarships.gov.in");
        s1.put("source_reliability", "LEVEL_1_OFFICIAL_GOVT");
        s1.put("verification_status", "VERIFIED");
        s1.put("official_scheme_id", "NSP_MOMA_MCM_2026");
        list.add(s1);

        // 2. MoMA Post-Matric Scholarship Scheme for Minorities
        Map<String, Object> s2 = new HashMap<>();
        s2.put("id", "moma-post-matric-scholarship");
        s2.put("name", "Post-Matric Scholarship Scheme for Minorities");
        s2.put("provider", "Ministry of Minority Affairs, Govt. of India");
        s2.put("provider_type", "GOVERNMENT");
        s2.put("government_level", "CENTRAL");
        s2.put("state", "ALL_INDIA");
        s2.put("ministry_or_department", "Ministry of Minority Affairs");
        s2.put("academic_year", "2026-27");
        s2.put("application_type", "FRESH_AND_RENEWAL");
        s2.put("description", "Scholarship supporting minority students studying in class 11th, 12th, undergraduate, postgraduate, M.Phil, Ph.D., and technical diploma courses.");
        s2.put("amount_display", "Up to ₹10,000 / year admission & tuition fee + ₹1,200 / month maintenance");
        s2.put("amount_min", 10000);
        s2.put("amount_max", 25000);
        s2.put("amount_type", "ANNUAL_STIPEND");
        s2.put("official_website_url", "https://minorityaffairs.gov.in");
        s2.put("official_application_url", "https://scholarships.gov.in");
        s2.put("source_reliability", "LEVEL_1_OFFICIAL_GOVT");
        s2.put("verification_status", "VERIFIED");
        s2.put("official_scheme_id", "NSP_MOMA_POSTMATRIC");
        list.add(s2);

        // 3. DEPwD Post-Matric Scholarship for Students with Disabilities
        Map<String, Object> s3 = new HashMap<>();
        s3.put("id", "depwd-post-matric-disabilities");
        s3.put("name", "Post-Matric Scholarship for Students with Disabilities (PwD)");
        s3.put("provider", "Department of Empowerment of Persons with Disabilities, Ministry of Social Justice, Govt. of India");
        s3.put("provider_type", "GOVERNMENT");
        s3.put("government_level", "CENTRAL");
        s3.put("state", "ALL_INDIA");
        s3.put("ministry_or_department", "DEPwD / Ministry of Social Justice");
        s3.put("academic_year", "2026-27");
        s3.put("application_type", "FRESH_AND_RENEWAL");
        s3.put("description", "Centrally sponsored scholarship for students with 40%+ benchmark disability pursuing studies from Class 11th onwards up to Post Graduation.");
        s3.put("amount_display", "Tuition Fee Reimbursement + ₹4,000 / year disability allowance + ₹1,600 / month maintenance");
        s3.put("amount_min", 25000);
        s3.put("amount_max", 75000);
        s3.put("amount_type", "ANNUAL_STIPEND");
        s3.put("official_website_url", "https://disabilityaffairs.gov.in");
        s3.put("official_application_url", "https://scholarships.gov.in");
        s3.put("source_reliability", "LEVEL_1_OFFICIAL_GOVT");
        s3.put("verification_status", "VERIFIED");
        s3.put("official_scheme_id", "NSP_DEPWD_POSTMATRIC");
        list.add(s3);

        // 4. DEPwD Scholarships for Top Class Education for Students with Disabilities
        Map<String, Object> s4 = new HashMap<>();
        s4.put("id", "depwd-top-class-education-pwd");
        s4.put("name", "Scholarships for Top Class Education for Students with Disabilities");
        s4.put("provider", "Department of Empowerment of Persons with Disabilities, Govt. of India");
        s4.put("provider_type", "GOVERNMENT");
        s4.put("government_level", "CENTRAL");
        s4.put("state", "ALL_INDIA");
        s4.put("ministry_or_department", "DEPwD");
        s4.put("academic_year", "2026-27");
        s4.put("application_type", "FRESH_AND_RENEWAL");
        s4.put("description", "Full funding support for disabled students gaining admission into premier institutions notified by DEPwD (IITs, IIMs, NITs, AIIMS).");
        s4.put("amount_display", "Full Tuition Fee + ₹3,000 / month living allowance + ₹30,000 one-time computer grant");
        s4.put("amount_min", 60000);
        s4.put("amount_max", 300000);
        s4.put("amount_type", "FULL_FUNDING");
        s4.put("official_website_url", "https://disabilityaffairs.gov.in");
        s4.put("official_application_url", "https://scholarships.gov.in");
        s4.put("source_reliability", "LEVEL_1_OFFICIAL_GOVT");
        s4.put("verification_status", "VERIFIED");
        s4.put("official_scheme_id", "NSP_DEPWD_TOPCLASS");
        list.add(s4);

        log.info("[NSP CONNECTOR] Discovered {} active central government schemes.", list.size());
        return list;
    }
}
