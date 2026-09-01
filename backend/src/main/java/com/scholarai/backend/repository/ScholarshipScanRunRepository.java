package com.scholarai.backend.repository;

import com.scholarai.backend.entity.ScholarshipScanRun;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ScholarshipScanRunRepository extends JpaRepository<ScholarshipScanRun, UUID> {

    List<ScholarshipScanRun> findAllByOrderByStartedAtDesc();

    Optional<ScholarshipScanRun> findTopByOrderByStartedAtDesc();
}
