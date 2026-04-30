package emsi.SmartFlow.controller.dto;

import emsi.SmartFlow.entity.enums.TaskPriority;
import emsi.SmartFlow.entity.enums.TaskStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {

    private String id;
    private String title;
    private String description;
    private TaskPriority priority;
    private TaskStatus status;

    private LocalDate estimatedStartDate;
    private LocalDate estimatedEndDate;
    private LocalDate realStartDate;
    private LocalDate realEndDate;

    private BigDecimal estimatedCost;
    private BigDecimal realCost;

    private Long assignedUserId;            // ← Long comme User.id
    private String assignedUserFullName;    // ← champ ajouté
    private String projectId;
    private String sprintId;
}