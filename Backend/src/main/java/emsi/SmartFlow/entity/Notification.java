package emsi.SmartFlow.entity;

import emsi.SmartFlow.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "notif_seq")
    @SequenceGenerator(name = "notif_seq", sequenceName = "notif_seq", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    @JsonIgnore
    private User recipient;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private String type;
    // Types : TASK_ASSIGNED, STATUS_CHANGED, ADDED_TO_PROJECT,
    //         SPRINT_STARTED, SPRINT_ENDED, COMMENT_ADDED

    private String relatedEntityId; // String car Task.id est un String UUID

    @Column(name = "is_read", nullable = false)
    private boolean read = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}