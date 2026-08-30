package com.scholarai.backend.controller;

import com.scholarai.backend.dto.ApiResponse;
import com.scholarai.backend.dto.EligibilityEvaluationResultDTO;
import com.scholarai.backend.entity.StudentProfile;
import com.scholarai.backend.security.AuthenticatedUser;
import com.scholarai.backend.service.EligibilityService;
import com.scholarai.backend.service.StudentProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/eligibility")
public class EligibilityController {

    private final EligibilityService eligibilityService;
    private final StudentProfileService studentProfileService;

    public EligibilityController(EligibilityService eligibilityService,
                                 StudentProfileService studentProfileService) {
        this.eligibilityService = eligibilityService;
        this.studentProfileService = studentProfileService;
    }

    @GetMapping("/results")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEvaluationResults(
            @AuthenticationPrincipal AuthenticatedUser user) {
        StudentProfile profile = studentProfileService.findByUserId(user.getUserId());
        if (profile == null) {
            Map<String, Object> empty = new HashMap<>();
            empty.put("allResults", List.of());
            empty.put("eligible", List.of());
            empty.put("possible", List.of());
            empty.put("ineligible", List.of());
            empty.put("summary", Map.of("eligibleCount", 0, "possibleCount", 0, "ineligibleCount", 0, "totalCount", 0));
            return ResponseEntity.ok(ApiResponse.success(empty));
        }
        List<EligibilityEvaluationResultDTO> results = eligibilityService.evaluateAndPersistAll(profile);

        List<EligibilityEvaluationResultDTO> eligible = results.stream()
                .filter(r -> "ELIGIBLE".equals(r.getEvaluationStatus()))
                .toList();

        List<EligibilityEvaluationResultDTO> possible = results.stream()
                .filter(r -> "POSSIBLE_MATCH".equals(r.getEvaluationStatus()))
                .toList();

        List<EligibilityEvaluationResultDTO> ineligible = results.stream()
                .filter(r -> "NOT_ELIGIBLE".equals(r.getEvaluationStatus()))
                .toList();

        Map<String, Object> data = new HashMap<>();
        data.put("allResults", results);
        data.put("eligible", eligible);
        data.put("possible", possible);
        data.put("ineligible", ineligible);
        data.put("summary", Map.of(
                "eligibleCount", eligible.size(),
                "possibleCount", possible.size(),
                "ineligibleCount", ineligible.size(),
                "totalCount", results.size()
        ));

        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PostMapping("/recalculate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> recalculate(
            @AuthenticationPrincipal AuthenticatedUser user) {
        StudentProfile profile = studentProfileService.findByUserId(user.getUserId());
        if (profile == null) {
            Map<String, Object> empty = new HashMap<>();
            empty.put("recalculatedCount", 0);
            empty.put("results", List.of());
            return ResponseEntity.ok(ApiResponse.success("No profile found", empty));
        }
        List<EligibilityEvaluationResultDTO> results = eligibilityService.evaluateAndPersistAll(profile);

        Map<String, Object> data = new HashMap<>();
        data.put("recalculatedCount", results.size());
        data.put("results", results);
        return ResponseEntity.ok(ApiResponse.success("Eligibility recalculation complete", data));
    }
}
