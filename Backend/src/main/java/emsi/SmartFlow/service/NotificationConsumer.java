package emsi.SmartFlow.service;

import emsi.SmartFlow.configuration.RabbitMQConfig;
import emsi.SmartFlow.entity.Notification;
import emsi.SmartFlow.entity.NotificationEvent;
import emsi.SmartFlow.repo.NotificationRepository;
import emsi.SmartFlow.user.User;
import emsi.SmartFlow.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationConsumer {

    private final NotificationRepository notificationRepository;
    private final UserRepository         userRepository;

    @RabbitListener(queues = RabbitMQConfig.QUEUE)
    public void consumeNotification(NotificationEvent event) {
        System.out.println("📥 Notification reçue de RabbitMQ : " + event);

        User recipient = userRepository.findById(event.getRecipientId())
                .orElse(null);

        if (recipient == null) {
            System.err.println("❌ User not found : " + event.getRecipientId());
            return;
        }

        Notification notification = Notification.builder()
                .recipient(recipient)
                .message(event.getMessage())
                .type(event.getType())
                .relatedEntityId(event.getRelatedEntityId())
                .read(false)
                .build();

        notificationRepository.save(notification);
        System.out.println("✅ Notification sauvegardée en DB pour user : " + recipient.getEmail());
    }
}