package com.scholarai.backend.service;

import com.scholarai.backend.dto.StudentProfileDTO;
import com.scholarai.backend.entity.StudentProfile;
import com.scholarai.backend.repository.StudentProfileRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class StudentProfileService {

    private final StudentProfileRepository studentProfileRepository;
    private final EligibilityService eligibilityService;

    public StudentProfileService(StudentProfileRepository studentProfileRepository,
                                 EligibilityService eligibilityService) {
        this.studentProfileRepository = studentProfileRepository;
        this.eligibilityService = eligibilityService;
    }

    public StudentProfile findByUserId(UUID userId) {
        return studentProfileRepository.findByUserId(userId)
                .orElse(null);
    }

    public StudentProfile getOrCreateProfile(UUID userId, String email) {
        return studentProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    StudentProfile newProfile = new StudentProfile();
                    newProfile.setUserId(userId);
                    newProfile.setEmail(email != null ? email : "");
                    newProfile.setFullName("");
                    newProfile.setOnboardingStep(1);
                    newProfile.setOnboardingComplete(false);
                    newProfile.setProfileCompletionScore(0);
                    return studentProfileRepository.save(newProfile);
                });
    }

    @Transactional
    public StudentProfileDTO saveOrUpdateProfile(UUID userId, StudentProfileDTO dto) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElse(new StudentProfile());

        profile.setUserId(userId);

        // Step 1: Personal Details
        if (dto.getFullName() != null) profile.setFullName(dto.getFullName());
        if (dto.getEmail() != null) profile.setEmail(dto.getEmail());
        if (dto.getPhone() != null) profile.setPhone(dto.getPhone());
        else if (dto.getMobile() != null) profile.setPhone(dto.getMobile());
        if (dto.getDateOfBirth() != null) profile.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getNationality() != null) profile.setNationality(dto.getNationality());
        if (dto.getGender() != null) profile.setGender(dto.getGender());

        // Step 2: Academic Background
        if (dto.getEducationLevel() != null) profile.setEducationLevel(dto.getEducationLevel());
        if (dto.getCourse() != null) profile.setCourse(dto.getCourse());
        if (dto.getBranch() != null) profile.setBranch(dto.getBranch());
        else if (dto.getSpecialization() != null) profile.setBranch(dto.getSpecialization());
        if (dto.getCurrentYear() != null) profile.setCurrentYear(dto.getCurrentYear());
        if (dto.getAdmissionYear() != null) profile.setAdmissionYear(dto.getAdmissionYear());
        if (dto.getInstitutionName() != null) profile.setInstitutionName(dto.getInstitutionName());
        if (dto.getInstitutionType() != null) profile.setInstitutionType(dto.getInstitutionType());
        if (dto.getStudyMode() != null) profile.setStudyMode(dto.getStudyMode());
        if (dto.getClass10Percentage() != null) profile.setClass10Percentage(dto.getClass10Percentage());
        if (dto.getClass12Percentage() != null) profile.setClass12Percentage(dto.getClass12Percentage());

        if (dto.getCurrentCgpa() != null) profile.setCurrentCgpa(dto.getCurrentCgpa());
        else if (dto.getUndergraduateCgpa() != null) profile.setCurrentCgpa(dto.getUndergraduateCgpa());
        else if (dto.getCgpa() != null) profile.setCurrentCgpa(dto.getCgpa());

        if (dto.getUndergraduateCgpa() != null) profile.setUndergraduateCgpa(dto.getUndergraduateCgpa());
        if (dto.getPostgraduateCgpa() != null) profile.setPostgraduateCgpa(dto.getPostgraduateCgpa());

        // Step 3: Financial Details
        if (dto.getAnnualFamilyIncome() != null) profile.setAnnualFamilyIncome(dto.getAnnualFamilyIncome());
        else if (dto.getAnnualIncome() != null) profile.setAnnualFamilyIncome(dto.getAnnualIncome());

        if (dto.getIncomeSource() != null) profile.setIncomeSource(dto.getIncomeSource());
        if (dto.getFatherOccupation() != null) profile.setFatherOccupation(dto.getFatherOccupation());
        if (dto.getMotherOccupation() != null) profile.setMotherOccupation(dto.getMotherOccupation());
        if (dto.getFamilyMemberCount() != null) profile.setFamilyMemberCount(dto.getFamilyMemberCount());
        else if (dto.getFamilyMembersCount() != null) profile.setFamilyMemberCount(dto.getFamilyMembersCount());
        if (dto.getEarningMemberCount() != null) profile.setEarningMemberCount(dto.getEarningMemberCount());
        else if (dto.getEarningMembersCount() != null) profile.setEarningMemberCount(dto.getEarningMembersCount());
        if (dto.getHasIncomeCertificate() != null) profile.setHasIncomeCertificate(dto.getHasIncomeCertificate());

        // Step 4: Category & Domicile
        if (dto.getCategory() != null) profile.setCategory(dto.getCategory());
        else if (dto.getSocialCategory() != null) profile.setCategory(dto.getSocialCategory());

        if (dto.getIsObcNcl() != null) profile.setIsObcNcl(dto.getIsObcNcl());
        if (dto.getIsEws() != null) profile.setIsEws(dto.getIsEws());
        if (dto.getHasCategoryCertificate() != null) profile.setHasCategoryCertificate(dto.getHasCategoryCertificate());
        else if (dto.getHasCasteCertificate() != null) profile.setHasCategoryCertificate(dto.getHasCasteCertificate());

        if (dto.getDomicileState() != null) profile.setDomicileState(dto.getDomicileState());
        if (dto.getHasDomicileCertificate() != null) profile.setHasDomicileCertificate(dto.getHasDomicileCertificate());
        if (dto.getPincode() != null) profile.setPincode(dto.getPincode());
        else if (dto.getCurrentPincode() != null) profile.setPincode(dto.getCurrentPincode());

        // Step 5: Additional Information
        if (dto.getHasDisability() != null) profile.setHasDisability(dto.getHasDisability());
        else if (dto.getIsPwd() != null) profile.setHasDisability(dto.getIsPwd());
        if (dto.getDisabilityPercentage() != null) profile.setDisabilityPercentage(dto.getDisabilityPercentage());
        if (dto.getHasUdidCard() != null) profile.setHasUdidCard(dto.getHasUdidCard());

        if (dto.getIsFarmerFamily() != null) profile.setIsFarmerFamily(dto.getIsFarmerFamily());
        else if (dto.getFarmerFamily() != null) profile.setIsFarmerFamily(dto.getFarmerFamily());

        if (dto.getIsFirstGraduate() != null) profile.setIsFirstGraduate(dto.getIsFirstGraduate());
        else if (dto.getIsFirstGenLearner() != null) profile.setIsFirstGraduate(dto.getIsFirstGenLearner());

        if (dto.getIsWardOfDefenseOrCapf() != null) profile.setIsWardOfDefenseOrCapf(dto.getIsWardOfDefenseOrCapf());
        else if (dto.getIsExServicemanWard() != null) profile.setIsWardOfDefenseOrCapf(dto.getIsExServicemanWard());
        else if (dto.getArmedForcesChild() != null) profile.setIsWardOfDefenseOrCapf(dto.getArmedForcesChild());

        if (dto.getIsSingleParent() != null) profile.setIsSingleParent(dto.getIsSingleParent());
        else if (dto.getIsSingleParentHousehold() != null) profile.setIsSingleParent(dto.getIsSingleParentHousehold());

        if (dto.getIsOrphan() != null) profile.setIsOrphan(dto.getIsOrphan());
        if (dto.getIsSingleGirlChild() != null) profile.setIsSingleGirlChild(dto.getIsSingleGirlChild());

        if (dto.getIsMinority() != null) profile.setIsMinority(dto.getIsMinority());
        if (dto.getMinorityCommunity() != null) profile.setMinorityCommunity(dto.getMinorityCommunity());

        if (dto.getExistingScholarship() != null) profile.setExistingScholarship(dto.getExistingScholarship());
        if (dto.getApplicationType() != null) profile.setApplicationType(dto.getApplicationType());

        // Workflow Progress
        if (dto.getOnboardingStep() != null) {
            profile.setOnboardingStep(dto.getOnboardingStep());
        }
        if (dto.getOnboardingComplete() != null) {
            profile.setOnboardingComplete(dto.getOnboardingComplete());
        }

        int completion = calculateCompletion(profile);
        profile.setProfileCompletionScore(completion);

        StudentProfile saved = studentProfileRepository.save(profile);

        // Recalculate and persist eligibility results for current user
        eligibilityService.evaluateAndPersistAll(saved);

        return toDTO(saved);
    }

    public int calculateCompletion(StudentProfile p) {
        if (p == null) return 0;
        int score = 0;
        // Step 1: Personal (20%)
        if (p.getFullName() != null && !p.getFullName().trim().isEmpty()) score += 5;
        if (p.getEmail() != null && !p.getEmail().trim().isEmpty()) score += 5;
        if (p.getPhone() != null && !p.getPhone().trim().isEmpty()) score += 5;
        if (p.getGender() != null && !p.getGender().trim().isEmpty()) score += 5;

        // Step 2: Academic (25%)
        if (p.getEducationLevel() != null && !p.getEducationLevel().trim().isEmpty()) score += 10;
        if (p.getCourse() != null && !p.getCourse().trim().isEmpty()) score += 5;
        if (p.getInstitutionName() != null && !p.getInstitutionName().trim().isEmpty()) score += 5;
        if (p.getClass12Percentage() != null || p.getCurrentCgpa() != null || p.getUndergraduateCgpa() != null) score += 5;

        // Step 3: Financial (20%)
        if (p.getAnnualFamilyIncome() != null) score += 15;
        if (p.getIncomeSource() != null) score += 5;

        // Step 4: Category & Domicile (20%)
        if (p.getCategory() != null && !p.getCategory().trim().isEmpty()) score += 10;
        if (p.getDomicileState() != null && !p.getDomicileState().trim().isEmpty()) score += 10;

        // Step 5: Additional (15%)
        score += 15;

        return Math.min(100, score);
    }

    public StudentProfileDTO toDTO(StudentProfile entity) {
        if (entity == null) return null;
        StudentProfileDTO dto = new StudentProfileDTO();
        BeanUtils.copyProperties(entity, dto);
        dto.setProfileCompletion(entity.getProfileCompletionScore());
        dto.setProfileCompletionScore(entity.getProfileCompletionScore());
        dto.setAnnualIncome(entity.getAnnualFamilyIncome());
        dto.setMobile(entity.getPhone());
        dto.setCgpa(entity.getCurrentCgpa() != null ? entity.getCurrentCgpa() : entity.getUndergraduateCgpa());
        dto.setOnboardingStep(entity.getOnboardingStep() != null ? entity.getOnboardingStep() : 1);
        dto.setOnboardingComplete(Boolean.TRUE.equals(entity.getOnboardingComplete()));
        return dto;
    }
}
