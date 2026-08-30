package com.scholarai.backend.service;

import com.scholarai.backend.entity.ScholarshipSource;
import com.scholarai.backend.exception.ResourceNotFoundException;
import com.scholarai.backend.repository.ScholarshipSourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SourceService {

    private final ScholarshipSourceRepository sourceRepository;

    public SourceService(ScholarshipSourceRepository sourceRepository) {
        this.sourceRepository = sourceRepository;
    }

    public List<ScholarshipSource> getAllSources() {
        return sourceRepository.findAll();
    }

    public ScholarshipSource getSourceById(String id) {
        return sourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Source not found with id: " + id));
    }

    public long getCount() {
        return sourceRepository.count();
    }
}
