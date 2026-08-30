package com.scholarai.backend.controller;

import com.scholarai.backend.dto.ApiResponse;
import com.scholarai.backend.entity.Scholarship;
import com.scholarai.backend.repository.ScholarshipRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/scholarships")
@PreAuthorize("hasRole('ADMIN')")
public class AdminScholarshipController {

    private final ScholarshipRepository scholarshipRepository;

    public AdminScholarshipController(ScholarshipRepository scholarshipRepository) {
        this.scholarshipRepository = scholarshipRepository;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Scholarship>> createScholarship(@Valid @RequestBody Scholarship scholarship) {
        scholarship.setCreatedAt(OffsetDateTime.now());
        scholarship.setUpdatedAt(OffsetDateTime.now());
        Scholarship saved = scholarshipRepository.save(scholarship);
        return ResponseEntity.ok(ApiResponse.success("Scholarship created successfully", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Scholarship>> updateScholarship(
            @PathVariable String id,
            @RequestBody Scholarship scholarship) {
        scholarship.setId(id);
        scholarship.setUpdatedAt(OffsetDateTime.now());
        Scholarship saved = scholarshipRepository.save(scholarship);
        return ResponseEntity.ok(ApiResponse.success("Scholarship updated successfully", saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, String>>> deleteScholarship(@PathVariable String id) {
        scholarshipRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(Map.of("message", "Scholarship deleted successfully")));
    }

    @PostMapping("/{id}/verify")
    public ResponseEntity<ApiResponse<Scholarship>> verifyScholarship(@PathVariable String id) {
        Scholarship sch = scholarshipRepository.findById(id).orElseThrow();
        sch.setVerificationStatus("VERIFIED");
        sch.setLastVerifiedAt(OffsetDateTime.now());
        Scholarship saved = scholarshipRepository.save(sch);
        return ResponseEntity.ok(ApiResponse.success("Scholarship verified", saved));
    }
}
