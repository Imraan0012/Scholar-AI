package com.scholarai.backend.repository;

import com.scholarai.backend.entity.ScholarshipRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ScholarshipRuleRepository extends JpaRepository<ScholarshipRule, UUID> {
    List<ScholarshipRule> findByScholarshipId(String scholarshipId);
}
