package com.scholarai.backend.controller;

import com.scholarai.backend.dto.ApiResponse;
import com.scholarai.backend.dto.StudentProfileDTO;
import com.scholarai.backend.entity.StudentProfile;
import com.scholarai.backend.security.AuthenticatedUser;
import com.scholarai.backend.service.StudentProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class StudentProfileController {

    private final StudentProfileService studentProfileService;

    public StudentProfileController(StudentProfileService studentProfileService) {
        this.studentProfileService = studentProfileService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<StudentProfileDTO>> getProfile(
            @AuthenticationPrincipal AuthenticatedUser user) {
        StudentProfile profile = studentProfileService.findByUserId(user.getUserId());
        if (profile == null) {
            return ResponseEntity.ok(ApiResponse.success(null));
        }
        return ResponseEntity.ok(ApiResponse.success(studentProfileService.toDTO(profile)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StudentProfileDTO>> createProfile(
            @AuthenticationPrincipal AuthenticatedUser user,
            @Valid @RequestBody StudentProfileDTO profileDto) {
        StudentProfileDTO saved = studentProfileService.saveOrUpdateProfile(user.getUserId(), profileDto);
        return ResponseEntity.ok(ApiResponse.success("Profile saved successfully", saved));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<StudentProfileDTO>> updateProfile(
            @AuthenticationPrincipal AuthenticatedUser user,
            @RequestBody StudentProfileDTO profileDto) {
        StudentProfileDTO saved = studentProfileService.saveOrUpdateProfile(user.getUserId(), profileDto);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", saved));
    }

    @GetMapping("/completion")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfileCompletion(
            @AuthenticationPrincipal AuthenticatedUser user) {
        StudentProfile profile = studentProfileService.getOrCreateProfile(user.getUserId(), user.getEmail());
        int score = studentProfileService.calculateCompletion(profile);

        Map<String, Object> data = new HashMap<>();
        data.put("profileCompletion", score);
        data.put("profileCompletionScore", score);
        return ResponseEntity.ok(ApiResponse.success(data));
    }
}
