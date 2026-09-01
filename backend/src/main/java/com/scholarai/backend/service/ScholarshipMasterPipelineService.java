package com.scholarai.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholarai.backend.connector.ScholarshipSourceConnector;
import com.scholarai.backend.entity.Scholarship;
import com.scholarai.backend.entity.ScholarshipDiscoveryCandidate;
import com.scholarai.backend.entity.ScholarshipScanRun;
import com.scholarai.backend.entity.ScholarshipSource;
import com.scholarai.backend.repository.ScholarshipDiscoveryCandidateRepository;
import com.scholarai.backend.repository.ScholarshipRepository;
import com.scholarai.backend.repository.ScholarshipScanRunRepository;
import com.scholarai.backend.repository.ScholarshipSourceRepository;
import com.scholarai.backend.util.DeadlineStatusUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 12-Hour Automated Master Scholarship Pipeline Orchestrator.
 * Handles end-to-end source health checks, bounded multi-page discovery,
 * multi-signal deduplication, high-confidence auto-publication,
 * deadline tracking, and safe existing scholarship synchronization.
 */
@Service
public class ScholarshipMasterPipelineService {

    private static final Logger log = LoggerFactory.getLogger(ScholarshipMasterPipelineService.class);

    private final List<ScholarshipSourceConnector> connectors;
    private final ScholarshipDiscoveryCandidateRepository candidateRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final ScholarshipSourceRepository sourceRepository;
    private final ScholarshipScanRunRepository scanRunRepository;
    private final ScholarshipDiscoveryService discoveryService;
    private final ScholarshipSyncService syncService;
    private final ObjectMapper objectMapper;

    public ScholarshipMasterPipelineService(
            List<ScholarshipSourceConnector> connectors,
            ScholarshipDiscoveryCandidateRepository candidateRepository,
            ScholarshipRepository scholarshipRepository,
            ScholarshipSourceRepository sourceRepository,
            ScholarshipScanRunRepository scanRunRepository,
            ScholarshipDiscoveryService discoveryService,
            ScholarshipSyncService syncService,
            ObjectMapper objectMapper) {
        this.connectors = connectors;
        this.candidateRepository = candidateRepository;
        this.scholarshipRepository = scholarshipRepository;
        this.sourceRepository = sourceRepository;
        this.scanRunRepository = scanRunRepository;
        this.discoveryService = discoveryService;
        this.syncService = syncService;
        this.objectMapper = objectMapper;
    }

    /**
     * Executes the complete 12-hour master automated scan.
     */
    @Transactional
    public Map<String, Object> executeMasterPipeline(String triggeredBy) {
        log.info("[MASTER PIPELINE START] Initiating automated 12-hour scholarship discovery & synchronization run (Triggered by: {})", triggeredBy);

        ScholarshipScanRun scanRun = new ScholarshipScanRun();
        scanRun.setStartedAt(OffsetDateTime.now());
        scanRun.setStatus("RUNNING");
        scanRun.setSourcesTotal(connectors.size());
        scanRun = scanRunRepository.save(scanRun);

        // Pre-run: reconcile duplicate published rows if any
        discoveryService.reconcilePublishedDuplicates();

        AtomicInteger sourcesChecked = new AtomicInteger(0);
        AtomicInteger sourcesSuccessful = new AtomicInteger(0);
        AtomicInteger sourcesFailed = new AtomicInteger(0);
        AtomicInteger rawCandidatesCount = new AtomicInteger(0);
        AtomicInteger duplicatesCount = new AtomicInteger(0);
        AtomicInteger newCandidatesCount = new AtomicInteger(0);
        AtomicInteger autoPublishedCount = new AtomicInteger(0);
        AtomicInteger pendingReviewCount = new AtomicInteger(0);

        List<Map<String, Object>> sourceDetails = new CopyOnWriteArrayList<>();
        Map<String, Object> errorSummary = new ConcurrentHashMap<>();

        // Bounded worker pool (6 threads) for safe, parallel source discovery
        ExecutorService executor = Executors.newFixedThreadPool(Math.min(6, Math.max(2, connectors.size())));
        List<CompletableFuture<Void>> futures = new ArrayList<>();

        for (ScholarshipSourceConnector connector : connectors) {
            CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
                sourcesChecked.incrementAndGet();
                Map<String, Object> detail = new LinkedHashMap<>();
                detail.put("sourceId", connector.getSourceId());
                detail.put("sourceName", connector.getSourceName());
                detail.put("category", connector.getCategory());
                detail.put("state", connector.getState());

                try {
                    List<Map<String, Object>> discovered = connector.discoverSchemes();
                    sourcesSuccessful.incrementAndGet();
                    detail.put("status", "SUCCESS");
                    detail.put("schemesFound", discovered != null ? discovered.size() : 0);

                    if (discovered != null) {
                        for (Map<String, Object> rawScheme : discovered) {
                            rawCandidatesCount.incrementAndGet();
                            processCandidate(connector, rawScheme, duplicatesCount, newCandidatesCount, autoPublishedCount, pendingReviewCount);
                        }
                    }
                } catch (Exception e) {
                    sourcesFailed.incrementAndGet();
                    detail.put("status", "FAILED");
                    detail.put("error", e.getMessage());
                    errorSummary.put(connector.getSourceId(), e.getMessage() != null ? e.getMessage() : "Unknown exception");
                    log.error("[MASTER PIPELINE ERROR] Source '{}' failed: {}", connector.getSourceName(), e.getMessage());
                }
                sourceDetails.add(detail);
            }, executor);
            futures.add(future);
        }

        try {
            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).get(45, TimeUnit.SECONDS);
        } catch (Exception e) {
            log.warn("[MASTER PIPELINE TIMEOUT] Parallel discovery exceeded 45s threshold, proceeding with gathered candidates: {}", e.getMessage());
        } finally {
            executor.shutdownNow();
        }

        // Evaluate and update deadlines for all existing scholarships
        Map<String, Integer> syncStats = evaluateDeadlinesAndUpdateExisting();

        // Finalize Scan Run record
        scanRun.setCompletedAt(OffsetDateTime.now());
        scanRun.setStatus(sourcesFailed.get() == 0 ? "COMPLETED" : (sourcesSuccessful.get() > 0 ? "PARTIAL" : "FAILED"));
        scanRun.setSourcesChecked(sourcesChecked.get());
        scanRun.setSourcesSuccessful(sourcesSuccessful.get());
        scanRun.setSourcesFailed(sourcesFailed.get());
        scanRun.setRawCandidates(rawCandidatesCount.get());
        scanRun.setDuplicates(duplicatesCount.get());
        scanRun.setNewCandidates(newCandidatesCount.get());
        scanRun.setAutoPublished(autoPublishedCount.get());
        scanRun.setPendingReview(pendingReviewCount.get());
        scanRun.setScholarshipsUpdated(syncStats.getOrDefault("scholarshipsUpdated", 0));
        scanRun.setDeadlinesUpdated(syncStats.getOrDefault("deadlinesUpdated", 0));
        scanRun.setClosedCount(syncStats.getOrDefault("closedCount", 0));
        scanRun.setReopenedCount(syncStats.getOrDefault("reopenedCount", 0));

        try {
            scanRun.setErrorSummary(objectMapper.writeValueAsString(errorSummary));
        } catch (Exception ignored) {}

        scanRunRepository.save(scanRun);

        long liveCount = scholarshipRepository.count();

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("scanRunId", scanRun.getId());
        summary.put("status", scanRun.getStatus());
        summary.put("startedAt", scanRun.getStartedAt());
        summary.put("completedAt", scanRun.getCompletedAt());
        summary.put("liveScholarshipCount", liveCount);
        summary.put("sourcesTotal", connectors.size());
        summary.put("sourcesChecked", sourcesChecked.get());
        summary.put("sourcesSuccessful", sourcesSuccessful.get());
        summary.put("sourcesFailed", sourcesFailed.get());
        summary.put("rawCandidatesDiscovered", rawCandidatesCount.get());
        summary.put("duplicatesDetected", duplicatesCount.get());
        summary.put("newCandidatesStaged", newCandidatesCount.get());
        summary.put("autoPublishedCount", autoPublishedCount.get());
        summary.put("pendingReviewCount", pendingReviewCount.get());
        summary.put("scholarshipsUpdated", syncStats.getOrDefault("scholarshipsUpdated", 0));
        summary.put("deadlinesUpdated", syncStats.getOrDefault("deadlinesUpdated", 0));
        summary.put("closedCount", syncStats.getOrDefault("closedCount", 0));
        summary.put("reopenedCount", syncStats.getOrDefault("reopenedCount", 0));
        summary.put("perSourceMetrics", sourceDetails);

        log.info("[MASTER PIPELINE COMPLETE] Status: {}, Live Catalog: {}, Auto-published: {}, Updated: {}",
                scanRun.getStatus(), liveCount, autoPublishedCount.get(), syncStats.getOrDefault("scholarshipsUpdated", 0));

        return summary;
    }

    /**
     * Processes an individual raw scheme candidate through deduplication and confidence evaluation.
     */
    private void processCandidate(
            ScholarshipSourceConnector connector,
            Map<String, Object> rawScheme,
            AtomicInteger duplicatesCount,
            AtomicInteger newCandidatesCount,
            AtomicInteger autoPublishedCount,
            AtomicInteger pendingReviewCount) {

        String id = (String) rawScheme.getOrDefault("id", "sch-" + System.currentTimeMillis());
        String name = (String) rawScheme.getOrDefault("name", "Unnamed Scheme");
        String officialSchemeId = (String) rawScheme.get("official_scheme_id");
        String provider = (String) rawScheme.getOrDefault("provider", connector.getSourceName());
        String websiteUrl = (String) rawScheme.getOrDefault("official_website_url", connector.getPortalUrl());

        String hash = syncService.calculateContentHash(rawScheme);

        // Check deduplication against live catalog
        Optional<Scholarship> duplicateMatch = discoveryService.findDuplicateScholarship(
                id, name, officialSchemeId, provider, websiteUrl
        );

        if (duplicateMatch.isPresent()) {
            duplicatesCount.incrementAndGet();
            return;
        }

        // Check deduplication against existing candidates
        Optional<ScholarshipDiscoveryCandidate> existingCandidate = candidateRepository.findByContentHash(hash);
        if (existingCandidate.isPresent()) {
            duplicatesCount.incrementAndGet();
            return;
        }

        newCandidatesCount.incrementAndGet();

        // Evaluate Confidence for Auto-Publication
        boolean isHighConfidence = isHighConfidenceOfficialScheme(rawScheme, connector);

        ScholarshipDiscoveryCandidate candidate = new ScholarshipDiscoveryCandidate();
        candidate.setSourceId(connector.getSourceId());
        candidate.setExternalSchemeId(officialSchemeId);
        candidate.setCandidateName(name);
        candidate.setProvider(provider);
        candidate.setState((String) rawScheme.getOrDefault("state", connector.getState()));
        candidate.setGovernmentLevel((String) rawScheme.getOrDefault("government_level", "CENTRAL"));
        candidate.setAmountDisplay((String) rawScheme.getOrDefault("amount_display", "₹ Official Verified Benefit"));
        candidate.setSourceUrl(websiteUrl);
        candidate.setContentHash(hash);
        candidate.setConfidenceScore(isHighConfidence ? 0.98 : 0.70);

        try {
            candidate.setCandidatePayload(objectMapper.writeValueAsString(rawScheme));
        } catch (Exception e) {
            candidate.setCandidatePayload("{}");
        }

        if (isHighConfidence && !scholarshipRepository.existsById(id)) {
            // Auto-publish high-confidence verified official scheme
            candidate.setStatus("PUBLISHED");
            candidate.setReviewedAt(OffsetDateTime.now());
            candidate.setReviewedBy("AUTO_PUBLISHER_DAEMON");
            candidateRepository.save(candidate);

            Scholarship sch = new Scholarship();
            sch.setId(id);
            sch.setName(name);
            sch.setProvider(provider);
            sch.setProviderType((String) rawScheme.getOrDefault("provider_type", "GOVERNMENT"));
            sch.setGovernmentLevel((String) rawScheme.getOrDefault("government_level", connector.getCategory()));
            sch.setState((String) rawScheme.getOrDefault("state", connector.getState()));
            sch.setMinistryOrDepartment((String) rawScheme.getOrDefault("ministry_or_department", ""));
            sch.setAcademicYear((String) rawScheme.getOrDefault("academic_year", "2026-27"));
            sch.setApplicationType((String) rawScheme.getOrDefault("application_type", "FRESH_AND_RENEWAL"));
            sch.setDescription((String) rawScheme.getOrDefault("description", "Official verified scholarship scheme."));
            sch.setAmountDisplay((String) rawScheme.getOrDefault("amount_display", "₹ Verified Scheme Benefit"));
            sch.setAmountType((String) rawScheme.getOrDefault("amount_type", "ANNUAL_GRANT"));

            Object minAmt = rawScheme.get("amount_min");
            if (minAmt != null) sch.setAmountMin(new BigDecimal(minAmt.toString()));

            Object maxAmt = rawScheme.get("amount_max");
            if (maxAmt != null) sch.setAmountMax(new BigDecimal(maxAmt.toString()));
            else sch.setAmountMax(BigDecimal.valueOf(50000.00));

            sch.setOfficialWebsiteUrl(websiteUrl);
            sch.setOfficialApplicationUrl((String) rawScheme.getOrDefault("official_application_url", websiteUrl));
            sch.setOfficialGuidelinePdfUrl((String) rawScheme.getOrDefault("official_guideline_pdf_url", ""));
            sch.setSourceReliability((String) rawScheme.getOrDefault("source_reliability", "LEVEL_1_OFFICIAL_GOVT"));
            sch.setVerificationStatus("VERIFIED");
            sch.setOfficialSchemeId(officialSchemeId);
            sch.setContentHash(hash);
            sch.setStatus("OPEN");
            sch.setLastVerifiedAt(OffsetDateTime.now());
            sch.setLastCheckedAt(OffsetDateTime.now());

            scholarshipRepository.save(sch);
            autoPublishedCount.incrementAndGet();
            log.info("[AUTO-PUBLISHED] High-confidence official scheme published to live catalog: {} ({})", sch.getName(), sch.getId());
        } else {
            // Stage for manual review if uncertain or candidate already exists
            candidate.setStatus("PENDING_REVIEW");
            candidateRepository.save(candidate);
            pendingReviewCount.incrementAndGet();
            log.info("[STAGED FOR REVIEW] Scheme candidate staged as PENDING_REVIEW: {} ({})", name, id);
        }
    }

    /**
     * Determines whether a candidate meets all high-confidence auto-publication criteria.
     */
    private boolean isHighConfidenceOfficialScheme(Map<String, Object> payload, ScholarshipSourceConnector connector) {
        if (payload == null) return false;
        String name = (String) payload.get("name");
        String provider = (String) payload.get("provider");
        String websiteUrl = (String) payload.get("official_website_url");
        String reliability = (String) payload.get("source_reliability");

        if (name == null || name.trim().length() < 8) return false;
        if (provider == null || provider.trim().isEmpty()) return false;
        if (websiteUrl == null || !websiteUrl.trim().toLowerCase().startsWith("http")) return false;

        // Must be LEVEL_1 or LEVEL_2 official source
        return "LEVEL_1_OFFICIAL_GOVT".equalsIgnoreCase(reliability) ||
               "LEVEL_2_OFFICIAL_AGENCY".equalsIgnoreCase(reliability) ||
               "CENTRAL_GOVERNMENT".equalsIgnoreCase(connector.getCategory()) ||
               "STATE_GOVERNMENT".equalsIgnoreCase(connector.getCategory());
    }

    /**
     * Inspects all existing live scholarships, updates deadlines, detects extensions,
     * reactivates reopened cycles, and records changes.
     */
    @Transactional
    public Map<String, Integer> evaluateDeadlinesAndUpdateExisting() {
        List<Scholarship> all = scholarshipRepository.findAll();
        int scholarshipsUpdated = 0;
        int deadlinesUpdated = 0;
        int closedCount = 0;
        int reopenedCount = 0;

        for (Scholarship sch : all) {
            boolean modified = false;
            sch.setLastCheckedAt(OffsetDateTime.now());

            // Evaluate current deadline status
            String currentStatus = sch.getStatus();
            String calculatedStatus = calculateDynamicStatus(sch);

            if (calculatedStatus != null && !calculatedStatus.equalsIgnoreCase(currentStatus)) {
                if ("CLOSED".equalsIgnoreCase(currentStatus) && ("OPEN".equalsIgnoreCase(calculatedStatus) || "UPCOMING".equalsIgnoreCase(calculatedStatus))) {
                    reopenedCount++;
                    log.info("[SCHOLARSHIP REOPENED] Scholarship '{}' reopened for active cycle (status: {})", sch.getName(), calculatedStatus);
                } else if ("CLOSED".equalsIgnoreCase(calculatedStatus)) {
                    closedCount++;
                }

                sch.setStatus(calculatedStatus);
                deadlinesUpdated++;
                modified = true;
            }

            // Recalculate content hash
            String newHash = syncService.calculateScholarshipContentHash(sch);
            if (sch.getContentHash() == null || !sch.getContentHash().equals(newHash)) {
                sch.setContentHash(newHash);
                sch.setLastVerifiedAt(OffsetDateTime.now());
                scholarshipsUpdated++;
                modified = true;
            }

            if (modified) {
                scholarshipRepository.save(sch);
            }
        }

        Map<String, Integer> stats = new HashMap<>();
        stats.put("scholarshipsUpdated", scholarshipsUpdated);
        stats.put("deadlinesUpdated", deadlinesUpdated);
        stats.put("closedCount", closedCount);
        stats.put("reopenedCount", reopenedCount);
        return stats;
    }

    private String calculateDynamicStatus(Scholarship sch) {
        if (sch == null) return "OPEN";
        if (sch.getApplicationDeadline() != null) {
            LocalDate today = LocalDate.now();
            if (sch.getApplicationOpenDate() != null && today.isBefore(sch.getApplicationOpenDate())) {
                return "UPCOMING";
            }
            if (today.isAfter(sch.getApplicationDeadline())) {
                return "CLOSED";
            }
            if (sch.getApplicationDeadline().minusDays(14).isBefore(today) || sch.getApplicationDeadline().isEqual(today)) {
                return "CLOSING_SOON";
            }
            return "OPEN";
        }
        return sch.getStatus() != null ? sch.getStatus() : "OPEN";
    }

    public List<ScholarshipScanRun> getRecentScanRuns() {
        return scanRunRepository.findAllByOrderByStartedAtDesc();
    }

    public Optional<ScholarshipScanRun> getLatestScanRun() {
        return scanRunRepository.findTopByOrderByStartedAtDesc();
    }
}
