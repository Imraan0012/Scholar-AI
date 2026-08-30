package com.scholarai.backend.repository;

import com.scholarai.backend.entity.Scholarship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScholarshipRepository extends JpaRepository<Scholarship, String>, JpaSpecificationExecutor<Scholarship> {

    List<Scholarship> findByVerificationStatus(String verificationStatus);

    long countByVerificationStatus(String verificationStatus);

    @Query("SELECT s FROM Scholarship s LEFT JOIN FETCH s.rules LEFT JOIN FETCH s.documents WHERE s.verificationStatus = :status")
    List<Scholarship> findAllWithRulesAndDocuments(String status);
}
