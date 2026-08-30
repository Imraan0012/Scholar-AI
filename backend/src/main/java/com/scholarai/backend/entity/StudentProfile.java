package com.scholarai.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "student_profiles", uniqueConstraints = {
    @UniqueConstraint(columnNames = "user_id", name = "uk_student_profiles_user_id")
})
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "user_id", unique = true)
    private UUID userId;

    @Column(name = "full_name", length = 200, nullable = false)
    private String fullName = "";

    @Column(name = "email", length = 200, nullable = false)
    private String email = "";

    @Column(name = "phone", length = 30)
    private String phone;

    @Column(name = "date_of_birth", length = 50)
    private String dateOfBirth;

    @Column(name = "nationality", length = 50)
    private String nationality = "INDIAN";

    @Column(name = "gender", length = 30, nullable = false)
    private String gender = "";

    // ── Academic Background ──
    @Column(name = "education_level", length = 50, nullable = false)
    private String educationLevel = "UNDERGRADUATE";

    @Column(name = "course", length = 150, nullable = false)
    private String course = "";

    @Column(name = "branch", length = 150)
    private String branch;

    @Column(name = "current_year", nullable = false)
    private Integer currentYear = 1;

    @Column(name = "admission_year")
    private Integer admissionYear;

    @Column(name = "institution_name", length = 300, nullable = false)
    private String institutionName = "";

    @Column(name = "institution_type", length = 100, nullable = false)
    private String institutionType = "";

    @Column(name = "study_mode", length = 50)
    private String studyMode;

    @Column(name = "class_10_percentage", precision = 5, scale = 2)
    private BigDecimal class10Percentage;

    @Column(name = "class_12_percentage", precision = 5, scale = 2)
    private BigDecimal class12Percentage;

    @Column(name = "undergraduate_cgpa", precision = 4, scale = 2)
    private BigDecimal undergraduateCgpa;

    @Column(name = "postgraduate_cgpa", precision = 4, scale = 2)
    private BigDecimal postgraduateCgpa;

    @Column(name = "current_cgpa", precision = 4, scale = 2)
    private BigDecimal currentCgpa;

    // ── Financial Background ──
    @Column(name = "annual_family_income", precision = 12, scale = 2, nullable = false)
    private BigDecimal annualFamilyIncome;

    @Column(name = "income_source", length = 100)
    private String incomeSource;

    @Column(name = "father_occupation", length = 150)
    private String fatherOccupation;

    @Column(name = "mother_occupation", length = 150)
    private String motherOccupation;

    @Column(name = "family_member_count")
    private Integer familyMemberCount;

    @Column(name = "earning_member_count")
    private Integer earningMemberCount;

    @Column(name = "has_income_certificate")
    private Boolean hasIncomeCertificate = false;

    // ── Category & Domicile ──
    @Column(name = "category", length = 50, nullable = false)
    private String category = "";

    @Column(name = "is_obc_ncl")
    private Boolean isObcNcl = false;

    @Column(name = "is_ews")
    private Boolean isEws = false;

    @Column(name = "has_category_certificate")
    private Boolean hasCategoryCertificate = false;

    @Column(name = "domicile_state", length = 100, nullable = false)
    private String domicileState = "";

    @Column(name = "has_domicile_certificate")
    private Boolean hasDomicileCertificate = false;

    @Column(name = "pincode", length = 20)
    private String pincode;

    // ── Additional Information ──
    @Column(name = "has_disability")
    private Boolean hasDisability = false;

    @Column(name = "disability_percentage", precision = 5, scale = 2)
    private BigDecimal disabilityPercentage = BigDecimal.ZERO;

    @Column(name = "has_udid_card")
    private Boolean hasUdidCard = false;

    @Column(name = "is_farmer_family")
    private Boolean isFarmerFamily = false;

    @Column(name = "is_first_graduate")
    private Boolean isFirstGraduate = false;

    @Column(name = "is_ward_of_defense_or_capf")
    private Boolean isWardOfDefenseOrCapf = false;

    @Column(name = "is_single_parent")
    private Boolean isSingleParent = false;

    @Column(name = "is_orphan")
    private Boolean isOrphan = false;

    @Column(name = "is_single_girl_child")
    private Boolean isSingleGirlChild = false;

    @Column(name = "is_minority")
    private Boolean isMinority = false;

    @Column(name = "minority_community", length = 50)
    private String minorityCommunity;

    @Column(name = "existing_scholarship", length = 200)
    private String existingScholarship;

    @Column(name = "application_type", length = 50)
    private String applicationType;

    @Column(name = "competitive_exam_name", length = 100)
    private String competitiveExamName;

    @Column(name = "competitive_exam_score", precision = 8, scale = 2)
    private BigDecimal competitiveExamScore;

    @Column(name = "competitive_exam_rank")
    private Integer competitiveExamRank;

    // ── Workflow Progression State ──
    @Column(name = "onboarding_step")
    private Integer onboardingStep = 1;

    @Column(name = "onboarding_complete")
    private Boolean onboardingComplete = false;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "completed_steps", columnDefinition = "jsonb")
    private String completedSteps = "[]";

    @Column(name = "profile_completion_score")
    private Integer profileCompletionScore = 0;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    public StudentProfile() {}

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
        if (updatedAt == null) updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getEducationLevel() { return educationLevel; }
    public void setEducationLevel(String educationLevel) { this.educationLevel = educationLevel; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public Integer getCurrentYear() { return currentYear; }
    public void setCurrentYear(Integer currentYear) { this.currentYear = currentYear; }

    public Integer getAdmissionYear() { return admissionYear; }
    public void setAdmissionYear(Integer admissionYear) { this.admissionYear = admissionYear; }

    public String getInstitutionName() { return institutionName; }
    public void setInstitutionName(String institutionName) { this.institutionName = institutionName; }

    public String getInstitutionType() { return institutionType; }
    public void setInstitutionType(String institutionType) { this.institutionType = institutionType; }

    public String getStudyMode() { return studyMode; }
    public void setStudyMode(String studyMode) { this.studyMode = studyMode; }

    public BigDecimal getClass10Percentage() { return class10Percentage; }
    public void setClass10Percentage(BigDecimal class10Percentage) { this.class10Percentage = class10Percentage; }

    public BigDecimal getClass12Percentage() { return class12Percentage; }
    public void setClass12Percentage(BigDecimal class12Percentage) { this.class12Percentage = class12Percentage; }

    public BigDecimal getUndergraduateCgpa() { return undergraduateCgpa; }
    public void setUndergraduateCgpa(BigDecimal undergraduateCgpa) { this.undergraduateCgpa = undergraduateCgpa; }

    public BigDecimal getPostgraduateCgpa() { return postgraduateCgpa; }
    public void setPostgraduateCgpa(BigDecimal postgraduateCgpa) { this.postgraduateCgpa = postgraduateCgpa; }

    public BigDecimal getCurrentCgpa() { return currentCgpa; }
    public void setCurrentCgpa(BigDecimal currentCgpa) { this.currentCgpa = currentCgpa; }

    public BigDecimal getAnnualFamilyIncome() { return annualFamilyIncome; }
    public void setAnnualFamilyIncome(BigDecimal annualFamilyIncome) { this.annualFamilyIncome = annualFamilyIncome; }

    public String getIncomeSource() { return incomeSource; }
    public void setIncomeSource(String incomeSource) { this.incomeSource = incomeSource; }

    public String getFatherOccupation() { return fatherOccupation; }
    public void setFatherOccupation(String fatherOccupation) { this.fatherOccupation = fatherOccupation; }

    public String getMotherOccupation() { return motherOccupation; }
    public void setMotherOccupation(String motherOccupation) { this.motherOccupation = motherOccupation; }

    public Integer getFamilyMemberCount() { return familyMemberCount; }
    public void setFamilyMemberCount(Integer familyMemberCount) { this.familyMemberCount = familyMemberCount; }

    public Integer getEarningMemberCount() { return earningMemberCount; }
    public void setEarningMemberCount(Integer earningMemberCount) { this.earningMemberCount = earningMemberCount; }

    public Boolean getHasIncomeCertificate() { return hasIncomeCertificate; }
    public void setHasIncomeCertificate(Boolean hasIncomeCertificate) { this.hasIncomeCertificate = hasIncomeCertificate; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Boolean getIsObcNcl() { return isObcNcl; }
    public void setIsObcNcl(Boolean obcNcl) { isObcNcl = obcNcl; }

    public Boolean getIsEws() { return isEws; }
    public void setIsEws(Boolean ews) { isEws = ews; }

    public Boolean getHasCategoryCertificate() { return hasCategoryCertificate; }
    public void setHasCategoryCertificate(Boolean hasCategoryCertificate) { this.hasCategoryCertificate = hasCategoryCertificate; }

    public String getDomicileState() { return domicileState; }
    public void setDomicileState(String domicileState) { this.domicileState = domicileState; }

    public Boolean getHasDomicileCertificate() { return hasDomicileCertificate; }
    public void setHasDomicileCertificate(Boolean hasDomicileCertificate) { this.hasDomicileCertificate = hasDomicileCertificate; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public Boolean getHasDisability() { return hasDisability; }
    public void setHasDisability(Boolean hasDisability) { this.hasDisability = hasDisability; }

    public BigDecimal getDisabilityPercentage() { return disabilityPercentage; }
    public void setDisabilityPercentage(BigDecimal disabilityPercentage) { this.disabilityPercentage = disabilityPercentage; }

    public Boolean getHasUdidCard() { return hasUdidCard; }
    public void setHasUdidCard(Boolean hasUdidCard) { this.hasUdidCard = hasUdidCard; }

    public Boolean getIsFarmerFamily() { return isFarmerFamily; }
    public void setIsFarmerFamily(Boolean farmerFamily) { isFarmerFamily = farmerFamily; }

    public Boolean getIsFirstGraduate() { return isFirstGraduate; }
    public void setIsFirstGraduate(Boolean firstGraduate) { isFirstGraduate = firstGraduate; }

    public Boolean getIsWardOfDefenseOrCapf() { return isWardOfDefenseOrCapf; }
    public void setIsWardOfDefenseOrCapf(Boolean wardOfDefenseOrCapf) { isWardOfDefenseOrCapf = wardOfDefenseOrCapf; }

    public Boolean getIsSingleParent() { return isSingleParent; }
    public void setIsSingleParent(Boolean singleParent) { isSingleParent = singleParent; }

    public Boolean getIsOrphan() { return isOrphan; }
    public void setIsOrphan(Boolean orphan) { isOrphan = orphan; }

    public Boolean getIsSingleGirlChild() { return isSingleGirlChild; }
    public void setIsSingleGirlChild(Boolean singleGirlChild) { isSingleGirlChild = singleGirlChild; }

    public Boolean getIsMinority() { return isMinority; }
    public void setIsMinority(Boolean minority) { isMinority = minority; }

    public String getMinorityCommunity() { return minorityCommunity; }
    public void setMinorityCommunity(String minorityCommunity) { this.minorityCommunity = minorityCommunity; }

    public String getExistingScholarship() { return existingScholarship; }
    public void setExistingScholarship(String existingScholarship) { this.existingScholarship = existingScholarship; }

    public String getApplicationType() { return applicationType; }
    public void setApplicationType(String applicationType) { this.applicationType = applicationType; }

    public String getCompetitiveExamName() { return competitiveExamName; }
    public void setCompetitiveExamName(String competitiveExamName) { this.competitiveExamName = competitiveExamName; }

    public BigDecimal getCompetitiveExamScore() { return competitiveExamScore; }
    public void setCompetitiveExamScore(BigDecimal competitiveExamScore) { this.competitiveExamScore = competitiveExamScore; }

    public Integer getCompetitiveExamRank() { return competitiveExamRank; }
    public void setCompetitiveExamRank(Integer competitiveExamRank) { this.competitiveExamRank = competitiveExamRank; }

    public Integer getOnboardingStep() { return onboardingStep; }
    public void setOnboardingStep(Integer onboardingStep) { this.onboardingStep = onboardingStep; }

    public Boolean getOnboardingComplete() { return onboardingComplete; }
    public void setOnboardingComplete(Boolean onboardingComplete) { this.onboardingComplete = onboardingComplete; }

    public String getCompletedSteps() { return completedSteps; }
    public void setCompletedSteps(String completedSteps) { this.completedSteps = completedSteps; }

    public Integer getProfileCompletionScore() { return profileCompletionScore; }
    public void setProfileCompletionScore(Integer profileCompletionScore) { this.profileCompletionScore = profileCompletionScore; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
