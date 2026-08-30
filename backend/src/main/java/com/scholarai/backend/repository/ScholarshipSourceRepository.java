package com.scholarai.backend.repository;

import com.scholarai.backend.entity.ScholarshipSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScholarshipSourceRepository extends JpaRepository<ScholarshipSource, String> {
    List<ScholarshipSource> findByActiveTrue();
    long countByActiveTrue();
}
