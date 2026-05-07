package emsi.SmartFlow.controller.dto;

import emsi.SmartFlow.entity.enums.TaskPriority;
import emsi.SmartFlow.entity.enums.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull(message = "Title is mandatory")
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

    private Long assignedUserId;

    @NotNull(message = "Project ID is mandatory")
    private Long projectId;

    private Long sprintId;
}