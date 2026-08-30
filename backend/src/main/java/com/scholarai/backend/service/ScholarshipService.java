package com.scholarai.backend.service;

import com.scholarai.backend.entity.Scholarship;
import com.scholarai.backend.exception.ResourceNotFoundException;
import com.scholarai.backend.repository.ScholarshipRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ScholarshipService {

    private final ScholarshipRepository scholarshipRepository;

    public ScholarshipService(ScholarshipRepository scholarshipRepository) {
        this.scholarshipRepository = scholarshipRepository;
    }

    public Page<Scholarship> searchScholarships(String search, String governmentLevel, String state, int page, int size, String sortBy) {
        Sort sort = Sort.by(Sort.Direction.DESC, "amountMax");
        if ("DEADLINE".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "academicYear");
        } else if ("NEWEST".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "createdAt");
        }

        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, Math.min(100, size)), sort);

        Specification<Scholarship> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("name")), pattern);
                Predicate providerMatch = cb.like(cb.lower(root.get("provider")), pattern);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), pattern);
                predicates.add(cb.or(nameMatch, providerMatch, descMatch));
            }

            if (governmentLevel != null && !"ALL".equalsIgnoreCase(governmentLevel)) {
                predicates.add(cb.equal(root.get("governmentLevel"), governmentLevel));
            }

            if (state != null && !"ALL".equalsIgnoreCase(state) && !"ALL_INDIA".equalsIgnoreCase(state)) {
                Predicate allIndia = cb.equal(root.get("state"), "ALL_INDIA");
                Predicate stateMatch = cb.like(cb.lower(root.get("state")), "%" + state.trim().toLowerCase() + "%");
                predicates.add(cb.or(allIndia, stateMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return scholarshipRepository.findAll(spec, pageable);
    }

    public List<Scholarship> getAllScholarships() {
        return scholarshipRepository.findAll();
    }

    public Scholarship getScholarshipById(String id) {
        return scholarshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scholarship not found with id: " + id));
    }

    public long getCount() {
        return scholarshipRepository.count();
    }
}
