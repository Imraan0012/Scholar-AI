package com.scholarai.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholarai.backend.connector.*;
import com.scholarai.backend.entity.Scholarship;
import com.scholarai.backend.entity.ScholarshipDiscoveryCandidate;
import com.scholarai.backend.repository.ScholarshipDiscoveryCandidateRepository;
import com.scholarai.backend.repository.ScholarshipRepository;
import com.scholarai.backend.repository.ScholarshipSourceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ScholarshipDiscoveryServiceTest {

    private ScholarshipDiscoveryCandidateRepository candidateRepository;
    private ScholarshipRepository scholarshipRepository;
    private ScholarshipSourceRepository sourceRepository;
    private ScholarshipSyncService syncService;
    private ObjectMapper objectMapper;
    private ScholarshipDiscoveryService discoveryService;

    @BeforeEach
    void setUp() {
        candidateRepository = mock(ScholarshipDiscoveryCandidateRepository.class);
        scholarshipRepository = mock(ScholarshipRepository.class);
        sourceRepository = mock(ScholarshipSourceRepository.class);
        objectMapper = new ObjectMapper();
        com.scholarai.backend.repository.ScholarshipUpdateReviewRepository reviewRepo = mock(com.scholarai.backend.repository.ScholarshipUpdateReviewRepository.class);
        syncService = new ScholarshipSyncService(scholarshipRepository, reviewRepo, objectMapper);

        List<ScholarshipSourceConnector> connectors = List.of(
                new CentralNspConnector(),
                new UgcAicteConnector(),
                new StatePortalConnector(),
                new CorporateCsrConnector()
        );
        discoveryService = new ScholarshipDiscoveryService(
                connectors, candidateRepository, scholarshipRepository, sourceRepository, syncService, objectMapper
        );
    }

    @Test
    void testDiscoveryPipelineStagesGenuinelyNewCandidatesAndSuppressesDuplicates() {
        // Mock existing DB scholarship (e.g. 1 existing match)
        Scholarship existing = new Scholarship();
        existing.setId("nsp-pm-usp-csss");
        existing.setName("PM-USP Central Sector Scheme of Scholarships for College and University Students");
        when(scholarshipRepository.findById("nsp-pm-usp-csss")).thenReturn(Optional.of(existing));
        when(scholarshipRepository.findAll()).thenReturn(List.of(existing));

        // Mock candidate save
        when(candidateRepository.save(any(ScholarshipDiscoveryCandidate.class))).thenAnswer(i -> {
            ScholarshipDiscoveryCandidate c = i.getArgument(0);
            if (c.getId() == null) c.setId(UUID.randomUUID());
            return c;
        });

        Map<String, Object> report = discoveryService.runDiscoveryPipeline();

        assertNotNull(report);
        assertEquals(4, report.get("sourcesConfigured"));
        assertEquals(4, report.get("sourcesAttempted"));
        assertEquals(4, report.get("sourcesSuccessful"));
        assertEquals(0, report.get("sourcesFailed"));

        int raw = (int) report.get("rawCandidatesDiscovered");
        int staged = (int) report.get("newCandidatesStaged");
        assertTrue(raw >= 10, "Should discover at least 10 candidates across 4 connectors");
        assertTrue(staged >= 5, "Should stage multiple genuinely new candidates");

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> metrics = (List<Map<String, Object>>) report.get("perSourceMetrics");
        assertNotNull(metrics);
        assertEquals(4, metrics.size());
        assertEquals("src-central-nsp", metrics.get(0).get("sourceId"));

        verify(candidateRepository, atLeastOnce()).save(any(ScholarshipDiscoveryCandidate.class));
    }

    @Test
    void testCleanAndMarkExistingDuplicates() {
        ScholarshipDiscoveryCandidate dupCandidate = new ScholarshipDiscoveryCandidate();
        dupCandidate.setId(UUID.randomUUID());
        dupCandidate.setCandidateName("AICTE Pragati Scholarship Scheme for Girl Students (Degree)");
        dupCandidate.setProvider("AICTE");
        dupCandidate.setStatus("PENDING_REVIEW");

        Scholarship live = new Scholarship();
        live.setId("aicte-pragati-degree");
        live.setName("AICTE Pragati Scholarship Scheme for Girl Students (Degree)");

        when(candidateRepository.findByStatus("PENDING_REVIEW")).thenReturn(List.of(dupCandidate));
        when(scholarshipRepository.findAll()).thenReturn(List.of(live));
        when(candidateRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        int marked = discoveryService.cleanAndMarkExistingDuplicates();
        assertEquals(1, marked);
        assertEquals("DUPLICATE", dupCandidate.getStatus());
        assertEquals("aicte-pragati-degree", dupCandidate.getDuplicateOf());
    }

    @Test
    void testApproveAndPublishCandidatePersistsLiveScholarship() {
        UUID candidateId = UUID.randomUUID();
        ScholarshipDiscoveryCandidate candidate = new ScholarshipDiscoveryCandidate();
        candidate.setId(candidateId);
        candidate.setCandidateName("Unique Special Foundation Grant 2026");
        candidate.setProvider("Special Trust");
        candidate.setCandidatePayload("{\"id\":\"unique-grant-2026\",\"name\":\"Unique Special Foundation Grant 2026\",\"provider\":\"Special Trust\",\"amount_display\":\"₹50,000 / year\",\"amount_max\":50000}");
        candidate.setContentHash("HASH_UNIQUE");
        candidate.setStatus("PENDING_REVIEW");

        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(scholarshipRepository.findAll()).thenReturn(Collections.emptyList());
        when(scholarshipRepository.save(any(Scholarship.class))).thenAnswer(i -> i.getArgument(0));
        when(candidateRepository.save(any(ScholarshipDiscoveryCandidate.class))).thenAnswer(i -> i.getArgument(0));

        Scholarship published = discoveryService.approveAndPublishCandidate(candidateId, "SUPER_ADMIN");

        assertNotNull(published);
        assertEquals("unique-grant-2026", published.getId());
        assertEquals("Unique Special Foundation Grant 2026", published.getName());
        assertEquals("PUBLISHED", candidate.getStatus());
        assertEquals("SUPER_ADMIN", candidate.getReviewedBy());

        verify(scholarshipRepository, times(1)).save(any(Scholarship.class));
        verify(candidateRepository, times(1)).save(candidate);
    }

    @Test
    void testApproveAndPublishCandidateRejectsDuplicate() {
        UUID candidateId = UUID.randomUUID();
        ScholarshipDiscoveryCandidate candidate = new ScholarshipDiscoveryCandidate();
        candidate.setId(candidateId);
        candidate.setCandidateName("AICTE Pragati Scholarship Scheme for Girl Students (Degree)");
        candidate.setProvider("AICTE");
        candidate.setCandidatePayload("{\"id\":\"aicte-pragati-new\",\"name\":\"AICTE Pragati Scholarship Scheme for Girl Students (Degree)\",\"provider\":\"AICTE\"}");
        candidate.setStatus("PENDING_REVIEW");

        Scholarship existingLive = new Scholarship();
        existingLive.setId("aicte-pragati-degree");
        existingLive.setName("AICTE Pragati Scholarship Scheme for Girl Students (Degree)");

        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(scholarshipRepository.findAll()).thenReturn(List.of(existingLive));

        assertThrows(IllegalStateException.class, () -> {
            discoveryService.approveAndPublishCandidate(candidateId, "SUPER_ADMIN");
        });

        assertEquals("DUPLICATE", candidate.getStatus());
        assertEquals("aicte-pragati-degree", candidate.getDuplicateOf());
        verify(candidateRepository, times(1)).save(candidate);
        verify(scholarshipRepository, never()).save(any(Scholarship.class));
    }

    @Test
    void testDoublePublishingThrowsException() {
        UUID candidateId = UUID.randomUUID();
        ScholarshipDiscoveryCandidate candidate = new ScholarshipDiscoveryCandidate();
        candidate.setId(candidateId);
        candidate.setStatus("PUBLISHED");

        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(candidate));

        assertThrows(IllegalStateException.class, () -> {
            discoveryService.approveAndPublishCandidate(candidateId, "SUPER_ADMIN");
        });
    }

    @Test
    void testCoverageReportContainsEvidenceBasedMatrix() {
        Map<String, Object> report = discoveryService.getCoverageReport();
        assertNotNull(report);
        assertEquals(61, report.get("totalSourcesConfigured"));
        assertTrue(report.containsKey("stateCoverageMatrix"));
        @SuppressWarnings("unchecked")
        Map<String, String> matrix = (Map<String, String>) report.get("stateCoverageMatrix");
        assertEquals("WORKING", matrix.get("Karnataka"));
        assertEquals("WORKING", matrix.get("Kerala"));
        assertEquals("PARTIAL", matrix.get("Maharashtra"));
        assertEquals("PARTIAL", matrix.get("Tamil Nadu"));
        assertEquals("NOT_IMPLEMENTED", matrix.get("Goa"));
    }

    @Test
    void test1_SameUgcHomepageWithDifferentScholarshipNamesIsNotDuplicate() {
        Scholarship existing = new Scholarship();
        existing.setId("ugc-pg-indira-gandhi-single-girl");
        existing.setName("Post-Graduate Indira Gandhi Scholarship for Single Girl Child");
        existing.setOfficialWebsiteUrl("https://www.ugc.gov.in");

        when(scholarshipRepository.findAll()).thenReturn(List.of(existing));

        Optional<Scholarship> match = discoveryService.findDuplicateScholarship(
                "ugc-rank-holders",
                "UGC Post-Graduate Merit Scholarship for University Rank Holders",
                null,
                "University Grants Commission",
                "https://www.ugc.gov.in"
        );

        assertTrue(match.isEmpty(), "Generic UGC homepage must not cause false duplicate detection");
    }

    @Test
    void test2_SameProviderWithDifferentSchemeIsNotDuplicate() {
        Scholarship existing = new Scholarship();
        existing.setId("aicte-pragati-degree");
        existing.setName("AICTE Pragati Scholarship Scheme for Girl Students (Degree)");
        existing.setProvider("AICTE");

        when(scholarshipRepository.findAll()).thenReturn(List.of(existing));

        Optional<Scholarship> match = discoveryService.findDuplicateScholarship(
                "aicte-swanath-scholarship",
                "AICTE Swanath Scholarship Scheme for Orphans",
                null,
                "AICTE",
                "https://www.aicte-india.org"
        );

        assertTrue(match.isEmpty(), "Different schemes from same provider must not be marked duplicate");
    }

    @Test
    void test3_SameOfficialSchemeIdIsDefinitiveDuplicate() {
        Scholarship existing = new Scholarship();
        existing.setId("mota-st-fellowship");
        existing.setName("National Fellowship for ST Students");
        existing.setOfficialSchemeId("NSP_MOTA_ST_2026");

        when(scholarshipRepository.findAll()).thenReturn(List.of(existing));

        Optional<Scholarship> match = discoveryService.findDuplicateScholarship(
                "new-incoming-st",
                "ST Higher Education Scholarship Program",
                "NSP_MOTA_ST_2026",
                "Ministry of Tribal Affairs",
                "https://tribal.nic.in"
        );

        assertTrue(match.isPresent(), "Matching official_scheme_id must be detected as duplicate");
        assertEquals("mota-st-fellowship", match.get().getId());
    }

    @Test
    void test4_SameNormalizedSchemeNameAndProviderIsDuplicate() {
        Scholarship existing = new Scholarship();
        existing.setId("wipro-santoor-womens-scholarship");
        existing.setName("Santoor Women’s Scholarship for Higher Education");
        existing.setProvider("Wipro Consumer Care and Wipro Cares");

        when(scholarshipRepository.findAll()).thenReturn(List.of(existing));

        Optional<Scholarship> match = discoveryService.findDuplicateScholarship(
                "santoor-grant-new",
                "Santoor Women's Scholarship Scheme for Higher Education",
                null,
                "Wipro Cares",
                "https://www.santoorwomensscholarship.com"
        );

        assertTrue(match.isPresent(), "Normalized matching scheme name must be detected as duplicate");
        assertEquals("wipro-santoor-womens-scholarship", match.get().getId());
    }

    @Test
    void test5_ExactSchemeSpecificUrlMatchesIdentityAsDuplicate() {
        Scholarship existing = new Scholarship();
        existing.setId("adobe-wit-india");
        existing.setName("Adobe India Women-in-Technology Scholarship");
        existing.setOfficialWebsiteUrl("https://research.adobe.com/scholarship/adobe-india-women-in-technology-scholarship/");

        when(scholarshipRepository.findAll()).thenReturn(List.of(existing));

        Optional<Scholarship> match = discoveryService.findDuplicateScholarship(
                "adobe-candidate",
                "Adobe India Women in Tech Award",
                null,
                "Adobe",
                "https://research.adobe.com/scholarship/adobe-india-women-in-technology-scholarship/"
        );

        assertTrue(match.isPresent(), "Exact deep scheme-specific URL must match duplicate");
        assertEquals("adobe-wit-india", match.get().getId());
    }

    @Test
    void test6_SlightlyDifferentSpellingOfSameSchemeIsDuplicate() {
        Scholarship existing = new Scholarship();
        existing.setId("mosje-post-matric-sc");
        existing.setName("Centrally Sponsored Post-Matric Scholarship Scheme for SC Students");

        when(scholarshipRepository.findAll()).thenReturn(List.of(existing));

        Optional<Scholarship> match = discoveryService.findDuplicateScholarship(
                "sc-postmatric-nsp",
                "Post Matric Scholarship for SC Students (Centrally Sponsored)",
                null,
                "Ministry of Social Justice and Empowerment",
                "https://socialjustice.gov.in"
        );

        assertTrue(match.isPresent(), "Word order / spelling variations of same scheme must match duplicate");
        assertEquals("mosje-post-matric-sc", match.get().getId());
    }

    @Test
    void test7_DifferentLegitimateSchemesFromSameMinistryAreNotDuplicate() {
        Scholarship existing1 = new Scholarship();
        existing1.setId("moma-post-matric");
        existing1.setName("Post-Matric Scholarship Scheme for Minorities");

        when(scholarshipRepository.findAll()).thenReturn(List.of(existing1));

        Optional<Scholarship> match = discoveryService.findDuplicateScholarship(
                "moma-mcm-candidate",
                "Merit-cum-Means Scholarship for Professional and Technical Courses (Minority)",
                null,
                "Ministry of Minority Affairs",
                "https://minorityaffairs.gov.in"
        );

        assertTrue(match.isEmpty(), "Distinct schemes from same ministry must not be marked duplicate");
    }
}
