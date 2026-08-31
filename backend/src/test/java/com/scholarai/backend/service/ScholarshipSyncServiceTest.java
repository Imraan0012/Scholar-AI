package com.scholarai.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholarai.backend.entity.Scholarship;
import com.scholarai.backend.entity.ScholarshipUpdateReview;
import com.scholarai.backend.repository.ScholarshipRepository;
import com.scholarai.backend.repository.ScholarshipUpdateReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ScholarshipSyncServiceTest {

    private ScholarshipRepository scholarshipRepository;
    private ScholarshipUpdateReviewRepository reviewRepository;
    private ObjectMapper objectMapper;
    private ScholarshipSyncService syncService;

    @BeforeEach
    void setUp() {
        scholarshipRepository = mock(ScholarshipRepository.class);
        reviewRepository = mock(ScholarshipUpdateReviewRepository.class);
        objectMapper = new ObjectMapper();
        syncService = new ScholarshipSyncService(scholarshipRepository, reviewRepository, objectMapper);
    }

    private Scholarship createSampleScholarship(String id, String name, String url) {
        Scholarship s = new Scholarship();
        s.setId(id);
        s.setName(name);
        s.setProvider("Ministry of Education");
        s.setProviderType("GOVERNMENT");
        s.setGovernmentLevel("CENTRAL");
        s.setState("ALL_INDIA");
        s.setMinistryOrDepartment("Department of Higher Education");
        s.setAcademicYear("2026-27");
        s.setApplicationType("FRESH_AND_RENEWAL");
        s.setDescription("Merit cum means assistance.");
        s.setAmountDisplay("₹12,000 / year (UG) to ₹20,000 / year (PG)");
        s.setAmountMin(new BigDecimal("12000.00"));
        s.setAmountMax(new BigDecimal("20000.00"));
        s.setAmountType("ANNUAL_STIPEND");
        s.setOfficialWebsiteUrl(url);
        s.setOfficialApplicationUrl("https://scholarships.gov.in");
        s.setSourceReliability("LEVEL_1_OFFICIAL_GOVT");
        s.setVerificationStatus("VERIFIED");
        return s;
    }

    @Test
    void testDeterministicSha256Hashing() {
        Scholarship s1 = createSampleScholarship("sch-1", "PM Scholarship", "https://scholarships.gov.in");
        Scholarship s2 = createSampleScholarship("sch-1", "PM Scholarship", "https://scholarships.gov.in");

        String hash1 = syncService.calculateScholarshipContentHash(s1);
        String hash2 = syncService.calculateScholarshipContentHash(s2);

        assertNotNull(hash1);
        assertEquals(64, hash1.length());
        assertEquals(hash1, hash2, "Identical content must produce identical 64-character SHA-256 hash");
    }

    @Test
    void testVolatileTimestampsDoNotChangeHash() {
        Scholarship s1 = createSampleScholarship("sch-1", "PM Scholarship", "https://scholarships.gov.in");
        s1.setCreatedAt(OffsetDateTime.now().minusDays(10));
        s1.setUpdatedAt(OffsetDateTime.now().minusDays(5));
        s1.setLastCheckedAt(OffsetDateTime.now().minusHours(12));

        Scholarship s2 = createSampleScholarship("sch-1", "PM Scholarship", "https://scholarships.gov.in");
        s2.setCreatedAt(OffsetDateTime.now());
        s2.setUpdatedAt(OffsetDateTime.now());
        s2.setLastCheckedAt(OffsetDateTime.now());

        String hash1 = syncService.calculateScholarshipContentHash(s1);
        String hash2 = syncService.calculateScholarshipContentHash(s2);

        assertEquals(hash1, hash2, "Volatile timestamp changes must not alter the content hash");
    }

    @Test
    void testSsrfProtectionRejectsPrivateAndLocalUrls() {
        assertFalse(ScholarshipSyncService.isValidPublicHttpUrl("http://localhost:8080/api"));
        assertFalse(ScholarshipSyncService.isValidPublicHttpUrl("http://127.0.0.1/admin"));
        assertFalse(ScholarshipSyncService.isValidPublicHttpUrl("http://10.0.0.1/secret"));
        assertFalse(ScholarshipSyncService.isValidPublicHttpUrl("http://192.168.1.1/internal"));
        assertFalse(ScholarshipSyncService.isValidPublicHttpUrl("http://172.16.0.5/private"));
        assertFalse(ScholarshipSyncService.isValidPublicHttpUrl("http://169.254.169.254/latest/meta-data/"));
        assertFalse(ScholarshipSyncService.isValidPublicHttpUrl("ftp://scholarships.gov.in"));
        assertFalse(ScholarshipSyncService.isValidPublicHttpUrl("javascript:alert(1)"));
        assertFalse(ScholarshipSyncService.isValidPublicHttpUrl(""));
        assertFalse(ScholarshipSyncService.isValidPublicHttpUrl(null));

        // Public URLs must pass
        assertTrue(ScholarshipSyncService.isValidPublicHttpUrl("https://scholarships.gov.in"));
        assertTrue(ScholarshipSyncService.isValidPublicHttpUrl("https://www.education.gov.in/en/scholarships-education"));
    }

    @Test
    void testSyncLoadsFromDatabaseAndProvidesFailureBreakdown() {
        Scholarship s1 = createSampleScholarship("sch-1", "PM Scholarship 1", "https://scholarships.gov.in");
        Scholarship s2 = createSampleScholarship("sch-2", "PM Scholarship 2", "https://www.education.gov.in/en/scholarships-education");
        when(scholarshipRepository.findAll()).thenReturn(List.of(s1, s2));

        Map<String, Object> result = syncService.syncOfficialSourceRecords(Collections.emptyList());

        assertNotNull(result);
        assertEquals(2, result.get("checkedCount"));
        assertTrue(result.containsKey("failureBreakdown"));
        @SuppressWarnings("unchecked")
        Map<String, Integer> breakdown = (Map<String, Integer>) result.get("failureBreakdown");
        assertNotNull(breakdown);
        assertTrue(breakdown.containsKey("CONNECT_TIMEOUT"));
        assertTrue(breakdown.containsKey("HTTP_403"));
        assertTrue(breakdown.containsKey("TLS_CERTIFICATE_FAILURE"));

        verify(scholarshipRepository, times(1)).findAll();
        verify(scholarshipRepository, atLeast(2)).save(any(Scholarship.class));
    }

    @Test
    void testFailedSourceDoesNotOverwriteHashOrLastVerifiedAt() {
        Scholarship s1 = createSampleScholarship("sch-1", "PM Scholarship", "https://invalid-host-name-123456789.gov.in");
        s1.setOfficialApplicationUrl(null);
        s1.setOfficialGuidelinePdfUrl(null);
        String initialHash = syncService.calculateScholarshipContentHash(s1);
        s1.setContentHash(initialHash);
        OffsetDateTime initialVerifiedAt = OffsetDateTime.now().minusDays(5);
        s1.setLastVerifiedAt(initialVerifiedAt);

        when(scholarshipRepository.findAll()).thenReturn(List.of(s1));

        Map<String, Object> result = syncService.syncOfficialSourceRecords(null);

        assertEquals(1, result.get("checkedCount"));
        assertEquals(1, result.get("failedCount"));
        assertEquals(initialHash, s1.getContentHash(), "Failed fetch must NOT modify content hash");
        assertEquals(initialVerifiedAt, s1.getLastVerifiedAt(), "Failed fetch must NOT update lastVerifiedAt");
        assertNotNull(s1.getLastCheckedAt(), "Failed fetch must still update lastCheckedAt");
    }

    @Test
    void testCandidateUrlPriority() {
        Scholarship s = createSampleScholarship("sch-1", "Test Scheme", "https://portal.gov.in/scheme");
        s.setOfficialApplicationUrl("https://apply.gov.in");
        s.setOfficialGuidelinePdfUrl("https://portal.gov.in/guidelines.pdf");

        List<String> candidates = syncService.getCandidateSourceUrls(s);
        assertEquals(3, candidates.size());
        assertEquals("https://portal.gov.in/scheme", candidates.get(0));
        assertEquals("https://apply.gov.in", candidates.get(1));
        assertEquals("https://portal.gov.in/guidelines.pdf", candidates.get(2));
    }

    @Test
    void testChangedExternalRecordCreatesPendingReview() {
        Scholarship s1 = createSampleScholarship("sch-1", "PM Scholarship", "https://scholarships.gov.in");
        s1.setContentHash(syncService.calculateScholarshipContentHash(s1));
        when(scholarshipRepository.findById("sch-1")).thenReturn(Optional.of(s1));
        when(reviewRepository.findByScholarshipIdAndStatus("sch-1", "PENDING_REVIEW")).thenReturn(Collections.emptyList());
        when(reviewRepository.save(any(ScholarshipUpdateReview.class))).thenAnswer(i -> {
            ScholarshipUpdateReview r = i.getArgument(0);
            r.setId(UUID.randomUUID());
            return r;
        });

        Map<String, Object> incoming = new HashMap<>();
        incoming.put("id", "sch-1");
        incoming.put("name", "PM Scholarship");
        incoming.put("amount_display", "₹30,000 / year (Revised Rate)");
        incoming.put("official_website_url", "https://scholarships.gov.in");

        Map<String, Object> result = syncService.syncOfficialSourceRecords(List.of(incoming));

        assertEquals(1, result.get("checkedCount"));
        assertEquals(1, result.get("pendingReviewCount"));
        verify(reviewRepository, times(1)).save(any(ScholarshipUpdateReview.class));
    }

    @Test
    void testApprovalUpdatesScholarshipAndSetsStatusApproved() {
        UUID reviewId = UUID.randomUUID();
        ScholarshipUpdateReview review = new ScholarshipUpdateReview();
        review.setId(reviewId);
        review.setScholarshipId("sch-1");
        review.setStatus("PENDING_REVIEW");
        review.setProposedValues("{\"amountDisplay\":\"₹25,000 / year\"}");

        Scholarship s1 = createSampleScholarship("sch-1", "PM Scholarship", "https://scholarships.gov.in");

        when(reviewRepository.findById(reviewId)).thenReturn(Optional.of(review));
        when(scholarshipRepository.findById("sch-1")).thenReturn(Optional.of(s1));

        boolean approved = syncService.approveReview(reviewId, "SUPER_ADMIN");

        assertTrue(approved);
        assertEquals("APPROVED", review.getStatus());
        assertEquals("SUPER_ADMIN", review.getReviewedBy());
        assertEquals("₹25,000 / year", s1.getAmountDisplay());
        verify(scholarshipRepository, times(1)).save(s1);
        verify(reviewRepository, times(1)).save(review);
    }
}
