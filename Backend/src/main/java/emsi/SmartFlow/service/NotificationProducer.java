package emsi.SmartFlow.service;

import emsi.SmartFlow.configuration.RabbitMQConfig;
import emsi.SmartFlow.entity.NotificationEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationProducer {

    private final RabbitTemplate rabbitTemplate;

    public void sendNotification(Long recipientId, String message,
                                 String type, String relatedEntityId) {
        NotificationEvent event = new NotificationEvent(
                recipientId, message, type, relatedEntityId
        );
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.ROUTING_KEY,
                event
        );
        System.out.println("📤 Notification envoyée à RabbitMQ : " + event);
    }
}