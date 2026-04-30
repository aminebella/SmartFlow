package emsi.SmartFlow.entity;

import emsi.SmartFlow.entity.enums.TaskPriority;
import emsi.SmartFlow.entity.enums.TaskStatus;
import emsi.SmartFlow.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskPriority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;

    private LocalDate estimatedStartDate;
    private LocalDate estimatedEndDate;
    private LocalDate realStartDate;
    private LocalDate realEndDate;

    @Column(precision = 10, scale = 2)
    private BigDecimal estimatedCost;

    @Column(precision = 10, scale = 2)
    private BigDecimal realCost;

    // User existe déjà → on garde la relation @ManyToOne
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignedUserId")
    private User assignedUser;

    // Project n'existe pas encore → on stocke juste l'ID
    @Column(name = "projectId", nullable = false)
    private String projectId;

    // Sprint n'existe pas encore → on stocke juste l'ID
    @Column(name = "sprintId")
    private String sprintId;
}