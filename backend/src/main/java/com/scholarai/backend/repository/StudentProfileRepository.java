package com.scholarai.backend.repository;

import com.scholarai.backend.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, UUID> {
    List<StudentProfile> findAllByUserId(UUID userId);

    default Optional<StudentProfile> findByUserId(UUID userId) {
        List<StudentProfile> list = findAllByUserId(userId);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    List<StudentProfile> findAllByEmail(String email);

    default Optional<StudentProfile> findByEmail(String email) {
        List<StudentProfile> list = findAllByEmail(email);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    boolean existsByUserId(UUID userId);
}
