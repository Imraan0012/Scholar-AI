package com.scholarai.backend.repository;

import com.scholarai.backend.entity.ScholarshipUpdateReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ScholarshipUpdateReviewRepository extends JpaRepository<ScholarshipUpdateReview, UUID> {
    List<ScholarshipUpdateReview> findByStatus(String status);
    List<ScholarshipUpdateReview> findByScholarshipId(String scholarshipId);
    List<ScholarshipUpdateReview> findByScholarshipIdAndStatus(String scholarshipId, String status);
}
