package com.scholarai.backend.repository;

import com.scholarai.backend.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, UUID> {
    List<Bookmark> findByUserId(UUID userId);

    List<Bookmark> findAllByUserIdAndScholarshipId(UUID userId, String scholarshipId);

    default Optional<Bookmark> findByUserIdAndScholarshipId(UUID userId, String scholarshipId) {
        List<Bookmark> list = findAllByUserIdAndScholarshipId(userId, scholarshipId);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    boolean existsByUserIdAndScholarshipId(UUID userId, String scholarshipId);
    void deleteByUserIdAndScholarshipId(UUID userId, String scholarshipId);
    long countByUserId(UUID userId);
}
