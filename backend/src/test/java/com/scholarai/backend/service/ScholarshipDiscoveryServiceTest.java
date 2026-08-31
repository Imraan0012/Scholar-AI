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
        existing.setName("PM-USP Central Sector Scheme of Scholarships for College and University Students");
        when(scholarshipRepository.findById("nsp-pm-usp-csss")).thenReturn(Optional.of(existing));
        when(scholarshipRepository.findAll()).thenReturn(List.of(existing));

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

        verify(candidateRepository, atLeastOnce()).save(any(ScholarshipDiscoveryCandidate.class));
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
