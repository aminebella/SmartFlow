// src/main/java/emsi/SmartFlow/controller/dto/project/ProjectRequest.java

package emsi.SmartFlow.controller.dto.project;

import java.time.LocalDateTime;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;


@Data
public class ProjectRequest {

//    @NotBlank(message = "Project name is required") // all fields optional for partial updates, Validation done in service: if name is provided on create, check it
    private String name;

    private String description;

    private LocalDateTime estimatedStartDate;

    private LocalDateTime estimatedEndDate;

    private Double estimatedBudget;

    // Real values — filled later during/after project execution
    private LocalDateTime realStartDate;

    private LocalDateTime realEndDate;

    private Double realBudget;

}