package com.scholarai.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholarai.backend.connector.ScholarshipSourceConnector;
import com.scholarai.backend.entity.Scholarship;
import com.scholarai.backend.entity.ScholarshipDiscoveryCandidate;
import com.scholarai.backend.entity.ScholarshipScanRun;
import com.scholarai.backend.repository.ScholarshipDiscoveryCandidateRepository;
import com.scholarai.backend.repository.ScholarshipRepository;
import com.scholarai.backend.repository.ScholarshipScanRunRepository;
import com.scholarai.backend.repository.ScholarshipSourceRepository;
import com.scholarai.backend.repository.ScholarshipUpdateReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class ScholarshipMasterPipelineServiceTest {

    private ScholarshipDiscoveryCandidateRepository candidateRepository;
    private ScholarshipRepository scholarshipRepository;
    private ScholarshipSourceRepository sourceRepository;
    private ScholarshipScanRunRepository scanRunRepository;
    private ScholarshipUpdateReviewRepository reviewRepository;
    private ScholarshipDiscoveryService discoveryService;
    private ScholarshipSyncService syncService;
    private ScholarshipSourceConnector mockConnector;

    private ObjectMapper objectMapper;
    private ScholarshipMasterPipelineService masterPipelineService;

    @BeforeEach
    void setUp() {
        candidateRepository = mock(ScholarshipDiscoveryCandidateRepository.class);
        scholarshipRepository = mock(ScholarshipRepository.class);
        sourceRepository = mock(ScholarshipSourceRepository.class);
        scanRunRepository = mock(ScholarshipScanRunRepository.class);
        reviewRepository = mock(ScholarshipUpdateReviewRepository.class);
        mockConnector = mock(ScholarshipSourceConnector.class);

        objectMapper = new ObjectMapper();
        syncService = new ScholarshipSyncService(scholarshipRepository, reviewRepository, objectMapper);
        discoveryService = new ScholarshipDiscoveryService(
                List.of(mockConnector), candidateRepository, scholarshipRepository, sourceRepository, syncService, objectMapper
        );

        List<ScholarshipSourceConnector> connectors = List.of(mockConnector);

        masterPipelineService = new ScholarshipMasterPipelineService(
                connectors,
                candidateRepository,
                scholarshipRepository,
                sourceRepository,
                scanRunRepository,
                discoveryService,
                syncService,
                objectMapper
        );

        when(scanRunRepository.save(any(ScholarshipScanRun.class))).thenAnswer(i -> {
            ScholarshipScanRun run = i.getArgument(0);
            if (run.getId() == null) run.setId(UUID.randomUUID());
            return run;
        });
    }

    @Test
    @DisplayName("12-Hour Master Pipeline: Executes full discovery, auto-publishes high-confidence verified scheme, and updates scan run")
    void testMasterPipeline_AutoPublishesHighConfidenceScheme() {
        when(mockConnector.getSourceId()).thenReturn("src-test-gov");
        when(mockConnector.getSourceName()).thenReturn("National Testing Portal");
        when(mockConnector.getCategory()).thenReturn("CENTRAL_GOVERNMENT");
        when(mockConnector.getState()).thenReturn("ALL_INDIA");
        when(mockConnector.getPortalUrl()).thenReturn("https://testscholarship.gov.in");

        Map<String, Object> candidatePayload = new HashMap<>();
        candidatePayload.put("id", "new-official-scheme-2026");
        candidatePayload.put("name", "Prime Minister National Research Fellowship 2026");
        candidatePayload.put("provider", "Ministry of Education, Govt. of India");
        candidatePayload.put("provider_type", "GOVERNMENT");
        candidatePayload.put("government_level", "CENTRAL");
        candidatePayload.put("state", "ALL_INDIA");
        candidatePayload.put("official_website_url", "https://testscholarship.gov.in/pmnrf");
        candidatePayload.put("source_reliability", "LEVEL_1_OFFICIAL_GOVT");
        candidatePayload.put("amount_display", "₹80,000 / month");
        candidatePayload.put("amount_max", 960000);
        candidatePayload.put("official_scheme_id", "PMNRF_2026_OFFICIAL");

        when(mockConnector.discoverSchemes()).thenReturn(List.of(candidatePayload));
        when(candidateRepository.findByContentHash(anyString())).thenReturn(Optional.empty());
        when(scholarshipRepository.findById(anyString())).thenReturn(Optional.empty());
        when(scholarshipRepository.existsById(eq("new-official-scheme-2026"))).thenReturn(false);
        when(scholarshipRepository.count()).thenReturn(61L);
        when(scholarshipRepository.findAll()).thenReturn(List.of());

        Map<String, Object> report = masterPipelineService.executeMasterPipeline("TEST_RUN");

        assertNotNull(report);
        assertEquals("COMPLETED", report.get("status"));
        assertEquals(1, report.get("sourcesChecked"));
        assertEquals(1, report.get("sourcesSuccessful"));
        assertEquals(0, report.get("sourcesFailed"));
        assertEquals(1, report.get("rawCandidatesDiscovered"));
        assertEquals(0, report.get("duplicatesDetected"));
        assertEquals(1, report.get("newCandidatesStaged"));
        assertEquals(1, report.get("autoPublishedCount"));
        assertEquals(61L, report.get("liveScholarshipCount"));

        ArgumentCaptor<Scholarship> schCaptor = ArgumentCaptor.forClass(Scholarship.class);
        verify(scholarshipRepository, times(1)).save(schCaptor.capture());
        Scholarship published = schCaptor.getValue();
        assertEquals("new-official-scheme-2026", published.getId());
        assertEquals("Prime Minister National Research Fellowship 2026", published.getName());
        assertEquals("AVAILABILITY_UNVERIFIED", published.getStatus());
    }

    @Test
    @DisplayName("Lifecycle Resolution: Verifies that null dates produce AVAILABILITY_UNVERIFIED, active dates produce OPEN, future dates produce UPCOMING, and passed dates produce CLOSED")
    void testLifecycleResolutionRules() {
        LocalDate today = LocalDate.now();

        // 1. Null dates -> AVAILABILITY_UNVERIFIED
        String statusNull = masterPipelineService.resolveLifecycleStatus(Map.of(), null, null);
        assertEquals("AVAILABILITY_UNVERIFIED", statusNull);

        // 2. Active dates -> OPEN
        String statusActive = masterPipelineService.resolveLifecycleStatus(
                Map.of(), today.minusDays(10), today.plusDays(30)
        );
        assertEquals("OPEN", statusActive);

        // 3. Expired deadline -> CLOSED
        String statusExpired = masterPipelineService.resolveLifecycleStatus(
                Map.of(), today.minusMonths(2), today.minusDays(1)
        );
        assertEquals("CLOSED", statusExpired);

        // 4. Future opening date -> UPCOMING
        String statusFuture = masterPipelineService.resolveLifecycleStatus(
                Map.of(), today.plusDays(10), today.plusDays(40)
        );
        assertEquals("UPCOMING", statusFuture);

        // 5. Closing soon (<= 14 days) -> CLOSING_SOON
        String statusClosingSoon = masterPipelineService.resolveLifecycleStatus(
                Map.of(), today.minusDays(20), today.plusDays(5)
        );
        assertEquals("CLOSING_SOON", statusClosingSoon);

        // 6. Explicit YEAR_ROUND with null dates -> YEAR_ROUND
        String statusYearRound = masterPipelineService.resolveLifecycleStatus(
                Map.of("status", "YEAR_ROUND"), null, null
        );
        assertEquals("YEAR_ROUND", statusYearRound);
    }

    @Test
    @DisplayName("12-Hour Master Pipeline: Ignores duplicate candidate and does not increase count")
    void testMasterPipeline_DeduplicatesExistingCandidate() {
        when(mockConnector.getSourceId()).thenReturn("src-test-gov");
        when(mockConnector.getSourceName()).thenReturn("National Testing Portal");
        when(mockConnector.getCategory()).thenReturn("CENTRAL_GOVERNMENT");
        when(mockConnector.getState()).thenReturn("ALL_INDIA");
        when(mockConnector.getPortalUrl()).thenReturn("https://testscholarship.gov.in");

        Map<String, Object> duplicatePayload = new HashMap<>();
        duplicatePayload.put("id", "existing-scheme");
        duplicatePayload.put("name", "Existing Test Scholarship");
        duplicatePayload.put("provider", "Govt");
        duplicatePayload.put("official_website_url", "https://testscholarship.gov.in/existing");

        when(mockConnector.discoverSchemes()).thenReturn(List.of(duplicatePayload));

        Scholarship existingSch = new Scholarship();
        existingSch.setId("existing-scheme");
        existingSch.setName("Existing Test Scholarship");
        existingSch.setOfficialWebsiteUrl("https://testscholarship.gov.in/existing");

        when(scholarshipRepository.findById("existing-scheme")).thenReturn(Optional.of(existingSch));
        when(scholarshipRepository.findAll()).thenReturn(List.of(existingSch));
        when(scholarshipRepository.count()).thenReturn(60L);

        Map<String, Object> report = masterPipelineService.executeMasterPipeline("TEST_RUN");

        assertNotNull(report);
        assertEquals(1, report.get("duplicatesDetected"));
        assertEquals(0, report.get("autoPublishedCount"));
    }

    @Test
    @DisplayName("12-Hour Master Pipeline: Evaluates deadline extensions and updates scholarship status")
    void testEvaluateDeadlinesAndUpdateExisting() {
        Scholarship sch1 = new Scholarship();
        sch1.setId("sch-expired");
        sch1.setName("Expired Scheme");
        sch1.setStatus("OPEN");
        sch1.setAmountMax(BigDecimal.valueOf(10000));
        sch1.setApplicationDeadline(LocalDate.now().minusDays(5));

        Scholarship sch2 = new Scholarship();
        sch2.setId("sch-closing-soon");
        sch2.setName("Closing Soon Scheme");
        sch2.setStatus("OPEN");
        sch2.setAmountMax(BigDecimal.valueOf(10000));
        sch2.setApplicationDeadline(LocalDate.now().plusDays(3));

        Scholarship sch3 = new Scholarship();
        sch3.setId("sch-reopened");
        sch3.setName("Reopened Scheme");
        sch3.setStatus("CLOSED");
        sch3.setAmountMax(BigDecimal.valueOf(10000));
        sch3.setApplicationDeadline(LocalDate.now().plusMonths(2));

        when(scholarshipRepository.findAll()).thenReturn(List.of(sch1, sch2, sch3));

        Map<String, Integer> stats = masterPipelineService.evaluateDeadlinesAndUpdateExisting();

        assertNotNull(stats);
        assertEquals(3, stats.get("deadlinesUpdated"));
        assertEquals(1, stats.get("closedCount"));
        assertEquals(1, stats.get("reopenedCount"));
        assertEquals(3, stats.get("scholarshipsUpdated"));

        assertEquals("CLOSED", sch1.getStatus());
        assertEquals("CLOSING_SOON", sch2.getStatus());
        assertEquals("OPEN", sch3.getStatus());
    }

    @Test
    @DisplayName("12-Hour Master Pipeline: Stages uncertain candidates for manual review without publishing")
    void testMasterPipeline_StagesUncertainCandidateForReview() {
        when(mockConnector.getSourceId()).thenReturn("src-uncertain");
        when(mockConnector.getSourceName()).thenReturn("Unverified Portal");
        when(mockConnector.getCategory()).thenReturn("PRIVATE_TRUST");
        when(mockConnector.getState()).thenReturn("ALL_INDIA");
        when(mockConnector.getPortalUrl()).thenReturn("https://unverified.org");

        Map<String, Object> uncertainPayload = new HashMap<>();
        uncertainPayload.put("id", "uncertain-grant-1");
        uncertainPayload.put("name", "Ambiguous Grant Scheme");
        uncertainPayload.put("provider", ""); // Missing provider -> uncertain
        uncertainPayload.put("official_website_url", "https://unverified.org/scheme");
        uncertainPayload.put("source_reliability", "LEVEL_3_UNVERIFIED");

        when(mockConnector.discoverSchemes()).thenReturn(List.of(uncertainPayload));
        when(candidateRepository.findByContentHash(anyString())).thenReturn(Optional.empty());
        when(scholarshipRepository.findById(anyString())).thenReturn(Optional.empty());
        when(scholarshipRepository.count()).thenReturn(60L);
        when(scholarshipRepository.findAll()).thenReturn(List.of());

        Map<String, Object> report = masterPipelineService.executeMasterPipeline("TEST_RUN");

        assertNotNull(report);
        assertEquals(1, report.get("pendingReviewCount"));
        assertEquals(0, report.get("autoPublishedCount"));

        ArgumentCaptor<ScholarshipDiscoveryCandidate> candidateCaptor = ArgumentCaptor.forClass(ScholarshipDiscoveryCandidate.class);
        verify(candidateRepository, times(1)).save(candidateCaptor.capture());
        ScholarshipDiscoveryCandidate saved = candidateCaptor.getValue();
        assertEquals("PENDING_REVIEW", saved.getStatus());
    }
}
