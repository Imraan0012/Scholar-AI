package com.scholarai.backend.controller;

import com.scholarai.backend.dto.ApiResponse;
import com.scholarai.backend.entity.Scholarship;
import com.scholarai.backend.entity.ScholarshipDiscoveryCandidate;
import com.scholarai.backend.entity.ScholarshipUpdateReview;
import com.scholarai.backend.service.ScholarshipDiscoveryService;
import com.scholarai.backend.service.ScholarshipSyncService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping({"/api/admin/sync", "/api/admin/discovery"})
public class AdminSyncController {

    private static final Logger log = LoggerFactory.getLogger(AdminSyncController.class);

    private final ScholarshipSyncService syncService;
    private final ScholarshipDiscoveryService discoveryService;

    @Value("${scheduler.secret:${SCHEDULER_SECRET:}}")
    private String schedulerSecret;

    public AdminSyncController(ScholarshipSyncService syncService, ScholarshipDiscoveryService discoveryService) {
        this.syncService = syncService;
        this.discoveryService = discoveryService;
    }

    private boolean isAuthorized(String headerSecret) {
        boolean secretConfigured = schedulerSecret != null && !schedulerSecret.isBlank();
        boolean headerReceived = headerSecret != null && !headerSecret.isBlank();

        log.info("[AUTH CHECK] Scheduler secret configured: {}, Scheduler header received: {}",
                secretConfigured ? "YES" : "NO", headerReceived ? "YES" : "NO");

        if (!secretConfigured || !headerReceived) {
            return false;
        }

        // Constant-time comparison to prevent side-channel timing attacks
        return MessageDigest.isEqual(
                headerSecret.trim().getBytes(StandardCharsets.UTF_8),
                schedulerSecret.trim().getBytes(StandardCharsets.UTF_8)
        );
    }

    /**
     * Secured 12-hour scheduler sync endpoint triggered by GitHub Actions or admin tasks.
     */
    @PostMapping({"/scholarships", "/sync/scholarships"})
    public ResponseEntity<ApiResponse<Map<String, Object>>> runScholarshipSync(
            @RequestHeader(value = "X-Scheduler-Secret", required = false) String headerSecret,
            @RequestBody(required = false) List<Map<String, Object>> incomingRecords) {

        if (!isAuthorized(headerSecret)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Forbidden: Invalid or missing X-Scheduler-Secret header"));
        }

        List<Map<String, Object>> records = incomingRecords != null ? incomingRecords : List.of();
        Map<String, Object> result = syncService.syncOfficialSourceRecords(records);

        return ResponseEntity.ok(ApiResponse.success("Scholarship synchronization completed successfully", result));
    }

    /**
     * Triggers the All-India Discovery pipeline across all registered official source connectors.
     */
    @PostMapping({"/run", "/discovery/run"})
    public ResponseEntity<ApiResponse<Map<String, Object>>> runDiscovery(
            @RequestHeader(value = "X-Scheduler-Secret", required = false) String headerSecret) {

        if (!isAuthorized(headerSecret)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Forbidden: Invalid or missing X-Scheduler-Secret header"));
        }

        String requestId = UUID.randomUUID().toString();
        log.info("[DISCOVERY REQUEST] RequestId: {}, Authorized trigger received, starting pipeline execution...", requestId);

        try {
            Map<String, Object> report = discoveryService.runDiscoveryPipeline();
            report.put("requestId", requestId);
            return ResponseEntity.ok(ApiResponse.success("Discovery scan completed successfully", report));
        } catch (Exception e) {
            String errorType = e.getClass().getSimpleName();
            String rootCause = e.getCause() != null ? e.getCause().getClass().getSimpleName() + ": " + e.getCause().getMessage() : "None";
            log.error("[DISCOVERY 500] RequestId: {}, ErrorType: {}, Message: {}, RootCause: {}",
                    requestId, errorType, e.getMessage(), rootCause);

            Map<String, Object> errorDetails = new java.util.LinkedHashMap<>();
            errorDetails.put("requestId", requestId);
            errorDetails.put("errorType", errorType);
            errorDetails.put("success", false);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Discovery pipeline failed: " + errorType, errorDetails));
        }
    }

    /**
     * Lists staged newly discovered scholarship candidates.
     */
    @GetMapping({"/candidates", "/discovery/candidates"})
    public ResponseEntity<ApiResponse<List<ScholarshipDiscoveryCandidate>>> getDiscoveryCandidates(
            @RequestHeader(value = "X-Scheduler-Secret", required = false) String headerSecret) {

        if (!isAuthorized(headerSecret)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Forbidden: Invalid or missing X-Scheduler-Secret header"));
        }

        return ResponseEntity.ok(ApiResponse.success(discoveryService.getPendingCandidates()));
    }

    /**
     * Approves and publishes a newly discovered candidate to live database.
     */
    @PostMapping({"/approve/{id}", "/discovery/approve/{id}"})
    public ResponseEntity<ApiResponse<Scholarship>> approveDiscoveryCandidate(
            @PathVariable UUID id,
            @RequestHeader(value = "X-Scheduler-Secret", required = false) String headerSecret,
            @RequestParam(defaultValue = "ADMIN_REVIEWER") String reviewer) {

        if (!isAuthorized(headerSecret)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Forbidden: Invalid or missing X-Scheduler-Secret header"));
        }

        Scholarship published = discoveryService.approveAndPublishCandidate(id, reviewer);
        return ResponseEntity.ok(ApiResponse.success("Candidate approved and published to live catalog", published));
    }

    /**
     * Returns comprehensive all-India scholarship source coverage matrix report.
     */
    @GetMapping({"/coverage-report", "/discovery/coverage-report"})
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCoverageReport(
            @RequestHeader(value = "X-Scheduler-Secret", required = false) String headerSecret) {

        if (!isAuthorized(headerSecret)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Forbidden: Invalid or missing X-Scheduler-Secret header"));
        }

        return ResponseEntity.ok(ApiResponse.success(discoveryService.getCoverageReport()));
    }

    /**
     * Lists staged official scholarship changes awaiting review.
     */
    @GetMapping("/reviews")
    public ResponseEntity<ApiResponse<List<ScholarshipUpdateReview>>> getPendingReviews(
            @RequestHeader(value = "X-Scheduler-Secret", required = false) String headerSecret) {

        if (!isAuthorized(headerSecret)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Forbidden: Invalid or missing X-Scheduler-Secret header"));
        }

        return ResponseEntity.ok(ApiResponse.success(syncService.getPendingReviews()));
    }

    /**
     * Approves and applies a verified scholarship update.
     */
    @PostMapping("/reviews/{id}/approve")
    public ResponseEntity<ApiResponse<String>> approveReview(
            @PathVariable UUID id,
            @RequestHeader(value = "X-Scheduler-Secret", required = false) String headerSecret,
            @RequestParam(defaultValue = "ADMIN_REVIEWER") String reviewer) {

        if (!isAuthorized(headerSecret)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Forbidden: Invalid or missing X-Scheduler-Secret header"));
        }

        boolean success = syncService.approveReview(id, reviewer);
        if (success) {
            return ResponseEntity.ok(ApiResponse.success("Review approved and scholarship updated", id.toString()));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Review not found or could not be applied"));
    }
}
