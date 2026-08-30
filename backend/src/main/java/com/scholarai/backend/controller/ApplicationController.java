package com.scholarai.backend.controller;

import com.scholarai.backend.dto.ApiResponse;
import com.scholarai.backend.entity.Scholarship;
import com.scholarai.backend.entity.StudentApplication;
import com.scholarai.backend.security.AuthenticatedUser;
import com.scholarai.backend.service.ApplicationService;
import com.scholarai.backend.service.ScholarshipService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final ScholarshipService scholarshipService;

    public ApplicationController(ApplicationService applicationService,
                                 ScholarshipService scholarshipService) {
        this.applicationService = applicationService;
        this.scholarshipService = scholarshipService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentApplication>>> getApplications(
            @AuthenticationPrincipal AuthenticatedUser user) {
        List<StudentApplication> apps = applicationService.getUserApplications(user.getUserId());
        return ResponseEntity.ok(ApiResponse.success(apps));
    }

    @PostMapping("/{scholarshipId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> recordApplication(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable String scholarshipId,
            @RequestBody(required = false) Map<String, String> body) {

        String status = (body != null && body.containsKey("status")) ? body.get("status") : "APPLY_CLICKED";
        StudentApplication app = applicationService.recordApplication(user.getUserId(), scholarshipId, status);

        // Fetch verified official application URL
        Scholarship scholarship = scholarshipService.getScholarshipById(scholarshipId);
        String officialUrl = scholarship.getOfficialApplicationUrl() != null && !scholarship.getOfficialApplicationUrl().isEmpty()
                ? scholarship.getOfficialApplicationUrl()
                : scholarship.getOfficialWebsiteUrl();

        Map<String, Object> data = new HashMap<>();
        data.put("application", app);
        data.put("officialApplicationUrl", officialUrl);
        data.put("applications", applicationService.getUserApplications(user.getUserId()));

        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PutMapping("/{scholarshipId}")
    public ResponseEntity<ApiResponse<StudentApplication>> updateStatus(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable String scholarshipId,
            @RequestBody Map<String, String> body) {

        String status = body.getOrDefault("status", "APPLIED");
        StudentApplication app = applicationService.updateStatus(user.getUserId(), scholarshipId, status);
        return ResponseEntity.ok(ApiResponse.success(app));
    }

    @DeleteMapping("/{scholarshipId}")
    public ResponseEntity<ApiResponse<List<StudentApplication>>> deleteApplication(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable String scholarshipId) {
        applicationService.deleteApplication(user.getUserId(), scholarshipId);
        List<StudentApplication> updated = applicationService.getUserApplications(user.getUserId());
        return ResponseEntity.ok(ApiResponse.success("Application removed", updated));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<List<StudentApplication>>> clearAll(
            @AuthenticationPrincipal AuthenticatedUser user) {
        applicationService.clearAllApplications(user.getUserId());
        return ResponseEntity.ok(ApiResponse.success("All applications cleared", List.of()));
    }
}
