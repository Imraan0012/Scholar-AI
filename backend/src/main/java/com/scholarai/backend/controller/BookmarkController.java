package com.scholarai.backend.controller;

import com.scholarai.backend.dto.ApiResponse;
import com.scholarai.backend.security.AuthenticatedUser;
import com.scholarai.backend.service.BookmarkService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<String>>> getBookmarks(
            @AuthenticationPrincipal AuthenticatedUser user) {
        List<String> bookmarks = bookmarkService.getUserBookmarkedScholarshipIds(user.getUserId());
        return ResponseEntity.ok(ApiResponse.success(bookmarks));
    }

    @PostMapping("/{scholarshipId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleBookmark(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable String scholarshipId) {
        boolean isNowBookmarked = bookmarkService.toggleBookmark(user.getUserId(), scholarshipId);
        List<String> updated = bookmarkService.getUserBookmarkedScholarshipIds(user.getUserId());

        Map<String, Object> data = new HashMap<>();
        data.put("bookmarked", isNowBookmarked);
        data.put("scholarshipId", scholarshipId);
        data.put("bookmarks", updated);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @DeleteMapping("/{scholarshipId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> removeBookmark(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable String scholarshipId) {
        bookmarkService.removeBookmark(user.getUserId(), scholarshipId);
        List<String> updated = bookmarkService.getUserBookmarkedScholarshipIds(user.getUserId());

        Map<String, Object> data = new HashMap<>();
        data.put("bookmarked", false);
        data.put("bookmarks", updated);
        return ResponseEntity.ok(ApiResponse.success("Bookmark removed", data));
    }

    @GetMapping("/{scholarshipId}/status")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> getBookmarkStatus(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable String scholarshipId) {
        boolean bookmarked = bookmarkService.isBookmarked(user.getUserId(), scholarshipId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("bookmarked", bookmarked)));
    }
}
