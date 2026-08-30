package com.scholarai.backend.controller;

import com.scholarai.backend.dto.ApiResponse;
import com.scholarai.backend.dto.DashboardSummaryDTO;
import com.scholarai.backend.security.AuthenticatedUser;
import com.scholarai.backend.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryDTO>> getSummary(
            @AuthenticationPrincipal AuthenticatedUser user) {
        DashboardSummaryDTO summary = dashboardService.getSummary(user.getUserId());
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
}
