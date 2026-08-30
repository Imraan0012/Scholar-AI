package com.scholarai.backend.controller;

import com.scholarai.backend.dto.ApiResponse;
import com.scholarai.backend.entity.StudentProfile;
import com.scholarai.backend.security.AuthenticatedUser;
import com.scholarai.backend.service.StudentProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/me")
public class MeController {

    private final StudentProfileService studentProfileService;

    public MeController(StudentProfileService studentProfileService) {
        this.studentProfileService = studentProfileService;
    }

    /**
     * Inspects the authenticated user's profile status in Supabase.
     * Returned format:
     * {
     *   "authenticated": true,
     *   "userId": "...",
     *   "profileExists": true/false,
     *   "onboardingComplete": true/false,
     *   "onboardingStep": 1..5
     * }
     */
    @GetMapping("/profile-status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfileStatus(
            @AuthenticationPrincipal AuthenticatedUser user) {
        
        if (user == null || user.getUserId() == null) {
            Map<String, Object> unauth = new HashMap<>();
            unauth.put("authenticated", false);
            return ResponseEntity.ok(ApiResponse.success(unauth));
        }

        StudentProfile profile = studentProfileService.findByUserId(user.getUserId());
        Map<String, Object> status = new HashMap<>();
        status.put("authenticated", true);
        status.put("userId", user.getUserId().toString());
        status.put("email", user.getEmail());

        if (profile == null) {
            status.put("profileExists", false);
            status.put("onboardingComplete", false);
            status.put("onboardingStep", 1);
            status.put("profileCompletionScore", 0);
        } else {
            status.put("profileExists", true);
            status.put("onboardingComplete", Boolean.TRUE.equals(profile.getOnboardingComplete()));
            status.put("onboardingStep", profile.getOnboardingStep() != null ? profile.getOnboardingStep() : 1);
            status.put("profileCompletionScore", profile.getProfileCompletionScore() != null ? profile.getProfileCompletionScore() : 0);
        }

        return ResponseEntity.ok(ApiResponse.success(status));
    }
}
