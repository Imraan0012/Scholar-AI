package com.scholarai.backend.repository;

import com.scholarai.backend.entity.ScholarshipDiscoveryCandidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ScholarshipDiscoveryCandidateRepository extends JpaRepository<ScholarshipDiscoveryCandidate, UUID> {
    List<ScholarshipDiscoveryCandidate> findByStatus(String status);
    Optional<ScholarshipDiscoveryCandidate> findByContentHash(String contentHash);
    Optional<ScholarshipDiscoveryCandidate> findByExternalSchemeId(String externalSchemeId);
    List<ScholarshipDiscoveryCandidate> findBySourceId(String sourceId);
    long countByStatus(String status);
}
