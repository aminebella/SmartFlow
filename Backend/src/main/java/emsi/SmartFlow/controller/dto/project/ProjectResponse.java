// src/main/java/emsi/SmartFlow/controller/dto/project/ProjectResponse.java

package emsi.SmartFlow.controller.dto.project;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;

import emsi.SmartFlow.entity.enums.ProjectStatus;

@Data
@Builder
public class ProjectResponse {

    private Long id;
    private String name;
    private String description;

    private LocalDateTime estimatedStartDate;
    private LocalDateTime estimatedEndDate;

    private LocalDateTime realStartDate;
    private LocalDateTime realEndDate;

    private Double estimatedBudget;
    private Double realBudget;

    private ProjectStatus status;
    private String ownerName;    // "Ali Hassan" — useful for admin view
    private int memberCount;     // how many members in the project
    private String myRole;       // "MANAGER", "MEMBER", null for admin

    // Later I'll add: taskCount, sprintCount, etc.
}