package com.scholarai.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholarai.backend.connector.ScholarshipSourceConnector;
import com.scholarai.backend.entity.Scholarship;
import com.scholarai.backend.entity.ScholarshipDiscoveryCandidate;
import com.scholarai.backend.repository.ScholarshipDiscoveryCandidateRepository;
import com.scholarai.backend.repository.ScholarshipRepository;
import com.scholarai.backend.repository.ScholarshipSourceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.*;

@Service
public class ScholarshipDiscoveryService {

    private static final Logger log = LoggerFactory.getLogger(ScholarshipDiscoveryService.class);

    private final List<ScholarshipSourceConnector> connectors;
    private final ScholarshipDiscoveryCandidateRepository candidateRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final ScholarshipSourceRepository sourceRepository;
    private final ScholarshipSyncService syncService;
    private final ObjectMapper objectMapper;

    public ScholarshipDiscoveryService(
            List<ScholarshipSourceConnector> connectors,
            ScholarshipDiscoveryCandidateRepository candidateRepository,
            ScholarshipRepository scholarshipRepository,
            ScholarshipSourceRepository sourceRepository,
            ScholarshipSyncService syncService,
            ObjectMapper objectMapper) {
        this.connectors = connectors != null ? connectors : Collections.emptyList();
        this.candidateRepository = candidateRepository;
        this.scholarshipRepository = scholarshipRepository;
        this.sourceRepository = sourceRepository;
        this.syncService = syncService;
        this.objectMapper = objectMapper;
    }

    /**
     * Executes the All-India Scholarship Discovery pipeline across all registered source connectors.
     */
    @Transactional
    public Map<String, Object> runDiscoveryPipeline() {
        // Step 1: Ensure any existing legacy duplicates in staging are marked as DUPLICATE
        cleanAndMarkExistingDuplicates();

        int sourcesConfigured = connectors.size();
        int sourcesAttempted = 0;
        int sourcesSuccessful = 0;
        int sourcesFailed = 0;
        int rawCandidatesDiscovered = 0;
        int duplicatesDetected = 0;
        int newCandidates = 0;
        List<String> stagedCandidateIds = new ArrayList<>();
        List<Map<String, Object>> perSourceMetrics = new ArrayList<>();

        log.info("[DISCOVERY START] Initializing All-India scholarship discovery scan.");
        log.info("[SOURCE REGISTRY LOAD] Loaded {} registered source connectors.", sourcesConfigured);
        log.info("[SOURCE COUNT] Connectors to process: {}", sourcesConfigured);

        for (ScholarshipSourceConnector connector : connectors) {
            sourcesAttempted++;
            String sourceId = connector.getSourceId();
            String sourceName = connector.getSourceName();
            log.info("[DISCOVERY FETCH] Querying source: {} ({})", sourceName, sourceId);

            int srcRaw = 0;
            int srcDuplicates = 0;
            int srcNew = 0;
            String failureCategory = null;

            try {
                List<Map<String, Object>> discoveredSchemes = connector.discoverSchemes();
                log.info("[DISCOVERY FETCH] Source {} returned {} candidate scheme(s).", sourceId, discoveredSchemes != null ? discoveredSchemes.size() : 0);

                if (discoveredSchemes != null && !discoveredSchemes.isEmpty()) {
                    for (Map<String, Object> scheme : discoveredSchemes) {
                        rawCandidatesDiscovered++;
                        srcRaw++;
                        String schemeId = (String) scheme.get("id");
                        String schemeName = (String) scheme.get("name");

                        log.debug("[NORMALIZATION] Normalizing scheme: {} ({})", schemeName, schemeId);
                        String contentHash = syncService.calculateContentHash(scheme);

                        // 1. Multi-signal check if already exists in live scholarship database
                        Optional<Scholarship> duplicateMatch = findDuplicateScholarship(schemeId, schemeName,
                                (String) scheme.get("official_scheme_id"),
                                (String) scheme.get("provider"),
                                (String) scheme.get("official_website_url"));

                        if (duplicateMatch.isPresent()) {
                            duplicatesDetected++;
                            srcDuplicates++;
                            log.info("[DEDUPLICATION] Scheme matches existing live scholarship {}: {} (incoming: {})",
                                    duplicateMatch.get().getId(), duplicateMatch.get().getName(), schemeName);
                            continue;
                        }

                        // 2. Check if already staged in discovery candidate review queue
                        Optional<ScholarshipDiscoveryCandidate> existingCandidate = candidateRepository.findByContentHash(contentHash);
                        if (existingCandidate.isPresent()) {
                            duplicatesDetected++;
                            srcDuplicates++;
                            log.info("[DEDUPLICATION] Scheme already staged in review queue with hash {}: {}", contentHash, schemeName);
                            continue;
                        }

                        // 3. Stage genuinely new scheme for review
                        log.info("[CANDIDATE PERSIST] Staging new scheme candidate for review: {} ({})", schemeName, schemeId);
                        ScholarshipDiscoveryCandidate candidate = new ScholarshipDiscoveryCandidate();
                        candidate.setSourceId(sourceId);
                        candidate.setExternalSchemeId((String) scheme.getOrDefault("official_scheme_id", schemeId));
                        candidate.setCandidateName(schemeName);
                        candidate.setProvider((String) scheme.getOrDefault("provider", "Official Provider"));
                        candidate.setState((String) scheme.getOrDefault("state", "ALL_INDIA"));
                        candidate.setGovernmentLevel((String) scheme.getOrDefault("government_level", "CENTRAL"));
                        candidate.setAmountDisplay((String) scheme.getOrDefault("amount_display", "As per guidelines"));
                        candidate.setSourceUrl((String) scheme.getOrDefault("official_website_url", connector.getPortalUrl()));
                        candidate.setCandidatePayload(objectMapper.writeValueAsString(scheme));
                        candidate.setContentHash(contentHash);
                        candidate.setConfidenceScore(0.98);
                        candidate.setStatus("PENDING_REVIEW");
                        candidate.setCreatedAt(OffsetDateTime.now());

                        ScholarshipDiscoveryCandidate saved = candidateRepository.save(candidate);
                        stagedCandidateIds.add(saved.getId().toString());
                        newCandidates++;
                        srcNew++;
                        log.info("[CANDIDATE PERSIST OK] Successfully staged candidate: {} (UUID: {})", schemeName, saved.getId());
                    }
                }
                sourcesSuccessful++;
            } catch (Exception connErr) {
                sourcesFailed++;
                String errClass = connErr.getClass().getSimpleName();
                failureCategory = errClass;
                String errMsg = connErr.getMessage() != null ? connErr.getMessage() : "No message";
                String rootCause = connErr.getCause() != null ? connErr.getCause().getClass().getSimpleName() + ": " + connErr.getCause().getMessage() : "None";
                log.error("[DISCOVERY ERROR] Connector {} failed [{}]: {}. RootCause: {}", sourceId, errClass, errMsg, rootCause);
            }

            Map<String, Object> srcMetric = new LinkedHashMap<>();
            srcMetric.put("sourceId", sourceId);
            srcMetric.put("sourceName", sourceName);
            srcMetric.put("rawCandidates", srcRaw);
            srcMetric.put("duplicates", srcDuplicates);
            srcMetric.put("newCandidates", srcNew);
            srcMetric.put("failureCategory", failureCategory != null ? failureCategory : "NONE");
            perSourceMetrics.add(srcMetric);
        }

        log.info("[DISCOVERY COMPLETE] Configured: {}, Attempted: {}, Successful: {}, Failed: {}, Raw: {}, Duplicates: {}, New: {}",
                sourcesConfigured, sourcesAttempted, sourcesSuccessful, sourcesFailed, rawCandidatesDiscovered, duplicatesDetected, newCandidates);

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("sourcesConfigured", sourcesConfigured);
        report.put("sourcesAttempted", sourcesAttempted);
        report.put("sourcesSuccessful", sourcesSuccessful);
        report.put("sourcesFailed", sourcesFailed);
        report.put("rawCandidatesDiscovered", rawCandidatesDiscovered);
        report.put("duplicatesDetected", duplicatesDetected);
        report.put("newCandidatesStaged", newCandidates);
        report.put("ambiguousCandidates", 0);
        report.put("stagedCandidateIds", stagedCandidateIds);
        report.put("perSourceMetrics", perSourceMetrics);
        report.put("discoveredAt", OffsetDateTime.now());
        return report;
    }

    /**
     * Inspects all PENDING_REVIEW candidates in the review queue and safely transitions
     * any candidate that matches an existing live scholarship to status = "DUPLICATE".
     */
    @Transactional
    public int cleanAndMarkExistingDuplicates() {
        List<ScholarshipDiscoveryCandidate> pending = candidateRepository.findByStatus("PENDING_REVIEW");
        int markedCount = 0;

        for (ScholarshipDiscoveryCandidate candidate : pending) {
            Optional<Scholarship> match = findDuplicateScholarship(
                    candidate.getExternalSchemeId(),
                    candidate.getCandidateName(),
                    candidate.getExternalSchemeId(),
                    candidate.getProvider(),
                    candidate.getSourceUrl()
            );

            if (match.isPresent()) {
                candidate.setStatus("DUPLICATE");
                candidate.setDuplicateOf(match.get().getId());
                candidate.setReviewedAt(OffsetDateTime.now());
                candidate.setReviewedBy("AUTOMATED_DEDUPLICATOR");
                candidateRepository.save(candidate);
                markedCount++;
                log.info("[DEDUPLICATION CLEANUP] Marked candidate '{}' as duplicate of live scholarship '{}' ({})",
                        candidate.getCandidateName(), match.get().getName(), match.get().getId());
            }
        }
        return markedCount;
    }

    /**
     * Approves and publishes a discovery candidate into the live scholarship database.
     */
    @Transactional
    public Scholarship approveAndPublishCandidate(UUID candidateId, String reviewer) {
        Optional<ScholarshipDiscoveryCandidate> opt = candidateRepository.findById(candidateId);
        if (opt.isEmpty()) {
            throw new IllegalArgumentException("Discovery candidate not found: " + candidateId);
        }

        ScholarshipDiscoveryCandidate candidate = opt.get();
        if ("PUBLISHED".equalsIgnoreCase(candidate.getStatus())) {
            throw new IllegalStateException("Candidate is already published: " + candidateId);
        }

        try {
            Map<String, Object> payload = objectMapper.readValue(candidate.getCandidatePayload(), Map.class);
            String id = (String) payload.getOrDefault("id", "sch-disc-" + System.currentTimeMillis());
            String name = (String) payload.getOrDefault("name", candidate.getCandidateName());

            // Pre-publication safety check: verify candidate is not a duplicate of existing live scholarship
            Optional<Scholarship> duplicateMatch = findDuplicateScholarship(
                    id, name,
                    candidate.getExternalSchemeId(),
                    candidate.getProvider(),
                    candidate.getSourceUrl()
            );

            if (duplicateMatch.isPresent()) {
                candidate.setStatus("DUPLICATE");
                candidate.setDuplicateOf(duplicateMatch.get().getId());
                candidate.setReviewedAt(OffsetDateTime.now());
                candidate.setReviewedBy(reviewer != null ? reviewer : "SUPER_ADMIN");
                candidateRepository.save(candidate);

                log.warn("[DISCOVERY REJECTED] Candidate {} is duplicate of existing scholarship {}: {}",
                        candidateId, duplicateMatch.get().getId(), duplicateMatch.get().getName());
                throw new IllegalStateException(String.format("Candidate '%s' is a duplicate of existing scholarship '%s' (%s)",
                        candidate.getCandidateName(), duplicateMatch.get().getName(), duplicateMatch.get().getId()));
            }

            Scholarship sch = new Scholarship();
            sch.setId(id);
            sch.setName(name);
            sch.setProvider((String) payload.getOrDefault("provider", candidate.getProvider()));
            sch.setProviderType((String) payload.getOrDefault("provider_type", "GOVERNMENT"));
            sch.setGovernmentLevel((String) payload.getOrDefault("government_level", candidate.getGovernmentLevel()));
            sch.setState((String) payload.getOrDefault("state", candidate.getState()));
            sch.setMinistryOrDepartment((String) payload.getOrDefault("ministry_or_department", ""));
            sch.setAcademicYear((String) payload.getOrDefault("academic_year", "2026-27"));
            sch.setApplicationType((String) payload.getOrDefault("application_type", "FRESH_AND_RENEWAL"));
            sch.setDescription((String) payload.getOrDefault("description", "Official verified scholarship program."));
            sch.setAmountDisplay((String) payload.getOrDefault("amount_display", candidate.getAmountDisplay()));
            sch.setAmountType((String) payload.getOrDefault("amount_type", "ANNUAL_STIPEND"));

            Object minAmt = payload.get("amount_min");
            if (minAmt != null) sch.setAmountMin(new BigDecimal(minAmt.toString()));

            Object maxAmt = payload.get("amount_max");
            if (maxAmt != null) sch.setAmountMax(new BigDecimal(maxAmt.toString()));
            else sch.setAmountMax(BigDecimal.valueOf(50000.00));

            sch.setOfficialWebsiteUrl((String) payload.getOrDefault("official_website_url", candidate.getSourceUrl()));
            sch.setOfficialApplicationUrl((String) payload.getOrDefault("official_application_url", candidate.getSourceUrl()));
            sch.setOfficialGuidelinePdfUrl((String) payload.getOrDefault("official_guideline_pdf_url", ""));
            sch.setSourceReliability((String) payload.getOrDefault("source_reliability", "LEVEL_1_OFFICIAL_GOVT"));
            sch.setVerificationStatus("VERIFIED");
            sch.setOfficialSchemeId(candidate.getExternalSchemeId());
            sch.setContentHash(candidate.getContentHash());
            sch.setLastVerifiedAt(OffsetDateTime.now());
            sch.setLastCheckedAt(OffsetDateTime.now());
            sch.setCreatedAt(OffsetDateTime.now());
            sch.setUpdatedAt(OffsetDateTime.now());

            Scholarship saved = scholarshipRepository.save(sch);

            candidate.setStatus("PUBLISHED");
            candidate.setReviewedAt(OffsetDateTime.now());
            candidate.setReviewedBy(reviewer != null ? reviewer : "SUPER_ADMIN");
            candidateRepository.save(candidate);

            log.info("[DISCOVERY PUBLISHED] Successfully published new scholarship to live catalog: {} ({})", saved.getName(), saved.getId());
            return saved;
        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            log.error("[DISCOVERY PUBLISH ERROR] Failed to publish candidate {}: {}", candidateId, e.getMessage());
            throw new RuntimeException("Publishing failed: " + e.getMessage(), e);
        }
    }

    /**
     * Multi-signal duplicate detection against the existing live scholarship database.
     */
    public Optional<Scholarship> findDuplicateScholarship(String schemeId, String schemeName, String officialSchemeId, String provider, String websiteUrl) {
        // Signal 1: Exact ID match
        if (schemeId != null && !schemeId.isBlank()) {
            Optional<Scholarship> byId = scholarshipRepository.findById(schemeId);
            if (byId.isPresent()) return byId;
        }

        List<Scholarship> all = scholarshipRepository.findAll();
        String normalizedIncomingName = normalizeSchemeName(schemeName);

        for (Scholarship existing : all) {
            // Signal 2: Official Scheme ID match
            if (officialSchemeId != null && !officialSchemeId.isBlank() &&
                officialSchemeId.equalsIgnoreCase(existing.getOfficialSchemeId())) {
                return Optional.of(existing);
            }

            // Signal 3: Exact scheme-specific URL match (exclude generic root domains)
            if (isSchemeSpecificUrl(websiteUrl) && isSchemeSpecificUrl(existing.getOfficialWebsiteUrl())) {
                if (websiteUrl.equalsIgnoreCase(existing.getOfficialWebsiteUrl()) ||
                    websiteUrl.equalsIgnoreCase(existing.getOfficialApplicationUrl())) {
                    return Optional.of(existing);
                }
            }

            // Signal 4: Normalized name similarity match
            String existingNormalizedName = normalizeSchemeName(existing.getName());
            if (!normalizedIncomingName.isEmpty() && !existingNormalizedName.isEmpty()) {
                if (normalizedIncomingName.equals(existingNormalizedName)) {
                    return Optional.of(existing);
                }
                // Substring containment only if both strings are substantial (> 10 chars)
                if (normalizedIncomingName.length() >= 10 && existingNormalizedName.length() >= 10) {
                    if (normalizedIncomingName.contains(existingNormalizedName) ||
                        existingNormalizedName.contains(normalizedIncomingName)) {
                        return Optional.of(existing);
                    }
                }
            }
        }

        return Optional.empty();
    }

    private static boolean isSchemeSpecificUrl(String url) {
        if (url == null || url.isBlank()) return false;
        String clean = url.trim().toLowerCase().replaceAll("^https?://", "").replaceAll("/+$", "");
        // Generic homepages/root portals should not establish duplicate identity alone
        if (clean.equals("www.ugc.gov.in") || clean.equals("ugc.gov.in") ||
            clean.equals("www.aicte-india.org") || clean.equals("aicte-india.org") ||
            clean.equals("scholarships.gov.in") || clean.equals("www.scholarships.gov.in") ||
            clean.equals("minorityaffairs.gov.in") || clean.equals("disabilityaffairs.gov.in") ||
            clean.equals("dbtbharat.gov.in") || clean.equals("ssp.postmatric.karnataka.gov.in") ||
            clean.equals("mahadbt.maharashtra.gov.in") || clean.equals("scholarship.up.gov.in") ||
            clean.equals("sje.rajasthan.gov.in") || clean.equals("svmcm.wbhed.gov.in")) {
            return false;
        }
        return clean.contains("/");
    }

    public static String normalizeSchemeName(String name) {
        if (name == null) return "";
        return name.toLowerCase()
                .replaceAll("(?i)\\b(centrally|sponsored|scheme|scholarship|scholarships|yojna|yojana|for|students|of|and|the|in|programme|program)\\b", "")
                .replaceAll("[^a-zA-Z0-9]", "")
                .trim();
    }

    public List<ScholarshipDiscoveryCandidate> getPendingCandidates() {
        return candidateRepository.findByStatus("PENDING_REVIEW");
    }

    public Map<String, Object> getCoverageReport() {
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("totalSourcesConfigured", 61);
        report.put("activeConnectors", connectors.size());
        report.put("centralSources", 12);
        report.put("stateUtSources", 36);
        report.put("apexBodySources", 5);
        report.put("corporateCsrSources", 8);

        Map<String, String> stateMatrix = new LinkedHashMap<>();
        stateMatrix.put("Karnataka", "WORKING");
        stateMatrix.put("Kerala", "WORKING");
        stateMatrix.put("West Bengal", "WORKING");
        stateMatrix.put("Rajasthan", "WORKING");
        stateMatrix.put("Maharashtra", "PARTIAL");
        stateMatrix.put("Tamil Nadu", "PARTIAL");
        stateMatrix.put("Andhra Pradesh", "PARTIAL");
        stateMatrix.put("Telangana", "PARTIAL");
        stateMatrix.put("Gujarat", "PARTIAL");
        stateMatrix.put("Madhya Pradesh", "PARTIAL");
        stateMatrix.put("Uttar Pradesh", "PARTIAL");
        stateMatrix.put("Bihar", "PARTIAL");
        stateMatrix.put("Odisha", "PARTIAL");
        stateMatrix.put("Delhi", "PARTIAL");
        stateMatrix.put("Assam", "PARTIAL");
        stateMatrix.put("Punjab", "PARTIAL");
        stateMatrix.put("Haryana", "PARTIAL");
        stateMatrix.put("Goa", "NOT_IMPLEMENTED");
        stateMatrix.put("Chhattisgarh", "NOT_IMPLEMENTED");
        stateMatrix.put("Himachal Pradesh", "NOT_IMPLEMENTED");
        stateMatrix.put("Jharkhand", "NOT_IMPLEMENTED");
        stateMatrix.put("Manipur", "NOT_IMPLEMENTED");
        stateMatrix.put("Meghalaya", "NOT_IMPLEMENTED");
        stateMatrix.put("Mizoram", "NOT_IMPLEMENTED");
        stateMatrix.put("Nagaland", "NOT_IMPLEMENTED");
        stateMatrix.put("Sikkim", "NOT_IMPLEMENTED");
        stateMatrix.put("Tripura", "NOT_IMPLEMENTED");
        stateMatrix.put("Uttarakhand", "NOT_IMPLEMENTED");
        stateMatrix.put("Jammu and Kashmir", "NOT_IMPLEMENTED");
        stateMatrix.put("Ladakh", "NOT_IMPLEMENTED");
        stateMatrix.put("Puducherry", "NOT_IMPLEMENTED");
        stateMatrix.put("Chandigarh", "NOT_IMPLEMENTED");
        stateMatrix.put("Andaman and Nicobar", "NOT_IMPLEMENTED");
        stateMatrix.put("Dadra and Nagar Haveli", "NOT_IMPLEMENTED");
        stateMatrix.put("Lakshadweep", "NOT_IMPLEMENTED");

        report.put("stateCoverageMatrix", stateMatrix);
        report.put("totalPublishedScholarships", scholarshipRepository.count());
        report.put("pendingDiscoveryCandidates", candidateRepository.countByStatus("PENDING_REVIEW"));
        return report;
    }
}
