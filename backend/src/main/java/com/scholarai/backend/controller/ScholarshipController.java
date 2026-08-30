package com.scholarai.backend.controller;

import com.scholarai.backend.dto.ApiResponse;
import com.scholarai.backend.entity.Scholarship;
import com.scholarai.backend.service.ScholarshipService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/scholarships")
public class ScholarshipController {

    private final ScholarshipService scholarshipService;

    public ScholarshipController(ScholarshipService scholarshipService) {
        this.scholarshipService = scholarshipService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getScholarships(
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "ALL") String sector,
            @RequestParam(required = false, defaultValue = "ALL") String governmentLevel,
            @RequestParam(required = false, defaultValue = "ALL") String state,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(defaultValue = "BEST_MATCH") String sort) {

        String level = !"ALL".equalsIgnoreCase(governmentLevel) ? governmentLevel : sector;
        Page<Scholarship> results = scholarshipService.searchScholarships(search, level, state, page, size, sort);

        Map<String, Object> data = new HashMap<>();
        data.put("scholarships", results.getContent());
        data.put("totalElements", results.getTotalElements());
        data.put("totalPages", results.getTotalPages());
        data.put("currentPage", results.getNumber());
        data.put("pageSize", results.getSize());

        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Scholarship>> getScholarshipById(@PathVariable String id) {
        Scholarship scholarship = scholarshipService.getScholarshipById(id);
        return ResponseEntity.ok(ApiResponse.success(scholarship));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Scholarship>>> search(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(required = false, defaultValue = "") String q) {
        String searchTerm = !q.isBlank() ? q : query;
        Page<Scholarship> results = scholarshipService.searchScholarships(searchTerm, "ALL", "ALL", 0, 50, "BEST_MATCH");
        return ResponseEntity.ok(ApiResponse.success(results.getContent()));
    }

    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCount() {
        long count = scholarshipService.getCount();
        Map<String, Object> data = new HashMap<>();
        data.put("count", count);
        return ResponseEntity.ok(ApiResponse.success(data));
    }
}
