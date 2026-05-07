package emsi.SmartFlow.controller.facade;

import emsi.SmartFlow.controller.dto.ApiResponse;
import emsi.SmartFlow.entity.Notification;
import emsi.SmartFlow.service.NotificationService;
import emsi.SmartFlow.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // GET /api/notifications
    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getMyNotifications(
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(ApiResponse.<List<Notification>>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message("Notifications retrieved")
                .data(notificationService.getNotifications(currentUser.getId()))
                .build());
    }

    // GET /api/notifications/unread-count
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(
            @AuthenticationPrincipal User currentUser
    ) {
        long count = notificationService.getUnreadCount(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.<Map<String, Long>>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message("Unread count")
                .data(Map.of("count", count))
                .build());
    }

    // PUT /api/notifications/{id}/read
    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message("Marked as read").data(null).build());
    }

    // PUT /api/notifications/read-all
    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal User currentUser
    ) {
        notificationService.markAllAsRead(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message("All marked as read").data(null).build());
    }
}