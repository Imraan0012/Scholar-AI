package com.scholarai.backend.controller;

import com.scholarai.backend.dto.ApiResponse;
import com.scholarai.backend.entity.ScholarshipUpdateReview;
import com.scholarai.backend.service.ScholarshipSyncService;
import com.scholarai.backend.service.ScholarshipDiscoveryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/sync")
public class AdminSyncController {

    private final ScholarshipSyncService syncService;

    @Value("${scheduler.secret:${SCHEDULER_SECRET:}}")
    private String schedulerSecret;

    private final ScholarshipDiscoveryService discoveryService;

    public AdminSyncController(ScholarshipSyncService syncService, ScholarshipDiscoveryService discoveryService) {
        this.syncService = syncService;
        this.discoveryService = discoveryService;
    }

    private boolean isAuthorized(String headerSecret) {
        if (headerSecret == null || headerSecret.isBlank()) return false;
        return headerSecret.trim().equals(schedulerSecret.trim());
    }

    /**
     * Secured 12-hour scheduler sync endpoint triggered by GitHub Actions or admin tasks.
     */
    @PostMapping("/scholarships")
    public ResponseEntity<ApiResponse<Map<String, Object>>> runScholarshipSync(
            @RequestHeader(value = "X-Scheduler-Secret", required = false) String headerSecret,
            @RequestBody(required = false) List<Map<String, Object>> incomingRecords) {

        if (!isAuthorized(headerSecret)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized: Invalid or missing X-Scheduler-Secret header"));
        }

        List<Map<String, Object>> records = incomingRecords != null ? incomingRecords : List.of();
        Map<String, Object> result = syncService.syncOfficialSourceRecords(records);

        return ResponseEntity.ok(ApiResponse.success("Scholarship synchronization completed successfully", result));
    }

    /**
     * Triggers the All-India Discovery pipeline across all registered official source connectors.
     */
    @PostMapping("/discovery/run")
    public ResponseEntity<ApiResponse<Map<String, Object>>> runDiscovery(
            @RequestHeader(value = "X-Scheduler-Secret", required = false) String headerSecret) {

        if (!isAuthorized(headerSecret)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized: Invalid or missing X-Scheduler-Secret header"));
        }

        Map<String, Object> report = discoveryService.runDiscoveryPipeline();
        return ResponseEntity.ok(ApiResponse.success("Discovery scan completed successfully", report));
    }

    /**
     * Lists staged newly discovered scholarship candidates.
     */
    @GetMapping("/discovery/candidates")
    public ResponseEntity<ApiResponse<List<com.scholarai.backend.entity.ScholarshipDiscoveryCandidate>>> getDiscoveryCandidates(
            @RequestHeader(value = "X-Scheduler-Secret", required = false) String headerSecret) {

        if (!isAuthorized(headerSecret)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized: Invalid or missing X-Scheduler-Secret header"));
        }

        return ResponseEntity.ok(ApiResponse.success(discoveryService.getPendingCandidates()));
    }

    /**
     * Approves and publishes a newly discovered candidate to live database.
     */
    @PostMapping("/discovery/approve/{id}")
    public ResponseEntity<ApiResponse<com.scholarai.backend.entity.Scholarship>> approveDiscoveryCandidate(
            @PathVariable UUID id,
            @RequestHeader(value = "X-Scheduler-Secret", required = false) String headerSecret,
            @RequestParam(defaultValue = "ADMIN_REVIEWER") String reviewer) {

        if (!isAuthorized(headerSecret)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized: Invalid or missing X-Scheduler-Secret header"));
        }

        com.scholarai.backend.entity.Scholarship published = discoveryService.approveAndPublishCandidate(id, reviewer);
        return ResponseEntity.ok(ApiResponse.success("Candidate approved and published to live catalog", published));
    }

    /**
     * Returns comprehensive all-India scholarship source coverage matrix report.
     */
    @GetMapping("/discovery/coverage-report")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCoverageReport(
            @RequestHeader(value = "X-Scheduler-Secret", required = false) String headerSecret) {

        if (!isAuthorized(headerSecret)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized: Invalid or missing X-Scheduler-Secret header"));
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
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized: Invalid or missing X-Scheduler-Secret header"));
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
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized: Invalid or missing X-Scheduler-Secret header"));
        }

        boolean success = syncService.approveReview(id, reviewer);
        if (success) {
            return ResponseEntity.ok(ApiResponse.success("Review approved and scholarship updated", id.toString()));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Review not found or could not be applied"));
    }
}
