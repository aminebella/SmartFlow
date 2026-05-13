package emsi.SmartFlow.TestUnitaire.service;

import emsi.SmartFlow.entity.Notification;
import emsi.SmartFlow.repo.NotificationRepository;
import emsi.SmartFlow.service.NotificationProducer;
import emsi.SmartFlow.service.NotificationService;
import emsi.SmartFlow.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationProducer notificationProducer;

    @InjectMocks
    private NotificationService notificationService;

    private Notification notification;

    @BeforeEach
    void setUp() {
        // Notification uses @Builder and @Data
        notification = Notification.builder()
                .id(1L)
                .message("Task assigned to you")
                .type("TASK_ASSIGNED")
                .relatedEntityId("task-123")
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void createNotification_shouldDelegateToProducer() {
        notificationService.createNotification(1L, "Task assigned", "TASK_ASSIGNED", "task-1");

        verify(notificationProducer).sendNotification(1L, "Task assigned", "TASK_ASSIGNED", "task-1");
        // Should NOT interact with repo directly — RabbitMQ handles persistence
        verifyNoInteractions(notificationRepository);
    }

    @Test
    void getNotifications_shouldReturnListOrderedByCreatedAtDesc() {
        List<Notification> expected = List.of(notification);
        when(notificationRepository.findByRecipientIdOrderByCreatedAtDesc(1L)).thenReturn(expected);

        List<Notification> result = notificationService.getNotifications(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Task assigned to you", result.get(0).getMessage());
        verify(notificationRepository).findByRecipientIdOrderByCreatedAtDesc(1L);
    }

    @Test
    void getNotifications_shouldReturnEmptyListForUserWithNoNotifications() {
        when(notificationRepository.findByRecipientIdOrderByCreatedAtDesc(99L)).thenReturn(List.of());

        List<Notification> result = notificationService.getNotifications(99L);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void getUnreadCount_shouldReturnCorrectCount() {
        when(notificationRepository.countByRecipientIdAndReadFalse(1L)).thenReturn(3L);

        long count = notificationService.getUnreadCount(1L);

        assertEquals(3L, count);
        verify(notificationRepository).countByRecipientIdAndReadFalse(1L);
    }

    @Test
    void getUnreadCount_shouldReturnZeroWhenAllRead() {
        when(notificationRepository.countByRecipientIdAndReadFalse(1L)).thenReturn(0L);

        long count = notificationService.getUnreadCount(1L);

        assertEquals(0L, count);
    }

    @Test
    void markAsRead_shouldSetReadToTrueAndSave() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(notification)).thenReturn(notification);

        notificationService.markAsRead(1L);

        // The notification's read field should now be true
        assertTrue(notification.isRead());
        verify(notificationRepository).findById(1L);
        verify(notificationRepository).save(notification);
    }

    @Test
    void markAsRead_shouldThrowRuntimeExceptionWhenNotificationNotFound() {
        when(notificationRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> notificationService.markAsRead(99L));

        assertEquals("Notification not found", ex.getMessage());
        verify(notificationRepository, never()).save(any());
    }

    @Test
    void markAllAsRead_shouldCallRepositoryUpdateQuery() {
        // markAllAsRead is @Transactional + calls repo update query
        notificationService.markAllAsRead(1L);

        verify(notificationRepository).markAllAsReadByUserId(1L);
    }

    @Test
    void markAllAsRead_shouldWorkForAnyUserId() {
        notificationService.markAllAsRead(42L);

        verify(notificationRepository).markAllAsReadByUserId(42L);
    }
}