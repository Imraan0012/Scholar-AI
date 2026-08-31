package com.scholarai.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholarai.backend.dto.ApiResponse;
import com.scholarai.backend.repository.ScholarshipDiscoveryCandidateRepository;
import com.scholarai.backend.repository.ScholarshipRepository;
import com.scholarai.backend.repository.ScholarshipSourceRepository;
import com.scholarai.backend.repository.ScholarshipUpdateReviewRepository;
import com.scholarai.backend.service.ScholarshipDiscoveryService;
import com.scholarai.backend.service.ScholarshipSyncService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class AdminSyncControllerTest {

    private ScholarshipRepository scholarshipRepository;
    private ScholarshipUpdateReviewRepository reviewRepository;
    private ScholarshipDiscoveryCandidateRepository candidateRepository;
    private ScholarshipSourceRepository sourceRepository;
    private ScholarshipSyncService syncService;
    private ScholarshipDiscoveryService discoveryService;
    private AdminSyncController controller;

    private static final String CONFIGURED_SECRET = "test-env-scheduler-secret-2026";

    @BeforeEach
    void setUp() {
        scholarshipRepository = mock(ScholarshipRepository.class);
        reviewRepository = mock(ScholarshipUpdateReviewRepository.class);
        candidateRepository = mock(ScholarshipDiscoveryCandidateRepository.class);
        sourceRepository = mock(ScholarshipSourceRepository.class);
        ObjectMapper objectMapper = new ObjectMapper();

        syncService = new ScholarshipSyncService(scholarshipRepository, reviewRepository, objectMapper);
        discoveryService = new ScholarshipDiscoveryService(
                Collections.emptyList(), candidateRepository, scholarshipRepository, sourceRepository, syncService, objectMapper
        );

        controller = new AdminSyncController(syncService, discoveryService);
        ReflectionTestUtils.setField(controller, "schedulerSecret", CONFIGURED_SECRET);
    }

    @Test
    void testMissingSecretReturnsForbidden() {
        ResponseEntity<ApiResponse<Map<String, Object>>> response =
                controller.runScholarshipSync(null, Collections.emptyList());

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals(false, response.getBody().isSuccess());
        verifyNoInteractions(scholarshipRepository);
    }

    @Test
    void testEmptySecretReturnsForbidden() {
        ResponseEntity<ApiResponse<Map<String, Object>>> response =
                controller.runScholarshipSync("   ", Collections.emptyList());

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verifyNoInteractions(scholarshipRepository);
    }

    @Test
    void testWrongSecretReturnsForbidden() {
        ResponseEntity<ApiResponse<Map<String, Object>>> response =
                controller.runScholarshipSync("wrong-secret-token", Collections.emptyList());

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verifyNoInteractions(scholarshipRepository);
    }

    @Test
    void testDiscoveryMissingSecretReturnsForbidden() {
        ResponseEntity<ApiResponse<Map<String, Object>>> response =
                controller.runDiscovery(null);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verifyNoInteractions(candidateRepository);
    }

    @Test
    void testDiscoveryWrongSecretReturnsForbidden() {
        ResponseEntity<ApiResponse<Map<String, Object>>> response =
                controller.runDiscovery("wrong-token-12345");

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verifyNoInteractions(candidateRepository);
    }

    @Test
    void testDiscoveryCorrectSecretSucceeds() {
        ResponseEntity<ApiResponse<Map<String, Object>>> response =
                controller.runDiscovery(CONFIGURED_SECRET);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(true, response.getBody().isSuccess());
    }

    @Test
    void testCorrectSecretSucceeds() {
        when(scholarshipRepository.findAll()).thenReturn(Collections.emptyList());

        ResponseEntity<ApiResponse<Map<String, Object>>> response =
                controller.runScholarshipSync(CONFIGURED_SECRET, Collections.emptyList());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(true, response.getBody().isSuccess());
        verify(scholarshipRepository, times(1)).findAll();
    }

    @Test
    void testUnconfiguredSecretRejectsAllRequests() {
        ReflectionTestUtils.setField(controller, "schedulerSecret", "");

        ResponseEntity<ApiResponse<Map<String, Object>>> response =
                controller.runScholarshipSync(CONFIGURED_SECRET, Collections.emptyList());

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verifyNoInteractions(scholarshipRepository);
    }
}
