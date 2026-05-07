package emsi.SmartFlow.controller.dto;

import emsi.SmartFlow.entity.enums.TaskPriority;
import emsi.SmartFlow.entity.enums.TaskStatus;
import lombok.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;
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

    private Long assignedUserId;
    private String assignedUserFullName;
    private Long projectId;
    private Long sprintId;
    private LocalDateTime updatedAt;
}