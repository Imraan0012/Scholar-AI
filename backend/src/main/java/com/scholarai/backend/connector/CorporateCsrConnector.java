package com.scholarai.backend.connector;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class CorporateCsrConnector implements ScholarshipSourceConnector {

    private static final Logger log = LoggerFactory.getLogger(CorporateCsrConnector.class);

    @Override
    public String getSourceId() { return "src-corporate-csr-foundations"; }

    @Override
    public String getSourceName() { return "National Corporate CSR & Foundation Scholarship Funds"; }

    @Override
    public String getCategory() { return "CORPORATE_CSR"; }

    @Override
    public String getState() { return "ALL_INDIA"; }

    @Override
    public String getPortalUrl() { return "https://www.sitaramjindalfoundation.org"; }

    @Override
    public List<Map<String, Object>> discoverSchemes() {
        List<Map<String, Object>> list = new ArrayList<>();

        // 1. Sitaram Jindal Foundation Scholarship Scheme
        Map<String, Object> s1 = new HashMap<>();
        s1.put("id", "sitaram-jindal-foundation-scheme");
        s1.put("name", "Sitaram Jindal Foundation Scholarship Scheme for Higher Education");
        s1.put("provider", "Sitaram Jindal Foundation");
        s1.put("provider_type", "FOUNDATION");
        s1.put("government_level", "PRIVATE_TRUST");
        s1.put("state", "ALL_INDIA");
        s1.put("ministry_or_department", "Sitaram Jindal Educational Trust");
        s1.put("academic_year", "2026-27");
        s1.put("application_type", "FRESH_AND_RENEWAL");
        s1.put("description", "National grant for meritorious students belonging to economically disadvantaged backgrounds studying in ITI, Diploma, General Degree, and Engineering/Medical professional courses.");
        s1.put("amount_display", "₹1,500 / month (UG) to ₹3,200 / month (Engineering/Medicine)");
        s1.put("amount_min", 18000);
        s1.put("amount_max", 38400);
        s1.put("amount_type", "MONTHLY_STIPEND");
        s1.put("official_website_url", "https://www.sitaramjindalfoundation.org");
        s1.put("official_application_url", "https://www.sitaramjindalfoundation.org/scholarships_information.php");
        s1.put("source_reliability", "VERIFIED_CORPORATE_CSR");
        s1.put("verification_status", "VERIFIED");
        s1.put("official_scheme_id", "SJF_SCHOLARSHIP_2026");
        list.add(s1);

        // 2. Wipro Santoor Women's Scholarship
        Map<String, Object> s2 = new HashMap<>();
        s2.put("id", "wipro-santoor-womens-scholarship");
        s2.put("name", "Santoor Women’s Scholarship for Higher Education");
        s2.put("provider", "Wipro Consumer Care and Wipro Cares");
        s2.put("provider_type", "FOUNDATION");
        s2.put("government_level", "PRIVATE_TRUST");
        s2.put("state", "ALL_INDIA");
        s2.put("ministry_or_department", "Wipro Cares Foundation");
        s2.put("academic_year", "2026-27");
        s2.put("application_type", "FRESH");
        s2.put("description", "Annual financial support of ₹24,000/year to underprivileged young women from Andhra Pradesh, Karnataka, Telangana, and Chhattisgarh pursuing undergraduate degree courses in Humanities, Liberal Arts, and Sciences.");
        s2.put("amount_display", "₹24,000 per annum until completion of degree");
        s2.put("amount_min", 24000);
        s2.put("amount_max", 24000);
        s2.put("amount_type", "ANNUAL_GRANT");
        s2.put("official_website_url", "https://www.santoorwomensscholarship.com");
        s2.put("official_application_url", "https://www.santoorwomensscholarship.com");
        s2.put("source_reliability", "VERIFIED_CORPORATE_CSR");
        s2.put("verification_status", "VERIFIED");
        s2.put("official_scheme_id", "WIPRO_SANTOOR_2026");
        list.add(s2);

        // 3. Adobe India Women-in-Technology Scholarship
        Map<String, Object> s3 = new HashMap<>();
        s3.put("id", "adobe-women-in-technology-india");
        s3.put("name", "Adobe India Women-in-Technology Scholarship");
        s3.put("provider", "Adobe India");
        s3.put("provider_type", "FOUNDATION");
        s3.put("government_level", "PRIVATE_TRUST");
        s3.put("state", "ALL_INDIA");
        s3.put("ministry_or_department", "Adobe Research India");
        s3.put("academic_year", "2026-27");
        s3.put("application_type", "FRESH");
        s3.put("description", "Recognizing outstanding female undergraduate and master's students in Computer Science and Engineering with full tuition assistance, mentorship from Adobe researchers, and interview opportunity for Adobe Internship.");
        s3.put("amount_display", "100% Tuition Fee Coverage + Adobe Mentorship & Internship");
        s3.put("amount_min", 100000);
        s3.put("amount_max", 300000);
        s3.put("amount_type", "TUITION_PLUS_INTERNSHIP");
        s3.put("official_website_url", "https://research.adobe.com/scholarship/adobe-india-women-in-technology-scholarship/");
        s3.put("official_application_url", "https://research.adobe.com/scholarship/adobe-india-women-in-technology-scholarship/");
        s3.put("source_reliability", "VERIFIED_CORPORATE_CSR");
        s3.put("verification_status", "VERIFIED");
        s3.put("official_scheme_id", "ADOBE_WIT_INDIA_2026");
        list.add(s3);

        log.info("[CSR CONNECTOR] Discovered {} active CSR and foundation scholarship schemes.", list.size());
        return list;
    }
}
