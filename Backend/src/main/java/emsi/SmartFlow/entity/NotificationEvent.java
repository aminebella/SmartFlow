package emsi.SmartFlow.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent implements Serializable {
    private Long   recipientId;
    private String message;
    private String type;
    private String relatedEntityId;

}