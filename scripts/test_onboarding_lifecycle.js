import 'dotenv/config';
import { supabase } from '../src/lib/supabaseClient.js';
import { authService } from '../src/services/authService.js';
import { profileService, mapSupabaseProfileToDTO, mapDTOToSupabaseRow } from '../src/services/profileService.js';

async function testLifecycle() {
  const ts = Date.now();
  const testEmail = `student_${ts}@scholar.test`;
  const testPassword = 'Password123!';
  const testName = 'Mohamed Imraan';

  console.log('=== TESTING ONBOARDING LIFECYCLE FOR NEW USER ===');
  console.log('Email:', testEmail);

  // 1. Sign Up via RPC
  const { data: rpcData, error: rpcError } = await supabase.rpc('register_student_account', {
    p_email: testEmail,
    p_password: testPassword,
    p_full_name: testName
  });
  console.log('RPC Register result:', rpcData, rpcError);

  const { data: signData, error: signError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword
  });
  console.log('SignIn result:', signData?.user?.id, signError?.message);
  const userId = signData.user.id;

  // Check profile immediately after signup
  const { data: initialRow } = await supabase.from('student_profiles').select('*').eq('user_id', userId).single();
  console.log('Post-signup profile row:', {
    id: initialRow?.id,
    user_id: initialRow?.user_id,
    full_name: initialRow?.full_name,
    onboarding_step: initialRow?.onboarding_step,
    onboarding_complete: initialRow?.onboarding_complete
  });

  const dto0 = mapSupabaseProfileToDTO(initialRow);
  console.log('DTO 0 onboardingComplete:', dto0.onboardingComplete, 'onboardingStep:', dto0.onboardingStep);
  const firstIncomplete0 = profileService.getFirstIncompleteStep(dto0);
  console.log('First incomplete step post-signup:', firstIncomplete0);

  // STEP 1: Save Personal Details
  console.log('\n--- SAVING STEP 1 ---');
  const step1Data = {
    ...dto0,
    fullName: 'Mohamed Imraan',
    dob: '2003-05-15',
    dateOfBirth: '2003-05-15',
    gender: 'MALE',
    nationality: 'INDIAN',
    phone: '9876543210',
    mobile: '9876543210',
    email: testEmail,
    onboardingStep: 2,
    onboardingComplete: false,
    isOnboarded: false
  };

  await profileService.saveOnboardingStep(2, step1Data, userId);

  const { data: step1Row } = await supabase.from('student_profiles').select('*').eq('user_id', userId).single();
  console.log('Post-step1 profile row:', {
    id: step1Row?.id,
    same_id: step1Row?.id === initialRow?.id,
    user_id: step1Row?.user_id,
    full_name: step1Row?.full_name,
    dob: step1Row?.date_of_birth,
    gender: step1Row?.gender,
    nationality: step1Row?.nationality,
    onboarding_step: step1Row?.onboarding_step,
    onboarding_complete: step1Row?.onboarding_complete
  });

  const dto1 = mapSupabaseProfileToDTO(step1Row);
  console.log('DTO 1 onboardingComplete:', dto1.onboardingComplete, 'onboardingStep:', dto1.onboardingStep);
  const firstIncomplete1 = profileService.getFirstIncompleteStep(dto1);
  console.log('First incomplete step post-step1:', firstIncomplete1);

  // STEP 2: Save Academic Background
  console.log('\n--- SAVING STEP 2 ---');
  const step2Data = {
    ...dto1,
    educationLevel: 'UNDERGRADUATE',
    course: 'B.Tech Computer Science and Engineering',
    branch: 'Artificial Intelligence & Machine Learning',
    specialization: 'Artificial Intelligence & Machine Learning',
    currentYear: 3,
    admissionYear: 2023,
    institutionName: 'Anna University',
    institutionType: 'State University',
    studyMode: 'FULL_TIME',
    class10Percentage: 91.5,
    class12Percentage: 88.0,
    undergraduateCgpa: 8.5,
    currentCgpa: 8.5,
    cgpa: 8.5,
    onboardingStep: 3,
    onboardingComplete: false,
    isOnboarded: false
  };

  await profileService.saveOnboardingStep(3, step2Data, userId);

  const { data: step2Row } = await supabase.from('student_profiles').select('*').eq('user_id', userId).single();
  console.log('Post-step2 profile row:', {
    id: step2Row?.id,
    same_id: step2Row?.id === initialRow?.id,
    course: step2Row?.course,
    cgpa: step2Row?.undergraduate_cgpa,
    onboarding_step: step2Row?.onboarding_step,
    onboarding_complete: step2Row?.onboarding_complete
  });

  const dto2 = mapSupabaseProfileToDTO(step2Row);
  console.log('DTO 2 onboardingComplete:', dto2.onboardingComplete, 'onboardingStep:', dto2.onboardingStep);
  const firstIncomplete2 = profileService.getFirstIncompleteStep(dto2);
  console.log('First incomplete step post-step2:', firstIncomplete2);

  // STEP 3: Save Financial Information
  console.log('\n--- SAVING STEP 3 ---');
  const step3Data = {
    ...dto2,
    annualFamilyIncome: 300000,
    annualIncome: 300000,
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

  await profileService.saveOnboardingStep(4, step3Data, userId);

  const { data: step3Row } = await supabase.from('student_profiles').select('*').eq('user_id', userId).single();
  console.log('Post-step3 profile row:', {
    id: step3Row?.id,
    same_id: step3Row?.id === initialRow?.id,
    income: step3Row?.annual_family_income,
    onboarding_step: step3Row?.onboarding_step,
    onboarding_complete: step3Row?.onboarding_complete
  });

  const dto3 = mapSupabaseProfileToDTO(step3Row);
  console.log('DTO 3 onboardingComplete:', dto3.onboardingComplete, 'onboardingStep:', dto3.onboardingStep);
  const firstIncomplete3 = profileService.getFirstIncompleteStep(dto3);
  console.log('First incomplete step post-step3:', firstIncomplete3);

  // STEP 4: Save Category & State of Residence
  console.log('\n--- SAVING STEP 4 ---');
  const step4Data = {
    ...dto3,
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

  await profileService.saveOnboardingStep(5, step4Data, userId);

  const { data: step4Row } = await supabase.from('student_profiles').select('*').eq('user_id', userId).single();
  console.log('Post-step4 profile row:', {
    id: step4Row?.id,
    same_id: step4Row?.id === initialRow?.id,
    category: step4Row?.category,
    state: step4Row?.domicile_state,
    onboarding_step: step4Row?.onboarding_step,
    onboarding_complete: step4Row?.onboarding_complete
  });

  const dto4 = mapSupabaseProfileToDTO(step4Row);
  console.log('DTO 4 onboardingComplete:', dto4.onboardingComplete, 'onboardingStep:', dto4.onboardingStep);
  const firstIncomplete4 = profileService.getFirstIncompleteStep(dto4);
  console.log('First incomplete step post-step4:', firstIncomplete4);

  // STEP 5: Save Additional Information & Complete
  console.log('\n--- SAVING STEP 5 (FINAL) ---');
  const step5Data = {
    ...dto4,
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

  await profileService.saveOnboardingStep(5, step5Data, userId);

  const { data: finalRow } = await supabase.from('student_profiles').select('*').eq('user_id', userId).single();
  console.log('Final profile row:', {
    id: finalRow?.id,
    same_id: finalRow?.id === initialRow?.id,
    first_graduate: finalRow?.is_first_graduate,
    onboarding_step: finalRow?.onboarding_step,
    onboarding_complete: finalRow?.onboarding_complete,
    score: finalRow?.profile_completion_score
  });

  const finalDto = mapSupabaseProfileToDTO(finalRow);
  console.log('Final DTO onboardingComplete:', finalDto.onboardingComplete, 'onboardingStep:', finalDto.onboardingStep);
  const firstIncompleteFinal = profileService.getFirstIncompleteStep(finalDto);
  console.log('First incomplete step post-step5:', firstIncompleteFinal);
}

testLifecycle().catch(console.error);
