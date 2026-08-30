package com.scholarai.backend.service;

import com.scholarai.backend.entity.StudentApplication;
import com.scholarai.backend.repository.StudentApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ApplicationService {

    private final StudentApplicationRepository applicationRepository;

    public ApplicationService(StudentApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public List<StudentApplication> getUserApplications(UUID userId) {
        return applicationRepository.findByStudentIdOrderByAppliedAtDesc(userId);
    }

    @Transactional
    public StudentApplication recordApplication(UUID userId, String scholarshipId, String status) {
        StudentApplication app = applicationRepository.findByStudentIdAndScholarshipId(userId, scholarshipId)
                .orElse(new StudentApplication(userId, scholarshipId, status != null ? status : "APPLY_CLICKED"));

        if (status != null) {
            app.setStatus(status);
        }
        app.setUpdatedAt(OffsetDateTime.now());
        return applicationRepository.save(app);
    }

    @Transactional
    public StudentApplication updateStatus(UUID userId, String scholarshipId, String status) {
        StudentApplication app = applicationRepository.findByStudentIdAndScholarshipId(userId, scholarshipId)
                .orElse(new StudentApplication(userId, scholarshipId, status));

        app.setStatus(status);
        app.setUpdatedAt(OffsetDateTime.now());
        return applicationRepository.save(app);
    }

    @Transactional
    public void deleteApplication(UUID userId, String scholarshipId) {
        applicationRepository.deleteByStudentIdAndScholarshipId(userId, scholarshipId);
    }

    @Transactional
    public void clearAllApplications(UUID userId) {
        applicationRepository.deleteByStudentId(userId);
    }

    public long getCount(UUID userId) {
        return applicationRepository.countByStudentId(userId);
    }
}
