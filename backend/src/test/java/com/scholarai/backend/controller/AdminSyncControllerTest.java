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
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
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
    void testDiscoveryServiceExceptionReturnsSafe500() {
        com.scholarai.backend.connector.ScholarshipSourceConnector failingConnector =
                mock(com.scholarai.backend.connector.ScholarshipSourceConnector.class);
        when(failingConnector.getSourceId()).thenThrow(new NullPointerException("Database connection lost unexpectedly"));

        ScholarshipDiscoveryService failingDiscoveryService = new ScholarshipDiscoveryService(
                List.of(failingConnector), candidateRepository, scholarshipRepository, sourceRepository, syncService, new ObjectMapper()
        );

        AdminSyncController failingController = new AdminSyncController(syncService, failingDiscoveryService);
        ReflectionTestUtils.setField(failingController, "schedulerSecret", CONFIGURED_SECRET);

        ResponseEntity<ApiResponse<Map<String, Object>>> response =
                failingController.runDiscovery(CONFIGURED_SECRET);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals(false, response.getBody().isSuccess());
        assertEquals("Discovery pipeline failed: NullPointerException", response.getBody().getMessage());

        @SuppressWarnings("unchecked")
        Map<String, Object> data = (Map<String, Object>) response.getBody().getData();
        assertNotNull(data);
        assertEquals("NullPointerException", data.get("errorType"));
        assertNotNull(data.get("requestId"));

        // Guarantee secret is never in the response
        String responseStr = response.toString();
        assertFalse(responseStr.contains(CONFIGURED_SECRET));
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

    @Test
    void testPublishSafeMissingSecretReturnsForbidden() {
        ResponseEntity<ApiResponse<Map<String, Object>>> response =
                controller.publishSafeCandidates(null, "ADMIN_REVIEWER");

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals(false, response.getBody().isSuccess());
        verifyNoInteractions(candidateRepository);
    }

    @Test
    void testPublishSafeWrongSecretReturnsForbidden() {
        ResponseEntity<ApiResponse<Map<String, Object>>> response =
                controller.publishSafeCandidates("wrong-secret-token", "ADMIN_REVIEWER");

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals(false, response.getBody().isSuccess());
        verifyNoInteractions(candidateRepository);
    }

    @Test
    void testPublishSafeCorrectSecretSucceeds() {
        when(candidateRepository.findByStatus("PENDING")).thenReturn(Collections.emptyList());

        ResponseEntity<ApiResponse<Map<String, Object>>> response =
                controller.publishSafeCandidates(CONFIGURED_SECRET, "ADMIN_REVIEWER");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(true, response.getBody().isSuccess());
    }
}
