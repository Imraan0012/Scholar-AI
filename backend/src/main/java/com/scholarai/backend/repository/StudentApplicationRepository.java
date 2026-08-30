package com.scholarai.backend.repository;

import com.scholarai.backend.entity.StudentApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentApplicationRepository extends JpaRepository<StudentApplication, UUID> {
    List<StudentApplication> findByStudentId(UUID studentId);
    List<StudentApplication> findByStudentIdOrderByAppliedAtDesc(UUID studentId);

    List<StudentApplication> findAllByStudentIdAndScholarshipId(UUID studentId, String scholarshipId);

    default Optional<StudentApplication> findByStudentIdAndScholarshipId(UUID studentId, String scholarshipId) {
        List<StudentApplication> list = findAllByStudentIdAndScholarshipId(studentId, scholarshipId);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    void deleteByStudentIdAndScholarshipId(UUID studentId, String scholarshipId);
    void deleteByStudentId(UUID studentId);
    long countByStudentId(UUID studentId);
}
