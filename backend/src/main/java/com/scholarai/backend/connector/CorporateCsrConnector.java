package com.scholarai.backend.connector;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class CorporateCsrConnector implements ScholarshipSourceConnector {

    @Override
    public String getSourceId() { return "src-corporate-csr-foundations"; }

    @Override
    public String getSourceName() { return "National Corporate CSR & Foundation Scholarship Funds"; }

    @Override
    public String getCategory() { return "CORPORATE_CSR"; }

    @Override
    public String getState() { return "ALL_INDIA"; }

    @Override
    public String getPortalUrl() { return "https://www.reliancefoundation.org"; }

    @Override
    public List<Map<String, Object>> discoverSchemes() {
        List<Map<String, Object>> list = new ArrayList<>();

        // Reliance Foundation UG
        Map<String, Object> s1 = new HashMap<>();
        s1.put("id", "reliance-foundation-ug");
        s1.put("name", "Reliance Foundation Undergraduate Scholarship 2026");
        s1.put("provider", "Reliance Foundation");
        s1.put("provider_type", "FOUNDATION");
        s1.put("government_level", "PRIVATE_TRUST");
        s1.put("state", "ALL_INDIA");
        s1.put("ministry_or_department", "Reliance Foundation Education");
        s1.put("academic_year", "2026-27");
        s1.put("application_type", "FRESH");
        s1.put("description", "Prestigious grant providing up to ₹2,00,000 for undergraduate degree studies across all disciplines based on merit-cum-means.");
        s1.put("amount_display", "Up to ₹2,00,000 over the duration of degree");
        s1.put("amount_min", 50000);
        s1.put("amount_max", 200000);
        s1.put("amount_type", "MULTI_YEAR_GRANT");
        s1.put("official_website_url", "https://www.scholarships.reliancefoundation.org");
        s1.put("official_application_url", "https://www.scholarships.reliancefoundation.org/UG_Scholarship.aspx");
        s1.put("source_reliability", "VERIFIED_CORPORATE_CSR");
        s1.put("verification_status", "VERIFIED");
        s1.put("official_scheme_id", "RF_UG_SCHOLARSHIP_2026");
        list.add(s1);

        // Kotak Kanya Scholarship
        Map<String, Object> s2 = new HashMap<>();
        s2.put("id", "kotak-kanya-scholarship");
        s2.put("name", "Kotak Kanya Scholarship for Girl Students in Professional Courses");
        s2.put("provider", "Kotak Education Foundation");
        s2.put("provider_type", "FOUNDATION");
        s2.put("government_level", "PRIVATE_TRUST");
        s2.put("state", "ALL_INDIA");
        s2.put("ministry_or_department", "Kotak Education Foundation");
        s2.put("academic_year", "2026-27");
        s2.put("application_type", "FRESH_AND_RENEWAL");
        s2.put("description", "Annual grant of ₹1.5 Lakh per year for meritorious girl students pursuing professional graduation courses in Engineering, MBBS, Architecture, Law, and Design.");
        s2.put("amount_display", "₹1,50,000 per year until course completion");
        s2.put("amount_min", 150000);
        s2.put("amount_max", 150000);
        s2.put("amount_type", "ANNUAL_GRANT");
        s2.put("official_website_url", "https://kotakeducation.org/kotak-kanya-scholarship");
        s2.put("official_application_url", "https://kotakeducation.org/kotak-kanya-scholarship");
        s2.put("source_reliability", "VERIFIED_CORPORATE_CSR");
        s2.put("verification_status", "VERIFIED");
        s2.put("official_scheme_id", "KOTAK_KANYA_SCHOLARSHIP_2026");
        list.add(s2);

        return list;
    }
}
