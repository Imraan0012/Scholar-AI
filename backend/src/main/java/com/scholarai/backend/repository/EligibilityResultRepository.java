package com.scholarai.backend.repository;

import com.scholarai.backend.entity.EligibilityResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EligibilityResultRepository extends JpaRepository<EligibilityResult, UUID> {
    List<EligibilityResult> findByStudentId(UUID studentId);

    List<EligibilityResult> findAllByStudentIdAndScholarshipId(UUID studentId, String scholarshipId);

    default Optional<EligibilityResult> findByStudentIdAndScholarshipId(UUID studentId, String scholarshipId) {
        List<EligibilityResult> list = findAllByStudentIdAndScholarshipId(studentId, scholarshipId);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    void deleteByStudentId(UUID studentId);
    long countByStudentIdAndEvaluationStatus(UUID studentId, String evaluationStatus);
    long countByStudentId(UUID studentId);
}
