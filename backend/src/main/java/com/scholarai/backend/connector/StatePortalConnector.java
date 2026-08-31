package com.scholarai.backend.connector;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class StatePortalConnector implements ScholarshipSourceConnector {

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

        // Maharashtra MahaDBT EBC
        Map<String, Object> s1 = new HashMap<>();
        s1.put("id", "mahadbt-rajarshi-shahu-ebc");
        s1.put("name", "Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC)");
        s1.put("provider", "Directorate of Higher Education, Govt. of Maharashtra");
        s1.put("provider_type", "GOVERNMENT");
        s1.put("government_level", "STATE");
        s1.put("state", "MAHARASHTRA");
        s1.put("ministry_or_department", "Higher & Technical Education Department");
        s1.put("academic_year", "2026-27");
        s1.put("application_type", "FRESH_AND_RENEWAL");
        s1.put("description", "50% Tuition fee and Exam fee reimbursement for economically weaker section students admitted under CAP in professional/non-professional courses.");
        s1.put("amount_display", "50% of Tuition & Exam Fees Reimbursement");
        s1.put("amount_min", 10000);
        s1.put("amount_max", 120000);
        s1.put("amount_type", "FEE_REIMBURSEMENT");
        s1.put("official_website_url", "https://mahadbt.maharashtra.gov.in");
        s1.put("official_application_url", "https://mahadbt.maharashtra.gov.in");
        s1.put("source_reliability", "LEVEL_1_OFFICIAL_GOVT");
        s1.put("verification_status", "VERIFIED");
        s1.put("official_scheme_id", "MAHADBT_EBC_50PCT");
        list.add(s1);

        // Karnataka SSP Post Matric
        Map<String, Object> s2 = new HashMap<>();
        s2.put("id", "karnataka-ssp-post-matric");
        s2.put("name", "Karnataka State Scholarship Portal (SSP) Post-Matric Scholarship");
        s2.put("provider", "Social Welfare & Backward Classes Welfare Dept, Govt. of Karnataka");
        s2.put("provider_type", "GOVERNMENT");
        s2.put("government_level", "STATE");
        s2.put("state", "KARNATAKA");
        s2.put("ministry_or_department", "Social Welfare Department");
        s2.put("academic_year", "2026-27");
        s2.put("application_type", "FRESH_AND_RENEWAL");
        s2.put("description", "State portal providing post-matric tuition fee reimbursement and maintenance stipend to eligible SC, ST, OBC, and Minority students.");
        s2.put("amount_display", "100% Fee Reimbursement + Monthly Maintenance Allowance");
        s2.put("amount_min", 15000);
        s2.put("amount_max", 100000);
        s2.put("amount_type", "FEE_REIMBURSEMENT");
        s2.put("official_website_url", "https://ssp.postmatric.karnataka.gov.in");
        s2.put("official_application_url", "https://ssp.postmatric.karnataka.gov.in");
        s2.put("source_reliability", "LEVEL_1_OFFICIAL_GOVT");
        s2.put("verification_status", "VERIFIED");
        s2.put("official_scheme_id", "KARNATAKA_SSP_POSTMATRIC");
        list.add(s2);

        // Tamil Nadu Post-Matric Scholarship for SC/ST
        Map<String, Object> s3 = new HashMap<>();
        s3.put("id", "tn-adi-dravidar-post-matric");
        s3.put("name", "Tamil Nadu Adi Dravidar and Tribal Welfare Post-Matric Scholarship");
        s3.put("provider", "Adi Dravidar and Tribal Welfare Department, Govt. of Tamil Nadu");
        s3.put("provider_type", "GOVERNMENT");
        s3.put("government_level", "STATE");
        s3.put("state", "TAMIL_NADU");
        s3.put("ministry_or_department", "Adi Dravidar & Tribal Welfare Department");
        s3.put("academic_year", "2026-27");
        s3.put("application_type", "FRESH_AND_RENEWAL");
        s3.put("description", "Full non-refundable fee waiver and annual maintenance allowance for SC, ST and converted Christian students studying in recognized institutions.");
        s3.put("amount_display", "100% Compulsory Tuition Fee Waiver + Maintenance");
        s3.put("amount_min", 20000);
        s3.put("amount_max", 125000);
        s3.put("amount_type", "FULL_FEE_WAIVER");
        s3.put("official_website_url", "https://tn.gov.in");
        s3.put("official_application_url", "https://tn.gov.in");
        s3.put("source_reliability", "LEVEL_1_OFFICIAL_GOVT");
        s3.put("verification_status", "VERIFIED");
        s3.put("official_scheme_id", "TN_ADW_POSTMATRIC");
        list.add(s3);

        return list;
    }
}
