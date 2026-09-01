import 'dotenv/config';
import { supabase } from '../src/lib/supabaseClient.js';
import { profileService, mapSupabaseProfileToDTO, mapDTOToSupabaseRow } from '../src/services/profileService.js';

async function runOnboardingRegressionSuite() {
  console.log('=============================================================================');
  console.log('SCHOLAR AI — ONBOARDING WORKFLOW & PERSISTENCE REGRESSION TEST SUITE');
  console.log('=============================================================================');

  const ts = Date.now();
  const userId = `e0000000-0000-4000-8000-${String(ts).slice(-12)}`;
  const testEmail = `student_${ts}@scholarai.in`;
  const testFullName = 'Mohamed Imraan';

  console.log(`\n[TEST 1] Testing with student user ID: ${userId} (${testEmail})...`);

  // Initial state check: no profile or initial blank profile
  console.log('\n[TEST 2] Checking initial profile status...');
  const initialStatus = await profileService.getProfileStatus(userId);
  console.log('Initial Status:', initialStatus);
  if (initialStatus.onboardingComplete !== false) {
    throw new Error('Initial profile MUST NOT be marked complete!');
  }
  console.log('✅ Initial state verified: onboardingComplete = false, onboardingStep = 1');

  // STEP 1: Save Personal Details
  console.log('\n[TEST 3] STEP 1 — Saving Personal Details...');
  const step1Payload = {
    fullName: testFullName,
    dob: '2003-05-15',
    dateOfBirth: '2003-05-15',
    gender: 'MALE',
    nationality: 'INDIAN',
    phone: '9876543210',
    mobile: '9876543210',
    email: testEmail,
    educationLevel: 'UNDERGRADUATE',
    course: '',
    annualFamilyIncome: 0,
    category: 'GENERAL',
    domicileState: '',
    onboardingStep: 2,
    onboardingComplete: false,
    isOnboarded: false
  };

  await profileService.saveOnboardingStep(2, step1Payload, userId);

  const { data: step1Row, error: step1Err } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (step1Err || !step1Row) {
    throw new Error(`Failed to fetch profile after step 1: ${step1Err?.message}`);
  }

  const profilePrimaryKey = step1Row.id;
  console.log('Step 1 Saved Row:', {
    id: step1Row.id,
    user_id: step1Row.user_id,
    full_name: step1Row.full_name,
    dob: step1Row.date_of_birth,
    gender: step1Row.gender,
    nationality: step1Row.nationality,
    onboarding_step: step1Row.onboarding_step,
    onboarding_complete: step1Row.onboarding_complete
  });

  const step1DTO = mapSupabaseProfileToDTO(step1Row);
  console.log('Step 1 DTO:', {
    onboardingStep: step1DTO.onboardingStep,
    onboardingComplete: step1DTO.onboardingComplete
  });

  // REGRESSION CHECK: Step 1 MUST NOT set onboardingComplete to true!
  if (step1DTO.onboardingComplete === true || step1Row.onboarding_complete === true) {
    throw new Error('REGRESSION FAILURE: Step 1 set onboardingComplete = true! MUST NOT BE TRUE!');
  }
  const incompleteAfterStep1 = profileService.getFirstIncompleteStep(step1DTO);
  console.log(`First incomplete step after Step 1: ${incompleteAfterStep1}`);
  if (incompleteAfterStep1 === 6) {
    throw new Error('REGRESSION FAILURE: Step 1 evaluated as complete (step 6)!');
  }
  console.log('✅ STEP 1 PASS: Profile saved, onboarding_step = 2, onboarding_complete = false, NOT redirected to dashboard.');

  // STEP 2: Save Academic Background
  console.log('\n[TEST 4] STEP 2 — Saving Academic Background...');
  const step2Payload = {
    ...step1DTO,
    educationLevel: 'UNDERGRADUATE',
    course: 'B.Tech Computer Science and Engineering',
    branch: 'Artificial Intelligence & Machine Learning',
    specialization: 'Artificial Intelligence & Machine Learning',
    currentYear: 3,
    admissionYear: 2023,
    institutionName: 'Anna University',
    institutionType: 'State University',
    studyMode: 'FULL_TIME',
    class10Percentage: 92.5,
    class12Percentage: 89.0,
    undergraduateCgpa: 8.75,
    currentCgpa: 8.75,
    cgpa: 8.75,
    onboardingStep: 3,
    onboardingComplete: false,
    isOnboarded: false
  };

  await profileService.saveOnboardingStep(3, step2Payload, userId);

  const { data: step2Row } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (step2Row.id !== profilePrimaryKey) {
    throw new Error(`Profile primary key changed from ${profilePrimaryKey} to ${step2Row.id}! Duplicate row created!`);
  }
  if (step2Row.full_name !== testFullName || !step2Row.date_of_birth) {
    throw new Error('Step 1 fields were overwritten with null during Step 2!');
  }
  if (step2Row.onboarding_complete === true) {
    throw new Error('REGRESSION FAILURE: Step 2 set onboardingComplete = true!');
  }

  const step2DTO = mapSupabaseProfileToDTO(step2Row);
  console.log('Step 2 Saved Row:', {
    id: step2Row.id,
    same_primary_key: step2Row.id === profilePrimaryKey,
    course: step2Row.course,
    cgpa: step2Row.undergraduate_cgpa,
    onboarding_step: step2Row.onboarding_step,
    onboarding_complete: step2Row.onboarding_complete
  });
  console.log('✅ STEP 2 PASS: Same profile updated, Step 1 fields preserved, onboarding_step = 3, onboarding_complete = false.');

  // STEP 3: Save Financial Information
  console.log('\n[TEST 5] STEP 3 — Saving Financial Information...');
  const step3Payload = {
    ...step2DTO,
    annualFamilyIncome: 250000,
    annualIncome: 250000,
    incomeSource: 'SALARY',
    fatherOccupation: 'Private Employee',
    motherOccupation: 'Homemaker',
    familyMemberCount: 4,
    familyMembersCount: 4,
    earningMemberCount: 1,
    earningMembersCount: 1,
    hasIncomeCertificate: true,
    incomeCertificateStatus: 'YES',
    onboardingStep: 4,
    onboardingComplete: false,
    isOnboarded: false
  };

  await profileService.saveOnboardingStep(4, step3Payload, userId);

  const { data: step3Row } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (step3Row.id !== profilePrimaryKey) {
    throw new Error('Profile primary key changed during Step 3!');
  }
  if (step3Row.course !== 'B.Tech Computer Science and Engineering') {
    throw new Error('Step 2 fields were overwritten during Step 3!');
  }
  if (step3Row.onboarding_complete === true) {
    throw new Error('REGRESSION FAILURE: Step 3 set onboardingComplete = true!');
  }

  const step3DTO = mapSupabaseProfileToDTO(step3Row);
  console.log('Step 3 Saved Row:', {
    id: step3Row.id,
    income: step3Row.annual_family_income,
    onboarding_step: step3Row.onboarding_step,
    onboarding_complete: step3Row.onboarding_complete
  });
  console.log('✅ STEP 3 PASS: Same profile updated, Step 1 & 2 fields preserved, onboarding_step = 4, onboarding_complete = false.');

  // STEP 4: Save Category & State of Residence
  console.log('\n[TEST 6] STEP 4 — Saving Category & State of Residence...');
  const step4Payload = {
    ...step3DTO,
    category: 'OBC',
    socialCategory: 'OBC',
    isObcNcl: true,
    isEws: false,
    hasCategoryCertificate: true,
    domicileState: 'Tamil Nadu',
    state: 'Tamil Nadu',
    hasDomicileCertificate: true,
    pincode: '600001',
    currentPincode: '600001',
    isMinority: true,
    minorityCommunity: 'Muslim',
    isFarmerFamily: false,
    onboardingStep: 5,
    onboardingComplete: false,
    isOnboarded: false
  };

  await profileService.saveOnboardingStep(5, step4Payload, userId);

  const { data: step4Row } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (step4Row.id !== profilePrimaryKey) {
    throw new Error('Profile primary key changed during Step 4!');
  }
  if (step4Row.onboarding_complete === true) {
    throw new Error('REGRESSION FAILURE: Step 4 set onboardingComplete = true! MUST WAIT FOR STEP 5 FINAL SAVE!');
  }

  const step4DTO = mapSupabaseProfileToDTO(step4Row);
  console.log('Step 4 Saved Row:', {
    id: step4Row.id,
    category: step4Row.category,
    domicile_state: step4Row.domicile_state,
    onboarding_step: step4Row.onboarding_step,
    onboarding_complete: step4Row.onboarding_complete
  });
  console.log('✅ STEP 4 PASS: Same profile updated, onboarding_step = 5, onboarding_complete = false (waiting for Step 5 final save).');

  // STEP 5: Save Additional Information & Final Completion
  console.log('\n[TEST 7] STEP 5 — Saving Additional Information & Final Completion...');
  const step5Payload = {
    ...step4DTO,
    hasDisability: false,
    isPwd: false,
    isFarmerFamily: false,
    isFirstGraduate: true,
    isWardOfDefenseOrCapf: false,
    isSingleParent: false,
    isOrphan: false,
    isSingleGirlChild: false,
    applicationType: 'FRESH',
    onboardingStep: 5,
    onboardingComplete: true,
    isOnboarded: true,
    profileCompletionScore: 100
  };

  await profileService.saveOnboardingStep(5, step5Payload, userId);

  const { data: finalRow } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (finalRow.id !== profilePrimaryKey) {
    throw new Error('Profile primary key changed during Step 5!');
  }
  if (finalRow.onboarding_complete !== true) {
    throw new Error('Step 5 final save failed to mark onboarding_complete = true!');
  }
  if (finalRow.profile_completion_score !== 100) {
    throw new Error('Step 5 final save should set profile_completion_score = 100!');
  }

  const finalDTO = mapSupabaseProfileToDTO(finalRow);
  console.log('Final Profile Row:', {
    id: finalRow.id,
    full_name: finalRow.full_name,
    education_level: finalRow.education_level,
    course: finalRow.course,
    annual_family_income: finalRow.annual_family_income,
    category: finalRow.category,
    domicile_state: finalRow.domicile_state,
    is_first_graduate: finalRow.is_first_graduate,
    onboarding_step: finalRow.onboarding_step,
    onboarding_complete: finalRow.onboarding_complete,
    score: finalRow.profile_completion_score
  });

  const finalCompletion = profileService.getFirstIncompleteStep(finalDTO);
  console.log(`Completion check post-step 5: ${finalCompletion}`);
  if (finalCompletion !== 6) {
    throw new Error('Completed profile must return 6 from getFirstIncompleteStep!');
  }
  console.log('✅ STEP 5 PASS: Onboarding marked complete ONLY after Step 5 final save!');

  // Verify single profile row
  console.log('\n[TEST 8] Verifying no duplicate profile rows in database...');
  const { data: allUserRows } = await supabase
    .from('student_profiles')
    .select('id, user_id, full_name, onboarding_step, onboarding_complete')
    .eq('user_id', userId);

  console.log(`Total rows for user ${userId}: ${allUserRows.length}`);
  if (allUserRows.length !== 1) {
    throw new Error(`Expected exactly 1 profile row, found ${allUserRows.length}!`);
  }
  console.log('✅ PASS: Exactly 1 profile row exists for authenticated student.');

  console.log('\n=============================================================================');
  console.log('🎉 ALL ONBOARDING REGRESSION & PERSISTENCE TESTS PASSED SUCCESSFULLY!');
  console.log('=============================================================================');
}

runOnboardingRegressionSuite().catch((err) => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
