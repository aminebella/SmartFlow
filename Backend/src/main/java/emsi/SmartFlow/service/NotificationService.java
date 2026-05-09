package emsi.SmartFlow.service;

import emsi.SmartFlow.entity.Notification;
import emsi.SmartFlow.repo.NotificationRepository;
import emsi.SmartFlow.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository         userRepository;
    private final NotificationProducer   notificationProducer; // ← AJOUTÉ

    // ── Envoie via RabbitMQ (plus de sauvegarde directe ici) ──
    public void createNotification(Long recipientId, String message,
                                   String type, String relatedEntityId) {
        notificationProducer.sendNotification(recipientId, message, type, relatedEntityId);
    }

    public List<Notification> getNotifications(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientIdAndReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        n.setRead(true);
        notificationRepository.save(n);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }
}