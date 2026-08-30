import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:Luckychamp%40007@db.gixgyrsyopwtfgxvfglp.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();

  console.log('================================================================');
  console.log('TEST 1: MULTI-USER DYNAMIC DASHBOARD ISOLATION & ACCURACY TEST');
  console.log('================================================================');

  const userAId = 'a0000000-0000-0000-0000-000000000001';
  const userBId = 'b0000000-0000-0000-0000-000000000002';

  // Clean test profiles and applications if existing
  await client.query('DELETE FROM student_applications WHERE student_id IN ($1, $2)', [userAId, userBId]);
  await client.query('DELETE FROM bookmarks WHERE user_id IN ($1, $2)', [userAId, userBId]);
  await client.query('DELETE FROM student_profiles WHERE user_id IN ($1, $2)', [userAId, userBId]);

  // Insert User A: Arun Kumar (Tamil Nadu, OBC, B.Tech, Income 200000, CGPA 8.5)
  console.log('\n--- Setting up User A: Arun Kumar ---');
  await fetch('http://localhost:8000/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-User-Id': userAId },
    body: JSON.stringify({
      fullName: 'Arun Kumar',
      email: 'arun.kumar@scholarai.in',
      phone: '9876543210',
      gender: 'MALE',
      educationLevel: 'UNDERGRADUATE',
      course: 'B.Tech AI & DS',
      institutionName: 'Anna University',
      currentYear: 2,
      class12Percentage: 88,
      cgpa: 8.5,
      annualFamilyIncome: 200000,
      incomeSource: 'SALARY',
      category: 'OBC',
      domicileState: 'Tamil Nadu',
      applicationType: 'FRESH',
      onboardingComplete: true,
      onboardingStep: 5
    })
  });

  // Insert User B: Priya Sharma (Karnataka, General, B.Com, Income 800000, CGPA 7.1)
  console.log('\n--- Setting up User B: Priya Sharma ---');
  await fetch('http://localhost:8000/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-User-Id': userBId },
    body: JSON.stringify({
      fullName: 'Priya Sharma',
      email: 'priya.sharma@scholarai.in',
      phone: '9123456780',
      gender: 'FEMALE',
      educationLevel: 'UNDERGRADUATE',
      course: 'B.Com',
      institutionName: 'Bangalore University',
      currentYear: 1,
      class12Percentage: 75,
      cgpa: 7.1,
      annualFamilyIncome: 800000,
      incomeSource: 'BUSINESS',
      category: 'GENERAL',
      domicileState: 'Karnataka',
      applicationType: 'FRESH',
      onboardingComplete: true,
      onboardingStep: 5
    })
  });

  // Fetch Dashboard Summaries for User A and User B
  const resSummaryA = await fetch('http://localhost:8000/api/dashboard/summary', {
    headers: { 'X-User-Id': userAId }
  });
  const jsonA = await resSummaryA.json();
  const summaryA = jsonA.data;

  const resSummaryB = await fetch('http://localhost:8000/api/dashboard/summary', {
    headers: { 'X-User-Id': userBId }
  });
  const jsonB = await resSummaryB.json();
  const summaryB = jsonB.data;

  console.log('\nSummary for User A (Arun Kumar):', summaryA);
  console.log('Summary for User B (Priya Sharma):', summaryB);

  // Assertions
  if (summaryA.activeApplications !== 0 || summaryB.activeApplications !== 0) {
    throw new Error('Applications count for clean profiles must be 0!');
  }
  if (summaryA.savedScholarships !== 0 || summaryB.savedScholarships !== 0) {
    throw new Error('Saved scholarships count for clean profiles must be 0!');
  }
  if (summaryA.profileCompletion < 80 || summaryB.profileCompletion < 80) {
    throw new Error('Completed profile score should be >= 80%!');
  }

  console.log('✓ PASS: Both users start with 0 applications, 0 bookmarks, and dynamically calculated profile completion scores.');

  console.log('\n--- User A applies for 1 scholarship and bookmarks 1 scholarship ---');
  await fetch('http://localhost:8000/api/applications/nsp-pm-usp-csss', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-User-Id': userAId },
    body: JSON.stringify({ status: 'APPLIED' })
  });
  await fetch('http://localhost:8000/api/bookmarks/nsp-pm-usp-csss', {
    method: 'POST',
    headers: { 'X-User-Id': userAId }
  });

  const updatedSummaryA = (await (await fetch('http://localhost:8000/api/dashboard/summary', { headers: { 'X-User-Id': userAId } })).json()).data;
  const updatedSummaryB = (await (await fetch('http://localhost:8000/api/dashboard/summary', { headers: { 'X-User-Id': userBId } })).json()).data;

  console.log('Updated User A summary:', updatedSummaryA);
  console.log('Updated User B summary (should remain 0):', updatedSummaryB);

  if (updatedSummaryA.activeApplications !== 1 || updatedSummaryA.savedScholarships !== 1) {
    throw new Error('User A counts did not increment properly!');
  }
  if (updatedSummaryB.activeApplications !== 0 || updatedSummaryB.savedScholarships !== 0) {
    throw new Error('User B was contaminated by User A data!');
  }

  console.log('✓ PASS: User A counts updated to 1 application & 1 saved scholarship, while User B remains strictly isolated at 0!');

  // Cleanup test users
  await client.query('DELETE FROM student_applications WHERE student_id IN ($1, $2)', [userAId, userBId]);
  await client.query('DELETE FROM bookmarks WHERE user_id IN ($1, $2)', [userAId, userBId]);
  await client.query('DELETE FROM student_profiles WHERE user_id IN ($1, $2)', [userAId, userBId]);

  await client.end();

  console.log('\n================================================================');
  console.log('ALL DYNAMIC MULTI-USER DASHBOARD TESTS PASSED WITH 100% SUCCESS!');
  console.log('================================================================');
}

main().catch((err) => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
