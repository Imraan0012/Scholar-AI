package com.scholarai.backend.service;

import com.scholarai.backend.entity.Bookmark;
import com.scholarai.backend.repository.BookmarkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;

    public BookmarkService(BookmarkRepository bookmarkRepository) {
        this.bookmarkRepository = bookmarkRepository;
    }

    public List<String> getUserBookmarkedScholarshipIds(UUID userId) {
        return bookmarkRepository.findByUserId(userId).stream()
                .map(Bookmark::getScholarshipId)
                .collect(Collectors.toList());
    }

    public boolean isBookmarked(UUID userId, String scholarshipId) {
        return bookmarkRepository.existsByUserIdAndScholarshipId(userId, scholarshipId);
    }

    @Transactional
    public boolean toggleBookmark(UUID userId, String scholarshipId) {
        if (bookmarkRepository.existsByUserIdAndScholarshipId(userId, scholarshipId)) {
            bookmarkRepository.deleteByUserIdAndScholarshipId(userId, scholarshipId);
            return false;
        } else {
            Bookmark bookmark = new Bookmark(userId, scholarshipId);
            bookmarkRepository.save(bookmark);
            return true;
        }
    }

    @Transactional
    public void addBookmark(UUID userId, String scholarshipId) {
        if (!bookmarkRepository.existsByUserIdAndScholarshipId(userId, scholarshipId)) {
            Bookmark bookmark = new Bookmark(userId, scholarshipId);
            bookmarkRepository.save(bookmark);
        }
    }

    @Transactional
    public void removeBookmark(UUID userId, String scholarshipId) {
        bookmarkRepository.deleteByUserIdAndScholarshipId(userId, scholarshipId);
    }

    public long getCount(UUID userId) {
        return bookmarkRepository.countByUserId(userId);
    }
}
