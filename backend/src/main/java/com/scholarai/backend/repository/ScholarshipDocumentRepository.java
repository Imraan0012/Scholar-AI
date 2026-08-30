package com.scholarai.backend.repository;

import com.scholarai.backend.entity.ScholarshipDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ScholarshipDocumentRepository extends JpaRepository<ScholarshipDocument, UUID> {
    List<ScholarshipDocument> findByScholarshipId(String scholarshipId);
}
