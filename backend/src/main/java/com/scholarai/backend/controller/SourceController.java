package com.scholarai.backend.controller;

import com.scholarai.backend.dto.ApiResponse;
import com.scholarai.backend.entity.ScholarshipSource;
import com.scholarai.backend.service.SourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sources")
public class SourceController {

    private final SourceService sourceService;

    public SourceController(SourceService sourceService) {
        this.sourceService = sourceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ScholarshipSource>>> getAllSources() {
        List<ScholarshipSource> sources = sourceService.getAllSources();
        return ResponseEntity.ok(ApiResponse.success(sources));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ScholarshipSource>> getSourceById(@PathVariable String id) {
        ScholarshipSource source = sourceService.getSourceById(id);
        return ResponseEntity.ok(ApiResponse.success(source));
    }

    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getCount() {
        long count = sourceService.getCount();
        return ResponseEntity.ok(ApiResponse.success(Map.of("count", count)));
    }
}
