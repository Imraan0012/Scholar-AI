package com.scholarai.backend.dto;

import java.math.BigDecimal;
import java.util.UUID;

public class StudentProfileDTO {

    private UUID id;
    private UUID userId;

    // Step 1: Personal Details
    private String fullName;
    private String email;
    private String phone;
    private String mobile;
    private String dateOfBirth;
    private String dob;
    private String nationality = "INDIAN";
    private String gender = "ANY";

    // Step 2: Academic Background
    private String educationLevel;
    private String course;
    private String branch;
    private String specialization;
    private String studyMode;
    private String courseType;

    private Integer currentYear;
    private Integer currentSemester;
    private Integer admissionYear;
    private Integer intendedAdmissionYear;
    private Integer expectedGraduationYear;

    private String institutionName;
    private String universityName;
    private String institutionType;
    private String institutionState;
    private String institutionDistrict;
    private Boolean isHosteller = false;

    private String class10Board;
    private Integer class10PassingYear;
    private BigDecimal class10Percentage;
    private String class10School;

    private String class12Board;
    private String class12Stream;
    private Integer class12PassingYear;
    private BigDecimal class12Percentage;
    private String class12School;

    private String diplomaCourse;
    private BigDecimal diplomaScore;
    private Boolean hasDiploma = false;

    private String undergraduateDegree;
    private BigDecimal undergraduateCgpa;

    private String pgCourse;
    private BigDecimal pgCgpa;
    private BigDecimal postgraduateCgpa;

    private BigDecimal currentCgpa;
    private BigDecimal cgpa;
    private Boolean hasBacklogs = false;

    // Step 3: Financial Background
    private BigDecimal annualFamilyIncome;
    private BigDecimal annualIncome;
    private String incomeSource;
    private String fatherOccupation;
    private String motherOccupation;
    private Integer familyMemberCount;
    private Integer familyMembersCount;
    private Integer earningMemberCount;
    private Integer earningMembersCount;
    private Integer dependentSiblingsCount;

    private Boolean hasIncomeCertificate = false;
    private String incomeCertificateStatus;
    private String incomeCertIssuedBy;
    private String incomeCertIssueDate;

    // Step 4: Category & Domicile
    private String category;
    private String socialCategory;
    private Boolean isObcNcl = false;
    private String obcNclStatus;
    private String obcCertStatus;
    private Boolean isEws = false;
    private String ewsCertStatus;

    private Boolean hasCategoryCertificate = false;
    private Boolean hasCasteCertificate = false;
    private String categoryCertStatus;
    private String casteCertStatus;

    private String domicileState;
    private String domicileDistrict;
    private Boolean hasDomicileCertificate = false;
    private String domicileCertStatus;

    private String pincode;
    private String currentPincode;
    private String currentResidenceState;
    private String currentResidenceDistrict;

    // Step 5: Additional Details
    private Boolean hasDisability = false;
    private Boolean isPwd = false;
    private BigDecimal disabilityPercentage = BigDecimal.ZERO;
    private String disabilityCertStatus;
    private Boolean hasUdidCard = false;

    private Boolean isFarmerFamily = false;
    private Boolean farmerFamily = false;

    private Boolean isFirstGraduate = false;
    private Boolean isFirstGenLearner = false;

    private Boolean isWardOfDefenseOrCapf = false;
    private Boolean isExServicemanWard = false;
    private Boolean armedForcesChild = false;
    private String exServicemanServiceStatus;
    private String exServicemanDocStatus;

    private Boolean isSingleParent = false;
    private Boolean isSingleParentHousehold = false;

    private Boolean isOrphan = false;
    private String orphanDocStatus;

    private Boolean isSingleGirlChild = false;
    private String singleGirlChildProofStatus;

    private Boolean isMinority = false;
    private String minorityCommunity;
    private String minorityDocStatus;

    private String existingScholarship;
    private Boolean isCurrentlyReceivingScholarship = false;
    private String currentScholarshipName;
    private String currentScholarshipProvider;
    private Boolean previouslyReceivedScholarship = false;

    private String applicationType = "FRESH";

    private String competitiveExamName;
    private BigDecimal competitiveExamScore;
    private Integer competitiveExamRank;

    // Workflow state
    private Integer onboardingStep = 1;
    private Boolean onboardingComplete = false;
    private Integer profileCompletionScore = 0;
    private Integer profileCompletion = 0;

    private Object preferences;

    public StudentProfileDTO() {}

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone != null ? phone : mobile; }
    public void setPhone(String phone) { this.phone = phone; this.mobile = phone; }

    public String getMobile() { return mobile != null ? mobile : phone; }
    public void setMobile(String mobile) { this.mobile = mobile; this.phone = mobile; }

    public String getDateOfBirth() { return dateOfBirth != null ? dateOfBirth : dob; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; this.dob = dateOfBirth; }

    public String getDob() { return dob != null ? dob : dateOfBirth; }
    public void setDob(String dob) { this.dob = dob; this.dateOfBirth = dob; }

    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getEducationLevel() { return educationLevel; }
    public void setEducationLevel(String educationLevel) { this.educationLevel = educationLevel; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getBranch() { return branch != null ? branch : specialization; }
    public void setBranch(String branch) { this.branch = branch; this.specialization = branch; }

    public String getSpecialization() { return specialization != null ? specialization : branch; }
    public void setSpecialization(String specialization) { this.specialization = specialization; this.branch = specialization; }

    public String getStudyMode() { return studyMode; }
    public void setStudyMode(String studyMode) { this.studyMode = studyMode; }

    public String getCourseType() { return courseType; }
    public void setCourseType(String courseType) { this.courseType = courseType; }

    public Integer getCurrentYear() { return currentYear; }
    public void setCurrentYear(Integer currentYear) { this.currentYear = currentYear; }

    public Integer getCurrentSemester() { return currentSemester; }
    public void setCurrentSemester(Integer currentSemester) { this.currentSemester = currentSemester; }

    public Integer getAdmissionYear() { return admissionYear; }
    public void setAdmissionYear(Integer admissionYear) { this.admissionYear = admissionYear; }

    public Integer getIntendedAdmissionYear() { return intendedAdmissionYear; }
    public void setIntendedAdmissionYear(Integer intendedAdmissionYear) { this.intendedAdmissionYear = intendedAdmissionYear; }

    public Integer getExpectedGraduationYear() { return expectedGraduationYear; }
    public void setExpectedGraduationYear(Integer expectedGraduationYear) { this.expectedGraduationYear = expectedGraduationYear; }

    public String getInstitutionName() { return institutionName; }
    public void setInstitutionName(String institutionName) { this.institutionName = institutionName; }

    public String getUniversityName() { return universityName; }
    public void setUniversityName(String universityName) { this.universityName = universityName; }

    public String getInstitutionType() { return institutionType; }
    public void setInstitutionType(String institutionType) { this.institutionType = institutionType; }

    public String getInstitutionState() { return institutionState; }
    public void setInstitutionState(String institutionState) { this.institutionState = institutionState; }

    public String getInstitutionDistrict() { return institutionDistrict; }
    public void setInstitutionDistrict(String institutionDistrict) { this.institutionDistrict = institutionDistrict; }

    public Boolean getIsHosteller() { return isHosteller; }
    public void setIsHosteller(Boolean hosteller) { isHosteller = hosteller; }

    public String getClass10Board() { return class10Board; }
    public void setClass10Board(String class10Board) { this.class10Board = class10Board; }

    public Integer getClass10PassingYear() { return class10PassingYear; }
    public void setClass10PassingYear(Integer class10PassingYear) { this.class10PassingYear = class10PassingYear; }

    public BigDecimal getClass10Percentage() { return class10Percentage; }
    public void setClass10Percentage(BigDecimal class10Percentage) { this.class10Percentage = class10Percentage; }

    public String getClass10School() { return class10School; }
    public void setClass10School(String class10School) { this.class10School = class10School; }

    public String getClass12Board() { return class12Board; }
    public void setClass12Board(String class12Board) { this.class12Board = class12Board; }

    public String getClass12Stream() { return class12Stream; }
    public void setClass12Stream(String class12Stream) { this.class12Stream = class12Stream; }

    public Integer getClass12PassingYear() { return class12PassingYear; }
    public void setClass12PassingYear(Integer class12PassingYear) { this.class12PassingYear = class12PassingYear; }

    public BigDecimal getClass12Percentage() { return class12Percentage; }
    public void setClass12Percentage(BigDecimal class12Percentage) { this.class12Percentage = class12Percentage; }

    public String getClass12School() { return class12School; }
    public void setClass12School(String class12School) { this.class12School = class12School; }

    public String getDiplomaCourse() { return diplomaCourse; }
    public void setDiplomaCourse(String diplomaCourse) { this.diplomaCourse = diplomaCourse; }

    public BigDecimal getDiplomaScore() { return diplomaScore; }
    public void setDiplomaScore(BigDecimal diplomaScore) { this.diplomaScore = diplomaScore; }

    public Boolean getHasDiploma() { return hasDiploma; }
    public void setHasDiploma(Boolean hasDiploma) { this.hasDiploma = hasDiploma; }

    public String getUndergraduateDegree() { return undergraduateDegree; }
    public void setUndergraduateDegree(String undergraduateDegree) { this.undergraduateDegree = undergraduateDegree; }

    public BigDecimal getUndergraduateCgpa() { return undergraduateCgpa; }
    public void setUndergraduateCgpa(BigDecimal undergraduateCgpa) { this.undergraduateCgpa = undergraduateCgpa; }

    public String getPgCourse() { return pgCourse; }
    public void setPgCourse(String pgCourse) { this.pgCourse = pgCourse; }

    public BigDecimal getPgCgpa() { return pgCgpa; }
    public void setPgCgpa(BigDecimal pgCgpa) { this.pgCgpa = pgCgpa; }

    public BigDecimal getPostgraduateCgpa() { return postgraduateCgpa != null ? postgraduateCgpa : pgCgpa; }
    public void setPostgraduateCgpa(BigDecimal postgraduateCgpa) { this.postgraduateCgpa = postgraduateCgpa; }

    public BigDecimal getCurrentCgpa() { return currentCgpa != null ? currentCgpa : (undergraduateCgpa != null ? undergraduateCgpa : cgpa); }
    public void setCurrentCgpa(BigDecimal currentCgpa) { this.currentCgpa = currentCgpa; this.cgpa = currentCgpa; }

    public BigDecimal getCgpa() { return cgpa != null ? cgpa : (currentCgpa != null ? currentCgpa : undergraduateCgpa); }
    public void setCgpa(BigDecimal cgpa) { this.cgpa = cgpa; this.currentCgpa = cgpa; }

    public Boolean getHasBacklogs() { return hasBacklogs; }
    public void setHasBacklogs(Boolean hasBacklogs) { this.hasBacklogs = hasBacklogs; }

    public BigDecimal getAnnualFamilyIncome() { return annualFamilyIncome != null ? annualFamilyIncome : annualIncome; }
    public void setAnnualFamilyIncome(BigDecimal annualFamilyIncome) { this.annualFamilyIncome = annualFamilyIncome; this.annualIncome = annualFamilyIncome; }

    public BigDecimal getAnnualIncome() { return annualIncome != null ? annualIncome : annualFamilyIncome; }
    public void setAnnualIncome(BigDecimal annualIncome) { this.annualIncome = annualIncome; this.annualFamilyIncome = annualIncome; }

    public String getIncomeSource() { return incomeSource; }
    public void setIncomeSource(String incomeSource) { this.incomeSource = incomeSource; }

    public String getFatherOccupation() { return fatherOccupation; }
    public void setFatherOccupation(String fatherOccupation) { this.fatherOccupation = fatherOccupation; }

    public String getMotherOccupation() { return motherOccupation; }
    public void setMotherOccupation(String motherOccupation) { this.motherOccupation = motherOccupation; }

    public Integer getFamilyMemberCount() { return familyMemberCount != null ? familyMemberCount : familyMembersCount; }
    public void setFamilyMemberCount(Integer familyMemberCount) { this.familyMemberCount = familyMemberCount; this.familyMembersCount = familyMemberCount; }

    public Integer getFamilyMembersCount() { return familyMembersCount != null ? familyMembersCount : familyMemberCount; }
    public void setFamilyMembersCount(Integer familyMembersCount) { this.familyMembersCount = familyMembersCount; this.familyMemberCount = familyMembersCount; }

    public Integer getEarningMemberCount() { return earningMemberCount != null ? earningMemberCount : earningMembersCount; }
    public void setEarningMemberCount(Integer earningMemberCount) { this.earningMemberCount = earningMemberCount; this.earningMembersCount = earningMemberCount; }

    public Integer getEarningMembersCount() { return earningMembersCount != null ? earningMembersCount : earningMemberCount; }
    public void setEarningMembersCount(Integer earningMembersCount) { this.earningMembersCount = earningMembersCount; this.earningMemberCount = earningMembersCount; }

    public Integer getDependentSiblingsCount() { return dependentSiblingsCount; }
    public void setDependentSiblingsCount(Integer dependentSiblingsCount) { this.dependentSiblingsCount = dependentSiblingsCount; }

    public Boolean getHasIncomeCertificate() { return hasIncomeCertificate; }
    public void setHasIncomeCertificate(Boolean hasIncomeCertificate) { this.hasIncomeCertificate = hasIncomeCertificate; }

    public String getIncomeCertificateStatus() { return incomeCertificateStatus; }
    public void setIncomeCertificateStatus(String incomeCertificateStatus) { this.incomeCertificateStatus = incomeCertificateStatus; }

    public String getIncomeCertIssuedBy() { return incomeCertIssuedBy; }
    public void setIncomeCertIssuedBy(String incomeCertIssuedBy) { this.incomeCertIssuedBy = incomeCertIssuedBy; }

    public String getIncomeCertIssueDate() { return incomeCertIssueDate; }
    public void setIncomeCertIssueDate(String incomeCertIssueDate) { this.incomeCertIssueDate = incomeCertIssueDate; }

    public String getCategory() { return category != null ? category : socialCategory; }
    public void setCategory(String category) { this.category = category; this.socialCategory = category; }

    public String getSocialCategory() { return socialCategory != null ? socialCategory : category; }
    public void setSocialCategory(String socialCategory) { this.socialCategory = socialCategory; this.category = socialCategory; }

    public Boolean getIsObcNcl() { return isObcNcl; }
    public void setIsObcNcl(Boolean obcNcl) { isObcNcl = obcNcl; }

    public String getObcNclStatus() { return obcNclStatus; }
    public void setObcNclStatus(String obcNclStatus) { this.obcNclStatus = obcNclStatus; }

    public String getObcCertStatus() { return obcCertStatus; }
    public void setObcCertStatus(String obcCertStatus) { this.obcCertStatus = obcCertStatus; }

    public Boolean getIsEws() { return isEws; }
    public void setIsEws(Boolean ews) { isEws = ews; }

    public String getEwsCertStatus() { return ewsCertStatus; }
    public void setEwsCertStatus(String ewsCertStatus) { this.ewsCertStatus = ewsCertStatus; }

    public Boolean getHasCategoryCertificate() { return hasCategoryCertificate != null ? hasCategoryCertificate : hasCasteCertificate; }
    public void setHasCategoryCertificate(Boolean hasCategoryCertificate) { this.hasCategoryCertificate = hasCategoryCertificate; this.hasCasteCertificate = hasCategoryCertificate; }

    public Boolean getHasCasteCertificate() { return hasCasteCertificate != null ? hasCasteCertificate : hasCategoryCertificate; }
    public void setHasCasteCertificate(Boolean hasCasteCertificate) { this.hasCasteCertificate = hasCasteCertificate; this.hasCategoryCertificate = hasCasteCertificate; }

    public String getCategoryCertStatus() { return categoryCertStatus; }
    public void setCategoryCertStatus(String categoryCertStatus) { this.categoryCertStatus = categoryCertStatus; }

    public String getCasteCertStatus() { return casteCertStatus; }
    public void setCasteCertStatus(String casteCertStatus) { this.casteCertStatus = casteCertStatus; }

    public String getDomicileState() { return domicileState; }
    public void setDomicileState(String domicileState) { this.domicileState = domicileState; }

    public String getDomicileDistrict() { return domicileDistrict; }
    public void setDomicileDistrict(String domicileDistrict) { this.domicileDistrict = domicileDistrict; }

    public Boolean getHasDomicileCertificate() { return hasDomicileCertificate; }
    public void setHasDomicileCertificate(Boolean hasDomicileCertificate) { this.hasDomicileCertificate = hasDomicileCertificate; }

    public String getDomicileCertStatus() { return domicileCertStatus; }
    public void setDomicileCertStatus(String domicileCertStatus) { this.domicileCertStatus = domicileCertStatus; }

    public String getPincode() { return pincode != null ? pincode : currentPincode; }
    public void setPincode(String pincode) { this.pincode = pincode; this.currentPincode = pincode; }

    public String getCurrentPincode() { return currentPincode != null ? currentPincode : pincode; }
    public void setCurrentPincode(String currentPincode) { this.currentPincode = currentPincode; this.pincode = currentPincode; }

    public String getCurrentResidenceState() { return currentResidenceState; }
    public void setCurrentResidenceState(String currentResidenceState) { this.currentResidenceState = currentResidenceState; }

    public String getCurrentResidenceDistrict() { return currentResidenceDistrict; }
    public void setCurrentResidenceDistrict(String currentResidenceDistrict) { this.currentResidenceDistrict = currentResidenceDistrict; }

    public Boolean getHasDisability() { return hasDisability != null ? hasDisability : isPwd; }
    public void setHasDisability(Boolean hasDisability) { this.hasDisability = hasDisability; this.isPwd = hasDisability; }

    public Boolean getIsPwd() { return isPwd != null ? isPwd : hasDisability; }
    public void setIsPwd(Boolean pwd) { isPwd = pwd; this.hasDisability = pwd; }

    public BigDecimal getDisabilityPercentage() { return disabilityPercentage; }
    public void setDisabilityPercentage(BigDecimal disabilityPercentage) { this.disabilityPercentage = disabilityPercentage; }

    public String getDisabilityCertStatus() { return disabilityCertStatus; }
    public void setDisabilityCertStatus(String disabilityCertStatus) { this.disabilityCertStatus = disabilityCertStatus; }

    public Boolean getHasUdidCard() { return hasUdidCard; }
    public void setHasUdidCard(Boolean hasUdidCard) { this.hasUdidCard = hasUdidCard; }

    public Boolean getIsFarmerFamily() { return isFarmerFamily != null ? isFarmerFamily : farmerFamily; }
    public void setIsFarmerFamily(Boolean farmerFamily) { this.isFarmerFamily = farmerFamily; this.farmerFamily = farmerFamily; }

    public Boolean getFarmerFamily() { return farmerFamily != null ? farmerFamily : isFarmerFamily; }
    public void setFarmerFamily(Boolean farmerFamily) { this.farmerFamily = farmerFamily; this.isFarmerFamily = farmerFamily; }

    public Boolean getIsFirstGraduate() { return isFirstGraduate != null ? isFirstGraduate : isFirstGenLearner; }
    public void setIsFirstGraduate(Boolean firstGraduate) { this.isFirstGraduate = firstGraduate; this.isFirstGenLearner = firstGraduate; }

    public Boolean getIsFirstGenLearner() { return isFirstGenLearner != null ? isFirstGenLearner : isFirstGraduate; }
    public void setIsFirstGenLearner(Boolean firstGenLearner) { this.isFirstGenLearner = firstGenLearner; this.isFirstGraduate = firstGenLearner; }

    public Boolean getIsWardOfDefenseOrCapf() { return isWardOfDefenseOrCapf != null ? isWardOfDefenseOrCapf : (isExServicemanWard != null ? isExServicemanWard : armedForcesChild); }
    public void setIsWardOfDefenseOrCapf(Boolean wardOfDefenseOrCapf) { this.isWardOfDefenseOrCapf = wardOfDefenseOrCapf; }

    public Boolean getIsExServicemanWard() { return isExServicemanWard != null ? isExServicemanWard : isWardOfDefenseOrCapf; }
    public void setIsExServicemanWard(Boolean exServicemanWard) { this.isExServicemanWard = exServicemanWard; this.isWardOfDefenseOrCapf = exServicemanWard; }

    public Boolean getArmedForcesChild() { return armedForcesChild != null ? armedForcesChild : isWardOfDefenseOrCapf; }
    public void setArmedForcesChild(Boolean armedForcesChild) { this.armedForcesChild = armedForcesChild; this.isWardOfDefenseOrCapf = armedForcesChild; }

    public String getExServicemanServiceStatus() { return exServicemanServiceStatus; }
    public void setExServicemanServiceStatus(String exServicemanServiceStatus) { this.exServicemanServiceStatus = exServicemanServiceStatus; }

    public String getExServicemanDocStatus() { return exServicemanDocStatus; }
    public void setExServicemanDocStatus(String exServicemanDocStatus) { this.exServicemanDocStatus = exServicemanDocStatus; }

    public Boolean getIsSingleParent() { return isSingleParent != null ? isSingleParent : isSingleParentHousehold; }
    public void setIsSingleParent(Boolean singleParent) { this.isSingleParent = singleParent; this.isSingleParentHousehold = singleParent; }

    public Boolean getIsSingleParentHousehold() { return isSingleParentHousehold != null ? isSingleParentHousehold : isSingleParent; }
    public void setIsSingleParentHousehold(Boolean singleParentHousehold) { this.isSingleParentHousehold = singleParentHousehold; this.isSingleParent = singleParentHousehold; }

    public Boolean getIsOrphan() { return isOrphan; }
    public void setIsOrphan(Boolean orphan) { isOrphan = orphan; }

    public String getOrphanDocStatus() { return orphanDocStatus; }
    public void setOrphanDocStatus(String orphanDocStatus) { this.orphanDocStatus = orphanDocStatus; }

    public Boolean getIsSingleGirlChild() { return isSingleGirlChild; }
    public void setIsSingleGirlChild(Boolean singleGirlChild) { isSingleGirlChild = singleGirlChild; }

    public String getSingleGirlChildProofStatus() { return singleGirlChildProofStatus; }
    public void setSingleGirlChildProofStatus(String singleGirlChildProofStatus) { this.singleGirlChildProofStatus = singleGirlChildProofStatus; }

    public Boolean getIsMinority() { return isMinority; }
    public void setIsMinority(Boolean minority) { isMinority = minority; }

    public String getMinorityCommunity() { return minorityCommunity; }
    public void setMinorityCommunity(String minorityCommunity) { this.minorityCommunity = minorityCommunity; }

    public String getMinorityDocStatus() { return minorityDocStatus; }
    public void setMinorityDocStatus(String minorityDocStatus) { this.minorityDocStatus = minorityDocStatus; }

    public String getExistingScholarship() { return existingScholarship; }
    public void setExistingScholarship(String existingScholarship) { this.existingScholarship = existingScholarship; }

    public Boolean getIsCurrentlyReceivingScholarship() { return isCurrentlyReceivingScholarship; }
    public void setIsCurrentlyReceivingScholarship(Boolean currentlyReceivingScholarship) { isCurrentlyReceivingScholarship = currentlyReceivingScholarship; }

    public String getCurrentScholarshipName() { return currentScholarshipName; }
    public void setCurrentScholarshipName(String currentScholarshipName) { this.currentScholarshipName = currentScholarshipName; }

    public String getCurrentScholarshipProvider() { return currentScholarshipProvider; }
    public void setCurrentScholarshipProvider(String currentScholarshipProvider) { this.currentScholarshipProvider = currentScholarshipProvider; }

    public Boolean getPreviouslyReceivedScholarship() { return previouslyReceivedScholarship; }
    public void setPreviouslyReceivedScholarship(Boolean previouslyReceivedScholarship) { this.previouslyReceivedScholarship = previouslyReceivedScholarship; }

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

    public Integer getProfileCompletionScore() { return profileCompletionScore; }
    public void setProfileCompletionScore(Integer profileCompletionScore) { this.profileCompletionScore = profileCompletionScore; }

    public Integer getProfileCompletion() { return profileCompletion; }
    public void setProfileCompletion(Integer profileCompletion) { this.profileCompletion = profileCompletion; }

    public Object getPreferences() { return preferences; }
    public void setPreferences(Object preferences) { this.preferences = preferences; }
}
