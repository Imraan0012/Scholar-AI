package com.scholarai.backend.controller;

import com.scholarai.backend.dto.ApiResponse;
import com.scholarai.backend.entity.ScholarshipUpdateReview;
import com.scholarai.backend.service.ScholarshipSyncService;
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

    @Value("${app.scheduler.secret:${SCHEDULER_SECRET:scholar-ai-sync-2026}}")
    private String schedulerSecret;

    public AdminSyncController(ScholarshipSyncService syncService) {
        this.syncService = syncService;
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
