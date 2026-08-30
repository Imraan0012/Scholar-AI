import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:Luckychamp%40007@db.gixgyrsyopwtfgxvfglp.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();

  const userId = 'c16a225d-29d5-4021-a951-e369def4c963'; // mohamedimraan2003@gmail.com

  console.log('=== 1. VERIFY NO APPLICATIONS IN SUPABASE FOR USER ===');
  const countRes = await client.query('SELECT count(*) FROM student_applications WHERE student_id = $1', [userId]);
  console.log('Current applications count in DB:', countRes.rows[0].count);
  if (parseInt(countRes.rows[0].count, 10) !== 0) {
    throw new Error('Expected 0 applications in DB!');
  }
  console.log('✓ PASS: User starts with strictly 0 applications.');

  console.log('=== 2. VERIFY SPRING BOOT DASHBOARD SUMMARY API ===');
  const dashResp = await fetch('http://localhost:8000/api/dashboard/summary', {
    headers: { 'X-User-Id': userId }
  });
  const dashJson = await dashResp.json();
  console.log('Dashboard summary data:', dashJson.data);
  console.log('Applications count in summary (activeApplications):', dashJson.data.activeApplications);
  if (dashJson.data.activeApplications !== 0) {
    throw new Error(`Expected activeApplications to be 0, got ${dashJson.data.activeApplications}`);
  }
  console.log('✓ PASS: Dashboard API reports activeApplications = 0.');

  console.log('=== 3. TEST CREATING AN APPLICATION VIA API (Apply Now) ===');
  const applyResp = await fetch('http://localhost:8000/api/applications/hdfc-badhte-kadam', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': userId
    },
    body: JSON.stringify({ status: 'APPLIED' })
  });
  const applyJson = await applyResp.json();
  console.log('Apply response:', applyJson.data.application);

  const dbAfterApply = await client.query('SELECT * FROM student_applications WHERE student_id = $1', [userId]);
  console.log('DB row after apply:', dbAfterApply.rows);
  if (dbAfterApply.rows.length !== 1 || dbAfterApply.rows[0].status !== 'APPLIED') {
    throw new Error('Application was not created in DB properly!');
  }
  console.log('✓ PASS: Exactly one application record created in Supabase with status APPLIED.');

  console.log('=== 4. TEST UPDATING APPLICATION STATUS (e.g. UNDER_REVIEW) ===');
  const updateResp = await fetch('http://localhost:8000/api/applications/hdfc-badhte-kadam', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': userId
    },
    body: JSON.stringify({ status: 'UNDER_REVIEW' })
  });
  const updateJson = await updateResp.json();
  console.log('Update response:', updateJson.data);

  const dbAfterUpdate = await client.query('SELECT * FROM student_applications WHERE student_id = $1', [userId]);
  console.log('DB row after update status:', dbAfterUpdate.rows[0]);
  if (dbAfterUpdate.rows[0].status !== 'UNDER_REVIEW') {
    throw new Error('Status was not updated in DB!');
  }
  console.log('✓ PASS: Status successfully updated in Supabase to UNDER_REVIEW.');

  console.log('=== 5. TEST DELETING APPLICATION (Remove from Tracker) ===');
  const deleteResp = await fetch('http://localhost:8000/api/applications/hdfc-badhte-kadam', {
    method: 'DELETE',
    headers: { 'X-User-Id': userId }
  });
  const deleteJson = await deleteResp.json();
  console.log('Delete response message:', deleteJson.message);

  const dbAfterDelete = await client.query('SELECT count(*) FROM student_applications WHERE student_id = $1', [userId]);
  console.log('Final DB count after delete:', dbAfterDelete.rows[0].count);
  if (parseInt(dbAfterDelete.rows[0].count, 10) !== 0) {
    throw new Error('Application was not deleted from DB!');
  }
  console.log('✓ PASS: Application successfully deleted from Supabase, count is 0.');

  await client.end();
  console.log('\n======================================================');
  console.log('ALL APPLICATION LIFECYCLE TESTS PASSED WITH 100% SUCCESS!');
  console.log('======================================================');
}

main().catch((err) => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
