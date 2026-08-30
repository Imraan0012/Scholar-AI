package com.scholarai.backend.service;

import com.scholarai.backend.dto.DashboardSummaryDTO;
import com.scholarai.backend.dto.EligibilityEvaluationResultDTO;
import com.scholarai.backend.entity.StudentProfile;
import com.scholarai.backend.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DashboardService {

    private final ScholarshipRepository scholarshipRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final EligibilityResultRepository eligibilityResultRepository;
    private final BookmarkRepository bookmarkRepository;
    private final StudentApplicationRepository applicationRepository;
    private final NotificationRepository notificationRepository;
    private final EligibilityService eligibilityService;

    public DashboardService(ScholarshipRepository scholarshipRepository,
                            StudentProfileRepository studentProfileRepository,
                            EligibilityResultRepository eligibilityResultRepository,
                            BookmarkRepository bookmarkRepository,
                            StudentApplicationRepository applicationRepository,
                            NotificationRepository notificationRepository,
                            EligibilityService eligibilityService) {
        this.scholarshipRepository = scholarshipRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.eligibilityResultRepository = eligibilityResultRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.applicationRepository = applicationRepository;
        this.notificationRepository = notificationRepository;
        this.eligibilityService = eligibilityService;
    }

    public DashboardSummaryDTO getSummary(UUID userId) {
        long totalScholarships = scholarshipRepository.count();
        long unreadNotifications = notificationRepository.countByUserIdAndReadFalse(userId);
        long savedCount = bookmarkRepository.countByUserId(userId);
        long applicationsCount = applicationRepository.countByStudentId(userId);

        StudentProfile profile = studentProfileRepository.findByUserId(userId).orElse(null);

        long eligibleCount = 0;
        long possibleCount = 0;
        long notEligibleCount = 0;
        int completion = 0;

        if (profile != null) {
            completion = profile.getProfileCompletionScore() != null ? profile.getProfileCompletionScore() : 0;

            long cachedTotal = eligibilityResultRepository.countByStudentId(profile.getId());
            if (cachedTotal > 0) {
                eligibleCount = eligibilityResultRepository.countByStudentIdAndEvaluationStatus(profile.getId(), "ELIGIBLE");
                possibleCount = eligibilityResultRepository.countByStudentIdAndEvaluationStatus(profile.getId(), "POSSIBLE_MATCH");
                notEligibleCount = eligibilityResultRepository.countByStudentIdAndEvaluationStatus(profile.getId(), "NOT_ELIGIBLE");
            } else {
                List<EligibilityEvaluationResultDTO> results = eligibilityService.evaluateAndPersistAll(profile);
                eligibleCount = results.stream().filter(r -> "ELIGIBLE".equals(r.getEvaluationStatus())).count();
                possibleCount = results.stream().filter(r -> "POSSIBLE_MATCH".equals(r.getEvaluationStatus())).count();
                notEligibleCount = results.stream().filter(r -> "NOT_ELIGIBLE".equals(r.getEvaluationStatus())).count();
            }
        }

        return new DashboardSummaryDTO(
                eligibleCount,
                possibleCount,
                notEligibleCount,
                totalScholarships,
                completion,
                unreadNotifications,
                savedCount,
                applicationsCount
        );
    }
}
