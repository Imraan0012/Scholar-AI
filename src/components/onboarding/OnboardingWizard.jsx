import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudentProfile } from '../../context/StudentProfileContext';
import { profileService } from '../../services/profileService';
import SearchableSelect from '../ui/SearchableSelect';
import { getCoursesForEducationLevel, getBranchesForCourse } from '../../data/coursesAndBranches';
import { Check, ArrowLeft, Edit3, ShieldAlert, FileText, CheckCircle2, Clock, AlertCircle, Upload, Trash2, FileCheck, Paperclip, X } from 'lucide-react';

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'Personal details',
    subtitle: "Let's start with some basic information."
  },
  {
    id: 2,
    title: 'Academic background',
    subtitle: 'Tell us about your current education and academic performance.'
  },
  {
    id: 3,
    title: 'Financial information',
    subtitle: 'Details used for income-based and means-tested scholarships.'
  },
  {
    id: 4,
    title: 'Category & state of residence',
    subtitle: 'Information required for applicable state, category and quota-based scholarships.'
  },
  {
    id: 5,
    title: 'Additional information',
    subtitle: 'Other details that may unlock special schemes and optional document readiness.'
  }
];

const INDIAN_STATES_AND_UTS = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

function formatIndianNumber(num) {
  if (num === undefined || num === null || isNaN(num)) return '0';
  const val = Math.round(num);
  return val.toLocaleString('en-IN');
}

function formatIncomeInWords(amount) {
  const num = parseFloat(amount || 0);
  if (num <= 0) return '₹0';
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Crore`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} Lakhs`;
  }
  return `₹${formatIndianNumber(num)}`;
}

export default function OnboardingWizard({ onComplete, onCancel }) {
  const { profile, updateProfile } = useStudentProfile();

  const [currentStep, setCurrentStep] = useState(() => {
    const firstIncomplete = profileService.getFirstIncompleteStep(profile);
    return (firstIncomplete >= 1 && firstIncomplete <= 5) ? firstIncomplete : 1;
  });

  const [formData, setFormData] = useState(() => ({
    ...profile,
    gender: profile.gender || 'MALE',
    nationality: profile.nationality || 'INDIAN',
    educationLevel: profile.educationLevel || 'UNDERGRADUATE',
    studyMode: profile.studyMode || 'FULL_TIME',
    applicationType: profile.applicationType || 'FRESH',
    institutionType: profile.institutionType || 'Government',
    category: profile.category || 'GENERAL',
    incomeSource: profile.incomeSource || 'SALARY',
    familyMembersCount: profile.familyMembersCount || 4,
    earningMembersCount: profile.earningMembersCount || 1,
    incomeCertificateStatus: profile.incomeCertificateStatus || (profile.hasIncomeCertificate ? 'YES' : 'NO'),
    incomeCertIssuedBy: profile.incomeCertIssuedBy || 'Tehsildar',
    obcNclStatus: profile.obcNclStatus || 'YES',
    obcCertStatus: profile.obcCertStatus || 'YES',
    ewsCertStatus: profile.ewsCertStatus || 'NO',
    categoryCertStatus: profile.categoryCertStatus || 'YES',
    domicileCertStatus: profile.domicileCertStatus || 'AVAILABLE',
    documentStatuses: profile.documentStatuses || {},
    uploadedFiles: profile.uploadedFiles || {}
  }));
  const [fieldErrors, setFieldErrors] = useState({});
  const [saveError, setSaveError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Synchronize server-loaded profile fields into form state on initial load
  useEffect(() => {
    if (profile) {
      setFormData((prev) => {
        const next = { ...prev };
        Object.keys(profile).forEach((key) => {
          if (profile[key] !== undefined && profile[key] !== null && profile[key] !== '') {
            next[key] = profile[key];
          }
        });
        return next;
      });
    }
  }, [profile?.id]);

  const handleChange = (field, value) => {
    setSaveError(null);
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleCourseChange = (selectedCourse) => {
    setSaveError(null);
    setFormData((prev) => ({
      ...prev,
      course: selectedCourse,
      diplomaCourse: selectedCourse,
      specialization: '',
      branch: ''
    }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.course;
      delete next.diplomaCourse;
      delete next.specialization;
      delete next.branch;
      return next;
    });
  };

  const handleEduLevelChange = (lvlId) => {
    setSaveError(null);
    setFormData((prev) => ({
      ...prev,
      educationLevel: lvlId,
      course: lvlId === 'TWELFTH_COMPLETED' ? '12th / Higher Secondary' : '',
      diplomaCourse: '',
      specialization: '',
      branch: '',
      currentYear: lvlId === 'TWELFTH_COMPLETED' ? 1 : prev.currentYear || 1
    }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.course;
      delete next.diplomaCourse;
      delete next.specialization;
      delete next.branch;
      return next;
    });
  };

  const eduLevel = formData.educationLevel || 'UNDERGRADUATE';

  // Dynamic document requirements list based on student profile attributes
  const dynamicDocuments = useMemo(() => {
    const docs = [
      { id: 'doc_identity', name: 'Aadhaar / Identity Proof' },
      { id: 'doc_bank_passbook', name: 'Bank Account Passbook / Statement' },
      { id: 'doc_10_marksheet', name: 'Class 10 Board Marksheet' }
    ];

    if (eduLevel === 'TWELFTH_COMPLETED' || eduLevel === 'UNDERGRADUATE' || eduLevel === 'POSTGRADUATE') {
      docs.push({ id: 'doc_12_marksheet', name: 'Class 12 Board Marksheet' });
    }

    if (eduLevel === 'DIPLOMA' || eduLevel === 'UNDERGRADUATE' || eduLevel === 'POSTGRADUATE') {
      docs.push({ id: 'doc_bonafide', name: 'College Bonafide / Enrollment Certificate' });
    }

    if (eduLevel === 'POSTGRADUATE') {
      docs.push({ id: 'doc_ug_degree', name: 'Undergraduate Degree / Consolidated Marksheet' });
    }

    if (eduLevel === 'DIPLOMA') {
      docs.push({ id: 'doc_diploma_marksheet', name: 'Diploma Marksheet / Certificate' });
    }

    // Income Certificate
    if (parseFloat(formData.annualIncome || 0) <= 800000 || formData.incomeCertificateStatus === 'YES') {
      docs.push({ id: 'doc_income_cert', name: 'Income Certificate (Competent Authority)' });
    }

    // Caste / Category Certificates
    if (formData.category === 'OBC') {
      docs.push({ id: 'doc_obc_ncl', name: 'OBC Non-Creamy Layer (NCL) Certificate' });
      docs.push({ id: 'doc_category_cert', name: 'OBC Caste Certificate' });
    } else if (formData.category === 'SC') {
      docs.push({ id: 'doc_category_cert', name: 'SC Caste Certificate' });
    } else if (formData.category === 'ST') {
      docs.push({ id: 'doc_category_cert', name: 'ST Caste Certificate' });
    } else if (formData.category === 'EWS') {
      docs.push({ id: 'doc_ews_cert', name: 'EWS Income & Asset Certificate' });
    }

    // Domicile
    if (formData.domicileState) {
      docs.push({ id: 'doc_domicile', name: `Domicile Certificate (${formData.domicileState})` });
    }

    // Special Condition Documents
    if (formData.hasDisability) {
      docs.push({ id: 'doc_disability_cert', name: 'Disability Certificate / UDID Card' });
    }

    if (formData.isExServicemanWard) {
      docs.push({ id: 'doc_armed_forces', name: 'Armed Forces / ESM Service Discharge Proof' });
    }

    if (formData.isOrphan) {
      docs.push({ id: 'doc_orphan_proof', name: 'Orphan / State Ward Supporting Document' });
    }

    if (formData.isSingleGirlChild) {
      docs.push({ id: 'doc_single_girl_child', name: 'Single Girl Child Affidavit Proof' });
    }

    if (formData.isMinority) {
      docs.push({ id: 'doc_minority_cert', name: 'Minority Declaration / Certificate' });
    }

    return docs;
  }, [formData, eduLevel]);

  // Handle document file upload (marksheets, certs, IDs)
  const handleFileUpload = (docId, file) => {
    if (!file) return;

    const fileData = {
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type,
      uploadedAt: new Date().toISOString()
    };

    const currentFiles = { ...(formData.uploadedFiles || {}) };
    currentFiles[docId] = fileData;

    const currentStatuses = { ...(formData.documentStatuses || {}) };
    currentStatuses[docId] = 'READY';

    let uploadedIds = [...(formData.uploadedDocumentIds || [])];
    if (!uploadedIds.includes(docId)) uploadedIds.push(docId);

    setFormData((prev) => ({
      ...prev,
      uploadedFiles: currentFiles,
      documentStatuses: currentStatuses,
      uploadedDocumentIds: uploadedIds
    }));
  };

  // Remove uploaded file and revert status to strictly PENDING
  const handleRemoveFile = (docId) => {
    const currentFiles = { ...(formData.uploadedFiles || {}) };
    delete currentFiles[docId];

    const currentStatuses = { ...(formData.documentStatuses || {}) };
    currentStatuses[docId] = 'PENDING';

    const uploadedIds = (formData.uploadedDocumentIds || []).filter((id) => id !== docId);

    setFormData((prev) => ({
      ...prev,
      uploadedFiles: currentFiles,
      documentStatuses: currentStatuses,
      uploadedDocumentIds: uploadedIds
    }));
  };

  const toggleSpecialCondition = (field) => {
    handleChange(field, !formData[field]);
  };

  // Validation logic across all 5 steps
  const validateStep = (stepNumber, currentData = formData) => {
    const errors = {};
    const d = {
      ...currentData,
      gender: currentData.gender || 'MALE',
      nationality: currentData.nationality || 'INDIAN',
      educationLevel: currentData.educationLevel || 'UNDERGRADUATE',
      institutionType: currentData.institutionType || 'Government',
      currentYear: currentData.currentYear || 1,
      admissionYear: currentData.admissionYear || 2024,
      studyMode: currentData.studyMode || 'Full-time',
      class12Stream: currentData.class12Stream || 'Science',
      class12PassingYear: currentData.class12PassingYear || 2024,
      intendedAdmissionYear: currentData.intendedAdmissionYear || 2026,
      incomeSource: currentData.incomeSource || 'SALARY',
      familyMembersCount: currentData.familyMembersCount || 4,
      earningMembersCount: currentData.earningMembersCount !== undefined ? currentData.earningMembersCount : 1,
      incomeCertificateStatus: currentData.incomeCertificateStatus || 'YES',
      category: currentData.category || 'GENERAL',
      domicileState: currentData.domicileState || 'Tamil Nadu',
      applicationType: currentData.applicationType || 'FRESH'
    };

    const currentEdu = d.educationLevel || 'UNDERGRADUATE';

    // STEP 1 VALIDATION
    if (stepNumber === 1) {
      if (!d.fullName || String(d.fullName).trim() === '') {
        errors.fullName = 'Full name is required.';
      }
      if (!d.dob) {
        errors.dob = 'Date of birth is required.';
      }
      if (!d.gender) {
        errors.gender = 'Gender selection is required.';
      }
      if (!d.nationality) {
        errors.nationality = 'Nationality is required.';
      }
      if (!d.email || String(d.email).trim() === '') {
        errors.email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(d.email).trim())) {
        errors.email = 'Please enter a valid email address.';
      }
      if (d.mobile && String(d.mobile).trim() !== '') {
        const cleanMobile = String(d.mobile).replace(/[^0-9]/g, '');
        if (cleanMobile.length < 10) {
          errors.mobile = 'Please enter a valid 10-digit mobile number.';
        }
      }
    }

    // STEP 2 VALIDATION
    if (stepNumber === 2) {
      if (currentEdu === 'TWELFTH_COMPLETED') {
        if (d.class10Percentage === undefined || d.class10Percentage === '' || isNaN(d.class10Percentage)) {
          errors.class10Percentage = 'Class 10 percentage is required.';
        } else if (parseFloat(d.class10Percentage) < 0 || parseFloat(d.class10Percentage) > 100) {
          errors.class10Percentage = 'Percentage must be between 0 and 100.';
        }

        if (d.class12Percentage === undefined || d.class12Percentage === '' || isNaN(d.class12Percentage)) {
          errors.class12Percentage = 'Class 12 percentage is required.';
        } else if (parseFloat(d.class12Percentage) < 0 || parseFloat(d.class12Percentage) > 100) {
          errors.class12Percentage = 'Percentage must be between 0 and 100.';
        }
      } else if (currentEdu === 'DIPLOMA') {
        if (!d.diplomaCourse && !d.course) {
          errors.diplomaCourse = 'Diploma course name is required.';
          errors.course = 'Diploma course name is required.';
        }
        if (!d.specialization && !d.branch) {
          errors.specialization = 'Specialization / branch is required.';
        }
        if (!d.institutionName || String(d.institutionName).trim() === '') {
          errors.institutionName = 'Institution / college name is required.';
        }
        if (d.diplomaScore === undefined || d.diplomaScore === '' || isNaN(d.diplomaScore)) {
          errors.diplomaScore = 'Diploma percentage / CGPA is required.';
        }
      } else if (currentEdu === 'UNDERGRADUATE') {
        if (!d.course || String(d.course).trim() === '') {
          errors.course = 'Course / degree name is required.';
        }
        if (!d.specialization && !d.branch) {
          errors.specialization = 'Branch / specialization is required.';
        }
        if (!d.institutionName || String(d.institutionName).trim() === '') {
          errors.institutionName = 'Institution / college name is required.';
        }
        if (d.class12Percentage === undefined || d.class12Percentage === '' || isNaN(d.class12Percentage)) {
          errors.class12Percentage = 'Class 12 percentage is required.';
        }
        if (d.cgpa === undefined || d.cgpa === '' || isNaN(d.cgpa)) {
          errors.cgpa = 'Current CGPA or percentage is required.';
        }
      } else if (currentEdu === 'POSTGRADUATE') {
        if (!d.course || String(d.course).trim() === '') {
          errors.course = 'PG degree / course name is required.';
        }
        if (!d.specialization && !d.branch) {
          errors.specialization = 'Specialization is required.';
        }
        if (!d.institutionName || String(d.institutionName).trim() === '') {
          errors.institutionName = 'Institution / college name is required.';
        }
        if (!d.undergraduateDegree || String(d.undergraduateDegree).trim() === '') {
          errors.undergraduateDegree = 'Undergraduate degree name is required.';
        }
        if (d.undergraduateCgpa === undefined || d.undergraduateCgpa === '' || isNaN(d.undergraduateCgpa)) {
          errors.undergraduateCgpa = 'UG CGPA / percentage is required.';
        }
        if (d.cgpa === undefined || d.cgpa === '' || isNaN(d.cgpa)) {
          errors.cgpa = 'Current PG CGPA / percentage is required.';
        }
      }
    }

    // STEP 3 VALIDATION
    if (stepNumber === 3) {
      if (d.annualIncome === undefined || d.annualIncome === '' || isNaN(d.annualIncome) || parseFloat(d.annualIncome) < 0) {
        errors.annualIncome = 'Please enter a valid annual family income in INR.';
      }
      if (!d.incomeSource) {
        errors.incomeSource = 'Primary family income source is required.';
      }
      if (!d.familyMembersCount || parseInt(d.familyMembersCount, 10) < 1) {
        errors.familyMembersCount = 'Please specify the number of family members.';
      }
      if (d.earningMembersCount === undefined || d.earningMembersCount === '' || parseInt(d.earningMembersCount, 10) < 0) {
        errors.earningMembersCount = 'Please specify the number of earning members.';
      }
      if (!d.incomeCertificateStatus) {
        errors.incomeCertificateStatus = 'Please indicate income certificate availability.';
      }
    }

    // STEP 4 VALIDATION
    if (stepNumber === 4) {
      if (!d.category) {
        errors.category = 'Social category is required.';
      }
      if (!d.domicileState) {
        errors.domicileState = 'State of residence is required.';
      }
      if (d.currentPincode && String(d.currentPincode).trim() !== '') {
        const cleanPin = String(d.currentPincode).replace(/[^0-9]/g, '');
        if (cleanPin.length !== 6) {
          errors.currentPincode = 'PIN code must be exactly 6 digits.';
        }
      }
    }

    // STEP 5 VALIDATION
    if (stepNumber === 5) {
      if (d.hasDisability) {
        if (d.disabilityPercentage === undefined || d.disabilityPercentage === '' || isNaN(d.disabilityPercentage)) {
          errors.disabilityPercentage = 'Disability percentage is required.';
        } else if (parseFloat(d.disabilityPercentage) <= 0 || parseFloat(d.disabilityPercentage) > 100) {
          errors.disabilityPercentage = 'Disability percentage must be between 1% and 100%.';
        }
      }
      if (!d.applicationType) {
        errors.applicationType = 'Application type is required.';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinue = async () => {
    setSaveError(null);

    const sanitizedData = {
      ...formData,
      gender: formData.gender || 'MALE',
      nationality: formData.nationality || 'INDIAN',
      educationLevel: formData.educationLevel || 'UNDERGRADUATE',
      institutionType: formData.institutionType || 'Government',
      currentYear: formData.currentYear || 1,
      admissionYear: formData.admissionYear || 2024,
      studyMode: formData.studyMode || 'Full-time',
      class12Stream: formData.class12Stream || 'Science',
      class12PassingYear: formData.class12PassingYear || 2024,
      intendedAdmissionYear: formData.intendedAdmissionYear || 2026,
      incomeSource: formData.incomeSource || 'SALARY',
      familyMembersCount: formData.familyMembersCount || 4,
      earningMembersCount: formData.earningMembersCount !== undefined ? formData.earningMembersCount : 1,
      incomeCertificateStatus: formData.incomeCertificateStatus || 'YES',
      category: formData.category || 'GENERAL',
      domicileState: formData.domicileState || 'Tamil Nadu',
      applicationType: formData.applicationType || 'FRESH'
    };

    setFormData(sanitizedData);

    if (currentStep <= 5) {
      if (!validateStep(currentStep, sanitizedData)) return;
    }

    if (currentStep < 5) {
      const nextStep = currentStep + 1;
      // 1. Instant optimistic state transition
      updateProfile(sanitizedData);
      setCurrentStep(nextStep);
      setFieldErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // 2. Non-blocking asynchronous database sync in background
      profileService.saveOnboardingStep(nextStep, sanitizedData).catch((err) => {
        console.warn('[OnboardingWizard] Background step save notice:', err.message);
      });
    } else if (currentStep === 5) {
      const completedData = {
        ...sanitizedData,
        isOnboarded: true,
        onboardingComplete: true,
        onboardingStep: 5
      };

      // 1. Optimistically update local profile state immediately
      updateProfile(completedData);

      // 2. Immediately open the existing scholarship eligibility analysis animation
      onComplete?.(completedData);

      // 3. Save completed profile to Supabase & Spring Boot backend in background
      profileService.saveOnboardingStep(5, completedData).catch((err) => {
        console.warn('[OnboardingWizard] Profile background save notice:', err.message);
      });
    }
  };

  const handleBack = () => {
    setFieldErrors({});
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      updateProfile(formData);
      setCurrentStep(prevStep);
      profileService.saveOnboardingProgress(prevStep, formData);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onCancel?.();
    }
  };

  const jumpToStep = (stepNumber) => {
    if (stepNumber <= currentStep) {
      updateProfile(formData);
      setFieldErrors({});
      setCurrentStep(stepNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans antialiased border-t-2 border-slate-900 selection:bg-blue-600 selection:text-white flex flex-col justify-start">
      {/* Expanded Main Container (1200px max-width) */}
      <div className="w-full max-w-[1220px] mx-auto px-4 sm:px-8 lg:px-12 pt-2 sm:pt-4 pb-12">
        {/* Top Clean Minimal Navbar */}
        <header className="h-[56px] flex items-center justify-between border-b border-slate-200/80 mb-5 sm:mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-[28px] h-[28px] rounded-[7px] bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm select-none">
              S
            </div>
            <span className="text-sm sm:text-base font-bold text-slate-900 tracking-[-0.01em]">
              Scholar AI
            </span>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors py-1.5 px-2.5 rounded-md hover:bg-slate-100/80 cursor-pointer"
          >
            Exit to home
          </button>
        </header>

        {/* ── MAIN TWO-COLUMN ONBOARDING GRID (45% Left / 55% Right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT COLUMN: PROGRESS TIMELINE */}
          <aside className="lg:col-span-5 w-full">
            <h1 className="text-2xl sm:text-3xl lg:text-[30px] font-bold text-slate-900 leading-[1.15] tracking-[-0.025em]">
              Let's find the scholarships<br className="hidden sm:inline" /> you're eligible for.
            </h1>

            <p className="mt-2.5 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-[420px]">
              We'll ask you a few questions about your education, financial background and other details to find scholarships that fit your profile.
            </p>

            {/* Progress Stepper Section */}
            <div className="mt-6 sm:mt-8">
              <span className="text-[10.5px] font-bold tracking-[0.08em] text-slate-400 uppercase mb-4 block">
                GETTING STARTED
              </span>

              {/* Vertical Step Timeline */}
              <div className="relative space-y-0">
                <div
                  className="absolute left-[13px] top-[14px] bottom-[20px] w-[2px] bg-slate-200 pointer-events-none"
                  aria-hidden="true"
                />

                {ONBOARDING_STEPS.map((step) => {
                  const isCompleted = currentStep > step.id || currentStep === 6;
                  const isCurrent = currentStep === step.id;

                  return (
                    <div
                      key={step.id}
                      onClick={() => {
                        if (isCompleted) jumpToStep(step.id);
                      }}
                      className={`relative flex items-start gap-3.5 pb-5 sm:pb-6 last:pb-0 ${
                        isCompleted ? 'cursor-pointer group' : ''
                      }`}
                    >
                      {/* Step Circle */}
                      <div className="relative z-10 flex-shrink-0 pt-0.5">
                        {isCompleted ? (
                          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center transition-all shadow-sm">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center ring-4 ring-blue-100 transition-all shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-white border border-slate-300 flex items-center justify-center transition-colors">
                            <span className="text-[11px] font-semibold text-slate-400">
                              0{step.id}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Step Labels */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs sm:text-sm font-semibold leading-none transition-colors ${
                              isCurrent
                                ? 'text-blue-600'
                                : isCompleted
                                ? 'text-slate-900 group-hover:text-blue-600'
                                : 'text-slate-500'
                            }`}
                          >
                            0{step.id} {step.title}
                          </span>
                        </div>

                        <p
                          className={`text-[11.5px] sm:text-xs mt-1 leading-snug transition-colors ${
                            isCurrent
                              ? 'text-slate-500'
                              : isCompleted
                              ? 'text-slate-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: INTERACTIVE FORM CARD */}
          <main className="lg:col-span-7 w-full">
            <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-5 sm:p-7 lg:p-8 shadow-[0_1px_4px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)] w-full">
              {saveError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}
              <AnimatePresence mode="wait">
                
                {/* ── STEP 1: PERSONAL DETAILS ─────────────────────────────────────── */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="mb-7">
                      <span className="text-[11.5px] font-bold text-blue-600 tracking-[0.06em] uppercase block">
                        STEP 1 OF 5
                      </span>
                      <h2 className="text-[26px] sm:text-[28px] font-bold text-slate-900 tracking-[-0.02em] mt-1">
                        Personal details
                      </h2>
                      <p className="text-[14px] text-slate-500 mt-1">
                        Let's start with some basic information.
                      </p>
                    </div>

                    <div className="space-y-5">
                      {/* Full Name */}
                      <div>
                        <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                          Full name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.fullName || ''}
                          onChange={(e) => handleChange('fullName', e.target.value)}
                          placeholder="e.g. Mohamed Imraan"
                          className={`w-full h-[46px] px-4 text-[14px] bg-white border rounded-[10px] text-slate-800 placeholder:text-slate-400 hover:border-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 ${
                            fieldErrors.fullName ? 'border-red-400 bg-red-50/10' : 'border-[#CBD5E1]'
                          }`}
                        />
                        {fieldErrors.fullName && (
                          <p className="text-[12px] text-red-600 font-medium mt-1">
                            {fieldErrors.fullName}
                          </p>
                        )}
                      </div>

                      {/* Date of Birth & Gender */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                            Date of birth <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={formData.dob || ''}
                            onChange={(e) => handleChange('dob', e.target.value)}
                            className={`w-full h-[46px] px-4 text-[14px] bg-white border rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors ${
                              fieldErrors.dob ? 'border-red-400 bg-red-50/10' : 'border-[#CBD5E1]'
                            }`}
                          />
                          {fieldErrors.dob && (
                            <p className="text-[12px] text-red-600 font-medium mt-1">
                              {fieldErrors.dob}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                            Gender <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.gender || 'MALE'}
                            onChange={(e) => handleChange('gender', e.target.value)}
                            className="w-full h-[46px] px-4 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                          >
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Nationality & Mobile Number */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                            Nationality <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.nationality || 'INDIAN'}
                            onChange={(e) => handleChange('nationality', e.target.value)}
                            className="w-full h-[46px] px-4 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                          >
                            <option value="INDIAN">Indian</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                            Mobile number
                          </label>
                          <input
                            type="tel"
                            value={formData.mobile || ''}
                            onChange={(e) => handleChange('mobile', e.target.value)}
                            placeholder="e.g. 9876543210"
                            className={`w-full h-[46px] px-4 text-[14px] bg-white border rounded-[10px] text-slate-800 placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors ${
                              fieldErrors.mobile ? 'border-red-400 bg-red-50/10' : 'border-[#CBD5E1]'
                            }`}
                          />
                          {fieldErrors.mobile && (
                            <p className="text-[12px] text-red-600 font-medium mt-1">
                              {fieldErrors.mobile}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                          Email address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => handleChange('email', e.target.value)}
                          placeholder="student@example.com"
                          className={`w-full h-[46px] px-4 text-[14px] bg-white border rounded-[10px] text-slate-800 placeholder:text-slate-400 hover:border-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 ${
                            fieldErrors.email ? 'border-red-400 bg-red-50/10' : 'border-[#CBD5E1]'
                          }`}
                        />
                        {fieldErrors.email && (
                          <p className="text-[12px] text-red-600 font-medium mt-1">
                            {fieldErrors.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 2: ACADEMIC BACKGROUND ──────────────────────────────────── */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="mb-7">
                      <span className="text-[11.5px] font-bold text-blue-600 tracking-[0.06em] uppercase block">
                        STEP 2 OF 5
                      </span>
                      <h2 className="text-[26px] sm:text-[28px] font-bold text-slate-900 tracking-[-0.02em] mt-1">
                        Academic background
                      </h2>
                      <p className="text-[14px] text-slate-500 mt-1">
                        Tell us about your current education and academic performance.
                      </p>
                    </div>

                    <div className="space-y-5">
                      {/* Education Level Cards */}
                      <div>
                        <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                          Education level <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {[
                            { id: 'TWELFTH_COMPLETED', label: '12th Passed', desc: 'College aspirant' },
                            { id: 'DIPLOMA', label: 'Diploma', desc: 'Polytechnic stream' },
                            { id: 'UNDERGRADUATE', label: 'Undergraduate', desc: 'B.Tech, B.Sc, B.Com' },
                            { id: 'POSTGRADUATE', label: 'Postgraduate', desc: 'M.Tech, MBA, M.Sc' }
                          ].map((lvl) => (
                            <button
                              key={lvl.id}
                              type="button"
                              onClick={() => handleEduLevelChange(lvl.id)}
                              className={`p-3 rounded-[10px] text-left border transition-all cursor-pointer ${
                                eduLevel === lvl.id
                                  ? 'bg-blue-50/70 border-blue-600 text-blue-950 ring-1 ring-blue-600'
                                  : 'bg-white border-[#CBD5E1] text-slate-700 hover:border-slate-400'
                              }`}
                            >
                              <span className="text-[13.5px] font-bold block leading-tight">{lvl.label}</span>
                              <span className="text-[11px] text-slate-500 block mt-0.5">{lvl.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 1. DYNAMIC FIELDS FOR 12TH PASSED */}
                      {eduLevel === 'TWELFTH_COMPLETED' && (
                        <div className="space-y-4 pt-1">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Class 10 percentage (%) <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={formData.class10Percentage || ''}
                                onChange={(e) => handleChange('class10Percentage', parseFloat(e.target.value))}
                                placeholder="e.g. 88.5"
                                className={`w-full h-[46px] px-4 text-[14px] bg-white border rounded-[10px] text-slate-800 placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors ${
                                  fieldErrors.class10Percentage ? 'border-red-400 bg-red-50/10' : 'border-[#CBD5E1]'
                                }`}
                              />
                              {fieldErrors.class10Percentage && (
                                <p className="text-[12px] text-red-600 font-medium mt-1">
                                  {fieldErrors.class10Percentage}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Class 12 percentage (%) <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={formData.class12Percentage || ''}
                                onChange={(e) => handleChange('class12Percentage', parseFloat(e.target.value))}
                                placeholder="e.g. 92.4"
                                className={`w-full h-[46px] px-4 text-[14px] bg-white border rounded-[10px] text-slate-800 placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors ${
                                  fieldErrors.class12Percentage ? 'border-red-400 bg-red-50/10' : 'border-[#CBD5E1]'
                                }`}
                              />
                              {fieldErrors.class12Percentage && (
                                <p className="text-[12px] text-red-600 font-medium mt-1">
                                  {fieldErrors.class12Percentage}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Class 12 stream <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={formData.class12Stream || 'Science'}
                                onChange={(e) => handleChange('class12Stream', e.target.value)}
                                className="w-full h-[46px] px-3 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                              >
                                <option value="Science">Science</option>
                                <option value="Commerce">Commerce</option>
                                <option value="Arts / Humanities">Arts / Humanities</option>
                                <option value="Vocational">Vocational</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Year of passing Class 12 <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={formData.class12PassingYear || 2026}
                                onChange={(e) => handleChange('class12PassingYear', parseInt(e.target.value, 10))}
                                className="w-full h-[46px] px-3 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                              >
                                {[2027, 2026, 2025, 2024, 2023, 2022, 2021, 2020].map((yr) => (
                                  <option key={yr} value={yr}>{yr}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Admission / intended year <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={formData.intendedAdmissionYear || 2026}
                                onChange={(e) => handleChange('intendedAdmissionYear', parseInt(e.target.value, 10))}
                                className="w-full h-[46px] px-3 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                              >
                                {[2026, 2027, 2025, 2024].map((yr) => (
                                  <option key={yr} value={yr}>{yr}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 2. DYNAMIC FIELDS FOR DIPLOMA */}
                      {eduLevel === 'DIPLOMA' && (
                        <div className="space-y-4 pt-1">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Diploma course <span className="text-red-500">*</span>
                              </label>
                              <SearchableSelect
                                value={formData.course || formData.diplomaCourse || ''}
                                onChange={handleCourseChange}
                                options={getCoursesForEducationLevel('DIPLOMA')}
                                placeholder="Select diploma course..."
                                error={fieldErrors.diplomaCourse || fieldErrors.course}
                              />
                              {(fieldErrors.diplomaCourse || fieldErrors.course) && (
                                <p className="text-[12px] text-red-600 font-medium mt-1">
                                  {fieldErrors.diplomaCourse || fieldErrors.course}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Specialization / branch <span className="text-red-500">*</span>
                              </label>
                              <SearchableSelect
                                value={formData.specialization || formData.branch || ''}
                                onChange={(val) => {
                                  handleChange('specialization', val);
                                  handleChange('branch', val);
                                }}
                                options={getBranchesForCourse(formData.course || formData.diplomaCourse)}
                                placeholder={formData.course || formData.diplomaCourse ? "Select specialization..." : "Select diploma first..."}
                                disabled={!formData.course && !formData.diplomaCourse}
                                error={fieldErrors.specialization || fieldErrors.branch}
                              />
                              {(fieldErrors.specialization || fieldErrors.branch) && (
                                <p className="text-[12px] text-red-600 font-medium mt-1">
                                  {fieldErrors.specialization || fieldErrors.branch}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Institution / college name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={formData.institutionName || ''}
                                onChange={(e) => handleChange('institutionName', e.target.value)}
                                placeholder="e.g. Govt Polytechnic Pune"
                                className={`w-full h-[46px] px-4 text-[14px] bg-white border rounded-[10px] text-slate-800 placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors ${
                                  fieldErrors.institutionName ? 'border-red-400 bg-red-50/10' : 'border-[#CBD5E1]'
                                }`}
                              />
                              {fieldErrors.institutionName && (
                                <p className="text-[12px] text-red-600 font-medium mt-1">
                                  {fieldErrors.institutionName}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Institution type <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={formData.institutionType || 'Government'}
                                onChange={(e) => handleChange('institutionType', e.target.value)}
                                className="w-full h-[46px] px-3 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                              >
                                <option value="Government">Government</option>
                                <option value="Government-aided">Government-aided</option>
                                <option value="Private">Private</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Current year <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={formData.currentYear || 1}
                                onChange={(e) => handleChange('currentYear', parseInt(e.target.value, 10))}
                                className="w-full h-[46px] px-3 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                              >
                                <option value={1}>1st Year</option>
                                <option value={2}>2nd Year</option>
                                <option value={3}>3rd Year</option>
                                <option value={4}>Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Year of admission <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={formData.admissionYear || 2025}
                                onChange={(e) => handleChange('admissionYear', parseInt(e.target.value, 10))}
                                className="w-full h-[46px] px-3 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                              >
                                {[2026, 2025, 2024, 2023, 2022].map((yr) => (
                                  <option key={yr} value={yr}>{yr}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Study mode <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={formData.studyMode || 'Full-time'}
                                onChange={(e) => handleChange('studyMode', e.target.value)}
                                className="w-full h-[46px] px-3 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                              >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Class 10 percentage (%)
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={formData.class10Percentage || ''}
                                onChange={(e) => handleChange('class10Percentage', parseFloat(e.target.value))}
                                placeholder="e.g. 84.0"
                                className="w-full h-[46px] px-4 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                              />
                            </div>

                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Diploma percentage / CGPA <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={formData.diplomaScore || ''}
                                onChange={(e) => handleChange('diplomaScore', parseFloat(e.target.value))}
                                placeholder="e.g. 82.5 or 8.4"
                                className={`w-full h-[46px] px-4 text-[14px] bg-white border rounded-[10px] text-slate-800 placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors ${
                                  fieldErrors.diplomaScore ? 'border-red-400 bg-red-50/10' : 'border-[#CBD5E1]'
                                }`}
                              />
                              {fieldErrors.diplomaScore && (
                                <p className="text-[12px] text-red-600 font-medium mt-1">
                                  {fieldErrors.diplomaScore}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 3. DYNAMIC FIELDS FOR UNDERGRADUATE */}
                      {eduLevel === 'UNDERGRADUATE' && (
                        <div className="space-y-4 pt-1">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Course / degree name <span className="text-red-500">*</span>
                              </label>
                              <SearchableSelect
                                value={formData.course || ''}
                                onChange={handleCourseChange}
                                options={getCoursesForEducationLevel('UNDERGRADUATE')}
                                placeholder="Search course (e.g. B.Tech / B.E., B.Sc, B.Com)..."
                                error={fieldErrors.course}
                              />
                              {fieldErrors.course && (
                                <p className="text-[12px] text-red-600 font-medium mt-1">
                                  {fieldErrors.course}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Branch / specialization <span className="text-red-500">*</span>
                              </label>
                              <SearchableSelect
                                value={formData.specialization || formData.branch || ''}
                                onChange={(val) => {
                                  handleChange('specialization', val);
                                  handleChange('branch', val);
                                }}
                                options={getBranchesForCourse(formData.course)}
                                placeholder={formData.course ? "Select branch / specialization..." : "Select course first..."}
                                disabled={!formData.course}
                                error={fieldErrors.specialization || fieldErrors.branch}
                              />
                              {(fieldErrors.specialization || fieldErrors.branch) && (
                                <p className="text-[12px] text-red-600 font-medium mt-1">
                                  {fieldErrors.specialization || fieldErrors.branch}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Institution / college name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={formData.institutionName || ''}
                                onChange={(e) => handleChange('institutionName', e.target.value)}
                                placeholder="e.g. VJTI Mumbai / Delhi University"
                                className={`w-full h-[46px] px-4 text-[14px] bg-white border rounded-[10px] text-slate-800 placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors ${
                                  fieldErrors.institutionName ? 'border-red-400 bg-red-50/10' : 'border-[#CBD5E1]'
                                }`}
                              />
                              {fieldErrors.institutionName && (
                                <p className="text-[12px] text-red-600 font-medium mt-1">
                                  {fieldErrors.institutionName}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Institution type <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={formData.institutionType || 'Government'}
                                onChange={(e) => handleChange('institutionType', e.target.value)}
                                className="w-full h-[46px] px-3 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                              >
                                <option value="Government">Government</option>
                                <option value="Government-aided">Government-aided</option>
                                <option value="Private">Private</option>
                                <option value="Deemed">Deemed</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Current year <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={formData.currentYear || 1}
                                onChange={(e) => handleChange('currentYear', parseInt(e.target.value, 10))}
                                className="w-full h-[46px] px-3 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                              >
                                <option value={1}>1st Year</option>
                                <option value={2}>2nd Year</option>
                                <option value={3}>3rd Year</option>
                                <option value={4}>4th Year</option>
                                <option value={5}>Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Year of admission <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={formData.admissionYear || 2024}
                                onChange={(e) => handleChange('admissionYear', parseInt(e.target.value, 10))}
                                className="w-full h-[46px] px-3 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                              >
                                {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map((yr) => (
                                  <option key={yr} value={yr}>{yr}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Study mode <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={formData.studyMode || 'Full-time'}
                                onChange={(e) => handleChange('studyMode', e.target.value)}
                                className="w-full h-[46px] px-3 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                              >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Distance">Distance</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Class 10 percentage (%)
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={formData.class10Percentage || ''}
                                onChange={(e) => handleChange('class10Percentage', parseFloat(e.target.value))}
                                placeholder="e.g. 90.5"
                                className="w-full h-[46px] px-4 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                              />
                            </div>

                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Class 12 percentage (%) <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={formData.class12Percentage || ''}
                                onChange={(e) => handleChange('class12Percentage', parseFloat(e.target.value))}
                                placeholder="e.g. 88.6"
                                className={`w-full h-[46px] px-4 text-[14px] bg-white border rounded-[10px] text-slate-800 placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors ${
                                  fieldErrors.class12Percentage ? 'border-red-400 bg-red-50/10' : 'border-[#CBD5E1]'
                                }`}
                              />
                              {fieldErrors.class12Percentage && (
                                <p className="text-[12px] text-red-600 font-medium mt-1">
                                  {fieldErrors.class12Percentage}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Current CGPA / % <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={formData.cgpa || ''}
                                onChange={(e) => handleChange('cgpa', parseFloat(e.target.value))}
                                placeholder="e.g. 8.45"
                                className={`w-full h-[46px] px-4 text-[14px] bg-white border rounded-[10px] text-slate-800 placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors ${
                                  fieldErrors.cgpa ? 'border-red-400 bg-red-50/10' : 'border-[#CBD5E1]'
                                }`}
                              />
                              {fieldErrors.cgpa && (
                                <p className="text-[12px] text-red-600 font-medium mt-1">
                                  {fieldErrors.cgpa}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 4. DYNAMIC FIELDS FOR POSTGRADUATE */}
                      {eduLevel === 'POSTGRADUATE' && (
                        <div className="space-y-4 pt-1">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                PG degree / course <span className="text-red-500">*</span>
                              </label>
                              <SearchableSelect
                                value={formData.course || ''}
                                onChange={handleCourseChange}
                                options={getCoursesForEducationLevel('POSTGRADUATE')}
                                placeholder="Search PG degree (e.g. M.Tech / M.E., MBA, M.Sc)..."
                                error={fieldErrors.course}
                              />
                              {fieldErrors.course && (
                                <p className="text-[12px] text-red-600 font-medium mt-1">
                                  {fieldErrors.course}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Specialization <span className="text-red-500">*</span>
                              </label>
                              <SearchableSelect
                                value={formData.specialization || formData.branch || ''}
                                onChange={(val) => {
                                  handleChange('specialization', val);
                                  handleChange('branch', val);
                                }}
                                options={getBranchesForCourse(formData.course)}
                                placeholder={formData.course ? "Select specialization..." : "Select degree first..."}
                                disabled={!formData.course}
                                error={fieldErrors.specialization || fieldErrors.branch}
                              />
                              {(fieldErrors.specialization || fieldErrors.branch) && (
                                <p className="text-[12px] text-red-600 font-medium mt-1">
                                  {fieldErrors.specialization || fieldErrors.branch}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Institution / college name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={formData.institutionName || ''}
                                onChange={(e) => handleChange('institutionName', e.target.value)}
                                placeholder="e.g. IIT Bombay / IIM Ahmedabad"
                                className={`w-full h-[46px] px-4 text-[14px] bg-white border rounded-[10px] text-slate-800 placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors ${
                                  fieldErrors.institutionName ? 'border-red-400 bg-red-50/10' : 'border-[#CBD5E1]'
                                }`}
                              />
                              {fieldErrors.institutionName && (
                                <p className="text-[12px] text-red-600 font-medium mt-1">
                                  {fieldErrors.institutionName}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Institution type <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={formData.institutionType || 'Government'}
                                onChange={(e) => handleChange('institutionType', e.target.value)}
                                className="w-full h-[46px] px-3 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                              >
                                <option value="Government">Government</option>
                                <option value="Government-aided">Government-aided</option>
                                <option value="Private">Private</option>
                                <option value="Deemed">Deemed</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Current year <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={formData.currentYear || 1}
                                onChange={(e) => handleChange('currentYear', parseInt(e.target.value, 10))}
                                className="w-full h-[46px] px-3 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                              >
                                <option value={1}>1st Year</option>
                                <option value={2}>2nd Year</option>
                                <option value={3}>Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Year of admission <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={formData.admissionYear || 2025}
                                onChange={(e) => handleChange('admissionYear', parseInt(e.target.value, 10))}
                                className="w-full h-[46px] px-3 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                              >
                                {[2026, 2025, 2024, 2023, 2022].map((yr) => (
                                  <option key={yr} value={yr}>{yr}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Study mode <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={formData.studyMode || 'Full-time'}
                                onChange={(e) => handleChange('studyMode', e.target.value)}
                                className="w-full h-[46px] px-3 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                              >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Distance">Distance</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Undergraduate degree <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={formData.undergraduateDegree || ''}
                                onChange={(e) => handleChange('undergraduateDegree', e.target.value)}
                                placeholder="e.g. B.Tech / B.Sc"
                                className={`w-full h-[46px] px-4 text-[14px] bg-white border rounded-[10px] text-slate-800 placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors ${
                                  fieldErrors.undergraduateDegree ? 'border-red-400 bg-red-50/10' : 'border-[#CBD5E1]'
                                }`}
                              />
                              {fieldErrors.undergraduateDegree && (
                                <p className="text-[12px] text-red-600 font-medium mt-1">
                                  {fieldErrors.undergraduateDegree}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                UG CGPA / percentage <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={formData.undergraduateCgpa || ''}
                                onChange={(e) => handleChange('undergraduateCgpa', parseFloat(e.target.value))}
                                placeholder="e.g. 8.2 or 78%"
                                className={`w-full h-[46px] px-4 text-[14px] bg-white border rounded-[10px] text-slate-800 placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors ${
                                  fieldErrors.undergraduateCgpa ? 'border-red-400 bg-red-50/10' : 'border-[#CBD5E1]'
                                }`}
                              />
                              {fieldErrors.undergraduateCgpa && (
                                <p className="text-[12px] text-red-600 font-medium mt-1">
                                  {fieldErrors.undergraduateCgpa}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Current PG CGPA / % <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={formData.cgpa || ''}
                                onChange={(e) => handleChange('cgpa', parseFloat(e.target.value))}
                                placeholder="e.g. 8.70"
                                className={`w-full h-[46px] px-4 text-[14px] bg-white border rounded-[10px] text-slate-800 placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors ${
                                  fieldErrors.cgpa ? 'border-red-400 bg-red-50/10' : 'border-[#CBD5E1]'
                                }`}
                              />
                              {fieldErrors.cgpa && (
                                <p className="text-[12px] text-red-600 font-medium mt-1">
                                  {fieldErrors.cgpa}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 3: FINANCIAL INFORMATION ────────────────────────────────── */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="mb-7">
                      <span className="text-[11.5px] font-bold text-blue-600 tracking-[0.06em] uppercase block">
                        STEP 3 OF 5
                      </span>
                      <h2 className="text-[26px] sm:text-[28px] font-bold text-slate-900 tracking-[-0.02em] mt-1">
                        Financial information
                      </h2>
                      <p className="text-[14px] text-slate-500 mt-1">
                        Details used for income-based and means-tested scholarships.
                      </p>
                    </div>

                    <div className="space-y-5">
                      {/* Annual Family Income */}
                      <div>
                        <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                          Annual family income (INR) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[15px]">
                            ₹
                          </span>
                          <input
                            type="number"
                            value={formData.annualIncome ?? ''}
                            onChange={(e) => {
                              const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                              handleChange('annualIncome', val);
                            }}
                            placeholder="e.g. 220000"
                            className={`w-full h-[46px] pl-8 pr-4 text-[14px] bg-white border rounded-[10px] text-slate-800 placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors ${
                              fieldErrors.annualIncome ? 'border-red-400 bg-red-50/10' : 'border-[#CBD5E1]'
                            }`}
                          />
                        </div>
                        {fieldErrors.annualIncome ? (
                          <p className="text-[12px] text-red-600 font-medium mt-1">
                            {fieldErrors.annualIncome}
                          </p>
                        ) : (
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[13px] font-bold text-blue-600">
                              ₹{formatIndianNumber(formData.annualIncome || 0)} per annum
                            </span>
                            <span className="text-[12px] text-slate-500">
                              ({formatIncomeInWords(formData.annualIncome || 0)})
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Primary Family Income Source */}
                      <div>
                        <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                          Primary family income source <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.incomeSource || 'SALARY'}
                          onChange={(e) => handleChange('incomeSource', e.target.value)}
                          className="w-full h-[46px] px-4 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                        >
                          <option value="SALARY">Salaried</option>
                          <option value="SELF_EMPLOYED">Self-employed</option>
                          <option value="BUSINESS">Business</option>
                          <option value="AGRICULTURE">Agriculture</option>
                          <option value="DAILY_WAGE">Daily wage</option>
                          <option value="PENSION">Pension</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>

                      {/* Father & Mother Occupation */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                            Father / guardian occupation
                          </label>
                          <input
                            type="text"
                            value={formData.fatherOccupation || ''}
                            onChange={(e) => handleChange('fatherOccupation', e.target.value)}
                            placeholder="e.g. Farmer, Private Sector, Teacher"
                            className="w-full h-[46px] px-4 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                            Mother / guardian occupation
                          </label>
                          <input
                            type="text"
                            value={formData.motherOccupation || ''}
                            onChange={(e) => handleChange('motherOccupation', e.target.value)}
                            placeholder="e.g. Homemaker, Nurse, Self-employed"
                            className="w-full h-[46px] px-4 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                          />
                        </div>
                      </div>

                      {/* Family Members Count & Earning Members Count */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                            Number of family members <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={formData.familyMembersCount ?? 4}
                            onChange={(e) => handleChange('familyMembersCount', parseInt(e.target.value, 10))}
                            className={`w-full h-[46px] px-4 text-[14px] bg-white border rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors ${
                              fieldErrors.familyMembersCount ? 'border-red-400 bg-red-50/10' : 'border-[#CBD5E1]'
                            }`}
                          />
                          {fieldErrors.familyMembersCount && (
                            <p className="text-[12px] text-red-600 font-medium mt-1">
                              {fieldErrors.familyMembersCount}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                            Number of earning members <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={formData.earningMembersCount ?? 1}
                            onChange={(e) => handleChange('earningMembersCount', parseInt(e.target.value, 10))}
                            className={`w-full h-[46px] px-4 text-[14px] bg-white border rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors ${
                              fieldErrors.earningMembersCount ? 'border-red-400 bg-red-50/10' : 'border-[#CBD5E1]'
                            }`}
                          />
                          {fieldErrors.earningMembersCount && (
                            <p className="text-[12px] text-red-600 font-medium mt-1">
                              {fieldErrors.earningMembersCount}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Income Certificate Status & Issuing Authority */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                            Income certificate available? <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.incomeCertificateStatus || 'YES'}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleChange('incomeCertificateStatus', val);
                              handleChange('hasIncomeCertificate', val === 'YES');
                            }}
                            className="w-full h-[46px] px-4 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                          >
                            <option value="YES">Yes</option>
                            <option value="NO">No</option>
                            <option value="APPLIED">Applied / Pending</option>
                          </select>
                        </div>

                        {/* CONDITIONAL: Show authority only when income cert is Yes or Applied */}
                        {(formData.incomeCertificateStatus === 'YES' || formData.incomeCertificateStatus === 'APPLIED') && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                              Income certificate issued by
                            </label>
                            <select
                              value={formData.incomeCertIssuedBy || 'Tehsildar'}
                              onChange={(e) => handleChange('incomeCertIssuedBy', e.target.value)}
                              className="w-full h-[46px] px-4 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                            >
                              <option value="Tehsildar">Tehsildar</option>
                              <option value="Revenue / competent authority">Revenue / competent authority</option>
                              <option value="Other">Other</option>
                            </select>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 4: CATEGORY & DOMICILE ──────────────────────────────────── */}
                {currentStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="mb-7">
                      <span className="text-[11.5px] font-bold text-blue-600 tracking-[0.06em] uppercase block">
                        STEP 4 OF 5
                      </span>
                      <h2 className="text-[26px] sm:text-[28px] font-bold text-slate-900 tracking-[-0.02em] mt-1">
                        Category & state of residence
                      </h2>
                      <p className="text-[14px] text-slate-500 mt-1">
                        Information required for applicable state, category and quota-based scholarships.
                      </p>
                    </div>

                    <div className="space-y-5">
                      {/* Social Reservation Category */}
                      <div>
                        <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                          Social category <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                          {[
                            { id: 'GENERAL', label: 'General' },
                            { id: 'OBC', label: 'OBC' },
                            { id: 'SC', label: 'SC' },
                            { id: 'ST', label: 'ST' },
                            { id: 'EWS', label: 'EWS' }
                          ].map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => handleChange('category', cat.id)}
                              className={`py-2.5 px-2 rounded-[10px] text-[13.5px] font-semibold border text-center transition-all cursor-pointer ${
                                formData.category === cat.id
                                  ? 'bg-blue-50/70 border-blue-600 text-blue-950 ring-1 ring-blue-600'
                                  : 'bg-white border-[#CBD5E1] text-slate-700 hover:border-slate-400'
                              }`}
                            >
                              {cat.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* CONDITIONAL CATEGORY FIELDS */}
                      {formData.category === 'OBC' && (
                        <motion.div
                          initial={{ opacity: 0, y: -2 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-[12px] bg-slate-50 border border-slate-200/90 grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                          <div>
                            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                              OBC-NCL status
                            </label>
                            <select
                              value={formData.obcNclStatus || 'YES'}
                              onChange={(e) => handleChange('obcNclStatus', e.target.value)}
                              className="w-full h-[44px] px-3.5 text-[14px] bg-white border border-[#CBD5E1] rounded-[8px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                            >
                              <option value="YES">Yes (Non-Creamy Layer)</option>
                              <option value="NO">No (Creamy Layer)</option>
                              <option value="NA">Not applicable</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                              OBC certificate available?
                            </label>
                            <select
                              value={formData.obcCertStatus || 'YES'}
                              onChange={(e) => handleChange('obcCertStatus', e.target.value)}
                              className="w-full h-[44px] px-3.5 text-[14px] bg-white border border-[#CBD5E1] rounded-[8px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                            >
                              <option value="YES">Yes</option>
                              <option value="NO">No</option>
                              <option value="APPLIED">Applied / Pending</option>
                            </select>
                          </div>
                        </motion.div>
                      )}

                      {formData.category === 'EWS' && (
                        <motion.div
                          initial={{ opacity: 0, y: -2 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-[12px] bg-slate-50 border border-slate-200/90"
                        >
                          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                            EWS certificate available?
                          </label>
                          <select
                            value={formData.ewsCertStatus || 'YES'}
                            onChange={(e) => handleChange('ewsCertStatus', e.target.value)}
                            className="w-full h-[44px] px-3.5 text-[14px] bg-white border border-[#CBD5E1] rounded-[8px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                          >
                            <option value="YES">Yes</option>
                            <option value="NO">No</option>
                            <option value="APPLIED">Applied / Pending</option>
                          </select>
                        </motion.div>
                      )}

                      {(formData.category === 'SC' || formData.category === 'ST') && (
                        <motion.div
                          initial={{ opacity: 0, y: -2 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-[12px] bg-slate-50 border border-slate-200/90"
                        >
                          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                            {formData.category} Caste certificate available?
                          </label>
                          <select
                            value={formData.casteCertStatus || 'YES'}
                            onChange={(e) => handleChange('casteCertStatus', e.target.value)}
                            className="w-full h-[44px] px-3.5 text-[14px] bg-white border border-[#CBD5E1] rounded-[8px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                          >
                            <option value="YES">Yes</option>
                            <option value="NO">No</option>
                            <option value="APPLIED">Applied / Pending</option>
                          </select>
                        </motion.div>
                      )}

                      {/* State of Residence */}
                      <div>
                        <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                          State of Residence <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[12px] text-slate-500 block mb-1.5 font-normal">
                          Select your primary state of residence.
                        </span>
                        <select
                          value={formData.domicileState || 'Maharashtra'}
                          onChange={(e) => handleChange('domicileState', e.target.value)}
                          className="w-full h-[46px] px-4 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                        >
                          {INDIAN_STATES_AND_UTS.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>

                      {/* Domicile Certificate & PIN code */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                            Domicile Certificate available?
                          </label>
                          <select
                            value={formData.domicileCertStatus || 'AVAILABLE'}
                            onChange={(e) => handleChange('domicileCertStatus', e.target.value)}
                            className="w-full h-[46px] px-4 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                          >
                            <option value="AVAILABLE">Yes</option>
                            <option value="NOT_AVAILABLE">No</option>
                            <option value="APPLIED">Applied / Pending</option>
                            <option value="NA">Not applicable</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                            PIN code
                          </label>
                          <input
                            type="text"
                            value={formData.currentPincode || ''}
                            onChange={(e) => handleChange('currentPincode', e.target.value)}
                            placeholder="e.g. 400050"
                            maxLength={6}
                            className={`w-full h-[46px] px-4 text-[14px] bg-white border rounded-[10px] text-slate-800 placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors ${
                              fieldErrors.currentPincode ? 'border-red-400 bg-red-50/10' : 'border-[#CBD5E1]'
                            }`}
                          />
                          {fieldErrors.currentPincode && (
                            <p className="text-[12px] text-red-600 font-medium mt-1">
                              {fieldErrors.currentPincode}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 5: ADDITIONAL INFORMATION ──────────────────────────────── */}
                {currentStep === 5 && (
                  <motion.div
                    key="step-5"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="mb-7">
                      <span className="text-[11.5px] font-bold text-blue-600 tracking-[0.06em] uppercase block">
                        STEP 5 OF 5
                      </span>
                      <h2 className="text-[26px] sm:text-[28px] font-bold text-slate-900 tracking-[-0.02em] mt-1">
                        Additional information
                      </h2>
                      <p className="text-[14px] text-slate-500 mt-1">
                        Other details that may unlock special schemes and document requirements.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Special Eligibility Criteria Cards */}
                      <div>
                        <label className="block text-[13px] font-semibold text-slate-700 mb-2.5">
                          Special eligibility criteria
                        </label>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {[
                            { id: 'hasDisability', title: 'Person with Disability (PwD)' },
                            { id: 'isFarmerFamily', title: 'Farmer / Agricultural Family' },
                            { id: 'isFirstGenLearner', title: 'First-Generation College Student' },
                            { id: 'isExServicemanWard', title: 'Ward of Armed Forces / Ex-Serviceman' },
                            { id: 'isSingleParentHousehold', title: 'Single Parent Household' },
                            { id: 'isOrphan', title: 'Orphan / State Ward' },
                            { id: 'isSingleGirlChild', title: 'Single Girl Child' },
                            { id: 'isMinority', title: 'Minority status (Religious/Linguistic)' }
                          ].map((item) => {
                            const isChecked = Boolean(formData[item.id]);
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => toggleSpecialCondition(item.id)}
                                className={`p-3 px-3.5 rounded-[10px] border text-left cursor-pointer transition-all flex items-center gap-3 ${
                                  isChecked
                                    ? 'bg-blue-50/70 border-blue-600 text-blue-950 ring-1 ring-blue-600 font-semibold'
                                    : 'bg-white border-[#CBD5E1] text-slate-700 hover:border-slate-400'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded flex items-center justify-center text-xs flex-shrink-0 transition-colors ${
                                    isChecked
                                      ? 'bg-blue-600 text-white'
                                      : 'border border-slate-300 bg-white'
                                  }`}
                                >
                                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span className="text-[13px] font-medium leading-tight">{item.title}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* CONDITIONAL QUESTIONS FOR SPECIAL CRITERIA */}
                      {formData.hasDisability && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="p-4 rounded-[12px] bg-slate-50 border border-slate-200/90 space-y-3"
                        >
                          <span className="text-[12px] font-bold text-blue-600 uppercase tracking-wider block">
                            Disability Details
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Disability percentage (%) <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="100"
                                value={formData.disabilityPercentage || ''}
                                onChange={(e) => handleChange('disabilityPercentage', parseFloat(e.target.value))}
                                placeholder="e.g. 40"
                                className={`w-full h-[44px] px-3.5 text-[14px] bg-white border rounded-[8px] text-slate-800 placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors ${
                                  fieldErrors.disabilityPercentage ? 'border-red-400 bg-red-50/10' : 'border-[#CBD5E1]'
                                }`}
                              />
                              {fieldErrors.disabilityPercentage && (
                                <p className="text-[12px] text-red-600 font-medium mt-1">
                                  {fieldErrors.disabilityPercentage}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Disability certificate available?
                              </label>
                              <select
                                value={formData.disabilityCertStatus || 'YES'}
                                onChange={(e) => handleChange('disabilityCertStatus', e.target.value)}
                                className="w-full h-[44px] px-3.5 text-[14px] bg-white border border-[#CBD5E1] rounded-[8px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                              >
                                <option value="YES">Yes</option>
                                <option value="NO">No</option>
                                <option value="APPLIED">Applied / Pending</option>
                              </select>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {formData.isExServicemanWard && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="p-4 rounded-[12px] bg-slate-50 border border-slate-200/90 space-y-3"
                        >
                          <span className="text-[12px] font-bold text-blue-600 uppercase tracking-wider block">
                            Armed Forces / ESM Status
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Parent/guardian service status
                              </label>
                              <select
                                value={formData.exServicemanServiceStatus || 'Ex-Serviceman'}
                                onChange={(e) => handleChange('exServicemanServiceStatus', e.target.value)}
                                className="w-full h-[44px] px-3.5 text-[14px] bg-white border border-[#CBD5E1] rounded-[8px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                              >
                                <option value="Ex-Serviceman">Ex-Serviceman</option>
                                <option value="In-Service Personnel">In-Service Personnel</option>
                                <option value="Gallantry Award Winner">Gallantry Award Winner</option>
                                <option value="Disabled / Martyr in Action">Disabled / Martyr in Action</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Supporting document available?
                              </label>
                              <select
                                value={formData.exServicemanDocStatus || 'YES'}
                                onChange={(e) => handleChange('exServicemanDocStatus', e.target.value)}
                                className="w-full h-[44px] px-3.5 text-[14px] bg-white border border-[#CBD5E1] rounded-[8px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                              >
                                <option value="YES">Yes</option>
                                <option value="NO">No</option>
                                <option value="APPLIED">Applied / Pending</option>
                              </select>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {formData.isOrphan && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="p-4 rounded-[12px] bg-slate-50 border border-slate-200/90"
                        >
                          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                            Orphan / State ward supporting document available?
                          </label>
                          <select
                            value={formData.orphanDocStatus || 'YES'}
                            onChange={(e) => handleChange('orphanDocStatus', e.target.value)}
                            className="w-full h-[44px] px-3.5 text-[14px] bg-white border border-[#CBD5E1] rounded-[8px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                          >
                            <option value="YES">Yes</option>
                            <option value="NO">No</option>
                            <option value="APPLIED">Applied / Pending</option>
                          </select>
                        </motion.div>
                      )}

                      {formData.isSingleGirlChild && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="p-4 rounded-[12px] bg-slate-50 border border-slate-200/90"
                        >
                          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                            Single girl child supporting proof available?
                          </label>
                          <select
                            value={formData.singleGirlChildProofStatus || 'YES'}
                            onChange={(e) => handleChange('singleGirlChildProofStatus', e.target.value)}
                            className="w-full h-[44px] px-3.5 text-[14px] bg-white border border-[#CBD5E1] rounded-[8px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                          >
                            <option value="YES">Yes</option>
                            <option value="NO">No</option>
                            <option value="APPLIED">Applied / Pending</option>
                          </select>
                        </motion.div>
                      )}

                      {formData.isMinority && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="p-4 rounded-[12px] bg-slate-50 border border-slate-200/90 grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                          <div>
                            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                              Minority category
                            </label>
                            <select
                              value={formData.minorityCommunity || 'Muslim'}
                              onChange={(e) => handleChange('minorityCommunity', e.target.value)}
                              className="w-full h-[44px] px-3.5 text-[14px] bg-white border border-[#CBD5E1] rounded-[8px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                            >
                              <option value="Muslim">Muslim</option>
                              <option value="Christian">Christian</option>
                              <option value="Sikh">Sikh</option>
                              <option value="Buddhist">Buddhist</option>
                              <option value="Jain">Jain</option>
                              <option value="Parsi">Parsi</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                              Supporting document available?
                            </label>
                            <select
                              value={formData.minorityDocStatus || 'YES'}
                              onChange={(e) => handleChange('minorityDocStatus', e.target.value)}
                              className="w-full h-[44px] px-3.5 text-[14px] bg-white border border-[#CBD5E1] rounded-[8px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                            >
                              <option value="YES">Yes</option>
                              <option value="NO">No</option>
                              <option value="APPLIED">Applied / Pending</option>
                            </select>
                          </div>
                        </motion.div>
                      )}

                      {/* SCHOLARSHIP STATUS & APPLICATION TYPE */}
                      <div className="pt-2 border-t border-slate-100 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                              Currently receiving any other scholarship?
                            </label>
                            <select
                              value={formData.isCurrentlyReceivingScholarship ? 'YES' : 'NO'}
                              onChange={(e) => handleChange('isCurrentlyReceivingScholarship', e.target.value === 'YES')}
                              className="w-full h-[46px] px-4 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                            >
                              <option value="NO">No</option>
                              <option value="YES">Yes</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                              Application type <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={formData.applicationType || 'FRESH'}
                              onChange={(e) => handleChange('applicationType', e.target.value)}
                              className="w-full h-[46px] px-4 text-[14px] bg-white border border-[#CBD5E1] rounded-[10px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                            >
                              <option value="FRESH">Fresh applicant</option>
                              <option value="RENEWAL">Renewal applicant</option>
                            </select>
                          </div>
                        </div>

                        {formData.isCurrentlyReceivingScholarship && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-4 rounded-[12px] bg-slate-50 border border-slate-200/90 grid grid-cols-1 sm:grid-cols-2 gap-4"
                          >
                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Scholarship name
                              </label>
                              <input
                                type="text"
                                value={formData.currentScholarshipName || ''}
                                onChange={(e) => handleChange('currentScholarshipName', e.target.value)}
                                placeholder="e.g. MahaDBT Post Matric Scholarship"
                                className="w-full h-[44px] px-3.5 text-[14px] bg-white border border-[#CBD5E1] rounded-[8px] text-slate-800 placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                              />
                            </div>

                            <div>
                              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                                Scholarship provider / type
                              </label>
                              <select
                                value={formData.currentScholarshipProvider || 'State Govt'}
                                onChange={(e) => handleChange('currentScholarshipProvider', e.target.value)}
                                className="w-full h-[44px] px-3.5 text-[14px] bg-white border border-[#CBD5E1] rounded-[8px] text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
                              >
                                <option value="Central Govt">Central Government</option>
                                <option value="State Govt">State Government</option>
                                <option value="Private / Corporate CSR">Private / Corporate CSR</option>
                                <option value="College / University">College / University</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* DOCUMENT READINESS SECTION (OPTIONAL & NON-BLOCKING) */}
                      <div className="pt-3 border-t border-slate-100">
                        <div className="mb-3">
                          <label className="block text-[13.5px] font-bold text-slate-900">
                            Document Readiness
                          </label>
                          <p className="text-[12px] text-slate-500 mt-0.5">
                            Optional — let us know which documents you already have. You will upload required documents on the official scholarship portal when you apply.
                          </p>
                        </div>
                        
                        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                          {dynamicDocuments.map((doc) => {
                            const currentStatus = (formData.documentStatuses || {})[doc.id] || (formData.uploadedFiles?.[doc.id] ? 'YES' : 'NOT_SURE');
                            
                            return (
                              <div
                                key={doc.id}
                                className={`p-3 px-3.5 rounded-[12px] border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px] ${
                                  currentStatus === 'YES' 
                                    ? 'bg-emerald-50/50 border-emerald-200 shadow-2xs' 
                                    : 'bg-slate-50/80 border-slate-200'
                                }`}
                              >
                                <div className="flex items-start gap-2.5 min-w-0">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                    currentStatus === 'YES' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200/70 text-slate-500'
                                  }`}>
                                    {currentStatus === 'YES' ? (
                                      <FileCheck className="w-4 h-4" />
                                    ) : (
                                      <FileText className="w-4 h-4" />
                                    )}
                                  </div>

                                  <div className="min-w-0">
                                    <span className="text-slate-900 font-semibold block truncate">
                                      {doc.name}
                                    </span>
                                    <span className="text-[11.5px] text-slate-500 block truncate mt-0.5">
                                      {currentStatus === 'YES' ? '✓ Marked as available' : currentStatus === 'NO' ? '✕ Not available yet' : 'Not sure / to be arranged'}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-1.5 self-end sm:self-center flex-shrink-0">
                                  {[
                                    { id: 'YES', label: 'Yes' },
                                    { id: 'NO', label: 'No' },
                                    { id: 'NOT_SURE', label: 'Not Sure' }
                                  ].map((opt) => (
                                    <button
                                      key={opt.id}
                                      type="button"
                                      onClick={() => {
                                        const currentStatuses = { ...(formData.documentStatuses || {}) };
                                        currentStatuses[doc.id] = opt.id;
                                        setFormData((prev) => ({
                                          ...prev,
                                          documentStatuses: currentStatuses
                                        }));
                                      }}
                                      className={`px-3 py-1 rounded-lg text-[12px] font-bold border transition-all cursor-pointer ${
                                        currentStatus === opt.id
                                          ? opt.id === 'YES'
                                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                                            : opt.id === 'NO'
                                            ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                                            : 'bg-slate-700 border-slate-700 text-white shadow-xs'
                                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                                      }`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 6: PROFILE SUMMARY (FINAL REVIEW) ───────────────────────── */}
                {currentStep === 6 && (
                  <motion.div
                    key="step-6"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="mb-6">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                      <h2 className="text-[26px] sm:text-[28px] font-bold text-slate-900 tracking-[-0.02em]">
                        Profile complete
                      </h2>
                      <p className="text-[14px] text-slate-500 mt-1">
                        You're ready to find scholarships that match your profile.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          step: 1,
                          title: 'Personal details',
                          desc: `${formData.fullName || 'Student'} • ${formData.gender || 'Male'} • ${formData.nationality || 'Indian'} • ${formData.email || ''}`
                        },
                        {
                          step: 2,
                          title: 'Academic background',
                          desc: `${formData.educationLevel === 'TWELFTH_COMPLETED' ? '12th Passed' : (formData.course || 'Degree')} • ${formData.class12Percentage || formData.diplomaScore || 0}% Class 12 / Score • ${formData.institutionName || 'Institution'}`
                        },
                        {
                          step: 3,
                          title: 'Financial information',
                          desc: `₹${formatIndianNumber(formData.annualIncome || 0)} / year (${formatIncomeInWords(formData.annualIncome || 0)}) • ${formData.incomeSource || 'Salaried'}`
                        },
                        {
                          step: 4,
                          title: 'Category & state of residence',
                          desc: `${formData.category || 'General'}${formData.obcNclStatus === 'YES' ? ' (NCL)' : ''} • ${formData.domicileState || 'State'}`
                        },
                        {
                          step: 5,
                          title: 'Additional information',
                          desc: `${formData.applicationType === 'RENEWAL' ? 'Renewal Applicant' : 'Fresh Applicant'} • ${Object.values(formData.documentStatuses || {}).filter(s => s === 'YES' || s === 'READY').length} of ${dynamicDocuments.length} documents ready`
                        }
                      ].map((item) => (
                        <div
                          key={item.step}
                          className="p-3.5 px-4 rounded-[10px] border border-slate-200 bg-slate-50/70 flex items-center justify-between text-[13.5px]"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-semibold text-slate-900 block">
                              {item.title}
                            </span>
                            <span className="text-slate-500 text-[12px] truncate block">
                              {item.desc}
                            </span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => jumpToStep(item.step)}
                            className="text-[12.5px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer flex-shrink-0"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* ── FORM FOOTER & NAVIGATION ACTIONS ──────────────────────────────── */}
              <div className="pt-6 mt-8 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-[14px] font-medium text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer py-2 px-2.5 rounded-md hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={isSaving}
                  className="min-w-[124px] h-[46px] px-5 rounded-[10px] bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-[14px] font-semibold inline-flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer hover:shadow"
                >
                  <span>{isSaving ? 'Saving...' : (currentStep === 5 ? 'Find Scholarships →' : 'Continue →')}</span>
                </button>
              </div>

            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
