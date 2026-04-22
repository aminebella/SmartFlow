package emsi.SmartFlow.controller.dto;

import emsi.SmartFlow.entity.enums.TaskPriority;
import emsi.SmartFlow.entity.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest {

    @NotBlank(message = "Title is mandatory")
    private String title;

    private String description;

    @NotNull(message = "Priority is mandatory")
    private TaskPriority priority;

    @NotNull(message = "Status is mandatory")
    private TaskStatus status;

    private LocalDate estimatedStartDate;
    private LocalDate estimatedEndDate;
    private LocalDate realStartDate;
    private LocalDate realEndDate;

    private BigDecimal estimatedCost;
    private BigDecimal realCost;

    private Long assignedUserId;    // ← Long objet (majuscule) supporte null

    @NotBlank(message = "Project ID is mandatory")
    private String projectId;

    private String sprintId;        // null = backlog
}