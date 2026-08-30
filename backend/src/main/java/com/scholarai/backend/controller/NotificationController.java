package com.scholarai.backend.controller;

import com.scholarai.backend.dto.ApiResponse;
import com.scholarai.backend.entity.Notification;
import com.scholarai.backend.security.AuthenticatedUser;
import com.scholarai.backend.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getNotifications(
            @AuthenticationPrincipal AuthenticatedUser user) {
        List<Notification> notifications = notificationService.getUserNotifications(user.getUserId());
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(
            @AuthenticationPrincipal AuthenticatedUser user) {
        long count = notificationService.getUnreadCount(user.getUserId());
        return ResponseEntity.ok(ApiResponse.success(Map.of("unreadCount", count)));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Notification>> markAsRead(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable UUID id) {
        Notification updated = notificationService.markAsRead(id, user.getUserId());
        return ResponseEntity.ok(ApiResponse.success(updated));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Map<String, String>>> markAllAsRead(
            @AuthenticationPrincipal AuthenticatedUser user) {
        notificationService.markAllAsRead(user.getUserId());
        return ResponseEntity.ok(ApiResponse.success(Map.of("message", "All notifications marked as read")));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Notification>> createNotification(
            @AuthenticationPrincipal AuthenticatedUser user,
            @RequestBody Map<String, String> body) {
        String title = body.getOrDefault("title", "Scholar AI Update");
        String message = body.getOrDefault("message", "");
        String type = body.getOrDefault("type", "INFO");
        String link = body.get("link");

        Notification created = notificationService.createNotification(user.getUserId(), title, message, type, link);
        return ResponseEntity.ok(ApiResponse.success(created));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<List<Notification>>> deleteNotification(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable UUID id) {
        notificationService.deleteNotification(id, user.getUserId());
        List<Notification> updated = notificationService.getUserNotifications(user.getUserId());
        return ResponseEntity.ok(ApiResponse.success("Notification deleted", updated));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<List<Notification>>> clearAll(
            @AuthenticationPrincipal AuthenticatedUser user) {
        notificationService.clearAll(user.getUserId());
        return ResponseEntity.ok(ApiResponse.success("All notifications cleared", List.of()));
    }
}
