package com.scholarai.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholarai.backend.connector.CentralNspConnector;
import com.scholarai.backend.connector.ScholarshipSourceConnector;
import com.scholarai.backend.connector.UgcAicteConnector;
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

        List<ScholarshipSourceConnector> connectors = List.of(new CentralNspConnector(), new UgcAicteConnector());
        discoveryService = new ScholarshipDiscoveryService(
                connectors, candidateRepository, scholarshipRepository, sourceRepository, syncService, objectMapper
        );
    }

    @Test
    void testDiscoveryPipelineStagesNewCandidatesAndSuppressesDuplicates() {
        // Mock existing DB scholarship
        Scholarship existing = new Scholarship();
        existing.setId("nsp-pm-usp-csss");
        when(scholarshipRepository.findById("nsp-pm-usp-csss")).thenReturn(Optional.of(existing));

        // Mock candidate save
        when(candidateRepository.save(any(ScholarshipDiscoveryCandidate.class))).thenAnswer(i -> {
            ScholarshipDiscoveryCandidate c = i.getArgument(0);
            c.setId(UUID.randomUUID());
            return c;
        });

        Map<String, Object> report = discoveryService.runDiscoveryPipeline();

        assertNotNull(report);
        assertEquals(2, report.get("sourcesConfigured"));
        assertTrue((int) report.get("candidatesDiscovered") >= 5);
        assertTrue((int) report.get("duplicatesDetected") >= 1);
        assertTrue((int) report.get("newCandidatesStaged") >= 1);

        verify(candidateRepository, atLeastOnce()).save(any(ScholarshipDiscoveryCandidate.class));
    }

    @Test
    void testApproveAndPublishCandidatePersistsLiveScholarship() {
        UUID candidateId = UUID.randomUUID();
        ScholarshipDiscoveryCandidate candidate = new ScholarshipDiscoveryCandidate();
        candidate.setId(candidateId);
        candidate.setCandidateName("AICTE Pragati Scholarship for Girls");
        candidate.setProvider("AICTE");
        candidate.setCandidatePayload("{\"id\":\"aicte-pragati\",\"name\":\"AICTE Pragati Scholarship\",\"provider\":\"AICTE\",\"amount_display\":\"₹50,000 / year\",\"amount_max\":50000}");
        candidate.setContentHash("HASH_PRAGATI");
        candidate.setStatus("PENDING_REVIEW");

        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(scholarshipRepository.save(any(Scholarship.class))).thenAnswer(i -> i.getArgument(0));
        when(candidateRepository.save(any(ScholarshipDiscoveryCandidate.class))).thenAnswer(i -> i.getArgument(0));

        Scholarship published = discoveryService.approveAndPublishCandidate(candidateId, "SUPER_ADMIN");

        assertNotNull(published);
        assertEquals("aicte-pragati", published.getId());
        assertEquals("AICTE Pragati Scholarship", published.getName());
        assertEquals("PUBLISHED", candidate.getStatus());
        assertEquals("SUPER_ADMIN", candidate.getReviewedBy());

        verify(scholarshipRepository, times(1)).save(any(Scholarship.class));
        verify(candidateRepository, times(1)).save(candidate);
    }

    @Test
    void testCoverageReportContainsAllStates() {
        Map<String, Object> report = discoveryService.getCoverageReport();
        assertNotNull(report);
        assertEquals(61, report.get("totalSourcesConfigured"));
        assertTrue(report.containsKey("stateCoverageMatrix"));
        @SuppressWarnings("unchecked")
        Map<String, String> matrix = (Map<String, String>) report.get("stateCoverageMatrix");
        assertTrue(matrix.containsKey("Maharashtra"));
        assertTrue(matrix.containsKey("Tamil Nadu"));
        assertTrue(matrix.containsKey("Delhi"));
        assertTrue(matrix.containsKey("Karnataka"));
    }
}
