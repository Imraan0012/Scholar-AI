const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateAndNormalizeEmail(email) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const isValid = emailRegex.test(normalizedEmail);
  return { normalizedEmail, isValid };
}

function runTests() {
  console.log('=============================================================================');
  console.log('SCHOLAR AI â€” EMAIL VALIDATION & NORMALIZATION TEST SUITE');
  console.log('=============================================================================');

  // Test 1: User's real Gmail address
  const t1 = validateAndNormalizeEmail('mohamedimraan2003@gmail.com');
  console.log(`[TEST 1] mohamedimraan2003@gmail.com -> Valid: ${t1.isValid}, Normalized: ${t1.normalizedEmail}`);
  if (!t1.isValid || t1.normalizedEmail !== 'mohamedimraan2003@gmail.com') {
    throw new Error('TEST 1 FAILED');
  }
  console.log('âœ… TEST 1 PASSED: mohamedimraan2003@gmail.com is strictly accepted.');

  // Test 2: Invalid email 'abc'
  const t2 = validateAndNormalizeEmail('abc');
  console.log(`[TEST 2] 'abc' -> Valid: ${t2.isValid}`);
  if (t2.isValid) {
    throw new Error('TEST 2 FAILED');
  }
  console.log('âœ… TEST 2 PASSED: malformed "abc" is rejected.');

  // Test 3: Standard student@gmail.com
  const t3 = validateAndNormalizeEmail('student@gmail.com');
  console.log(`[TEST 3] 'student@gmail.com' -> Valid: ${t3.isValid}`);
  if (!t3.isValid) throw new Error('TEST 3 FAILED');
  console.log('âœ… TEST 3 PASSED: student@gmail.com accepted.');

  // Test 4: Untrimmed with spaces '   student123@yahoo.com   '
  const t4 = validateAndNormalizeEmail('   student123@yahoo.com   ');
  console.log(`[TEST 4] '   student123@yahoo.com   ' -> Valid: ${t4.isValid}, Normalized: '${t4.normalizedEmail}'`);
  if (!t4.isValid || t4.normalizedEmail !== 'student123@yahoo.com') throw new Error('TEST 4 FAILED');
  console.log('âœ… TEST 4 PASSED: Leading/trailing whitespace properly trimmed.');

  // Test 5: Uppercase email 'STUDENT@OUTLOOK.COM'
  const t5 = validateAndNormalizeEmail('STUDENT@OUTLOOK.COM');
  console.log(`[TEST 5] 'STUDENT@OUTLOOK.COM' -> Valid: ${t5.isValid}, Normalized: '${t5.normalizedEmail}'`);
  if (!t5.isValid || t5.normalizedEmail !== 'student@outlook.com') throw new Error('TEST 5 FAILED');
  console.log('âœ… TEST 5 PASSED: Uppercase properly normalized to lowercase.');

  // Test 6: Common email providers
  const domains = ['test@gmail.com', 'user@outlook.com', 'scholar@yahoo.in', 'student@iitb.ac.in', 'researcher@vjti.edu.in'];
  for (const d of domains) {
    const res = validateAndNormalizeEmail(d);
    if (!res.isValid) throw new Error(`Domain failed: ${d}`);
  }
  console.log('âœ… TEST 6 PASSED: All standard public and institutional domains (.com, .in, .ac.in, .edu.in) accepted.');

  console.log('=============================================================================');
  console.log('ðŸŽ‰ ALL EMAIL VALIDATION TESTS PASSED 100%!');
  console.log('=============================================================================');
}

runTests();
