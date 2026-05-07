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
    private String type;
    private String ownerName;    // "Ali Hassan" — useful for admin view
    private String ownerPicture;  // ← ajouter // "Ali Hassan" — useful for admin view
    private int memberCount;     // how many members in the project
    private String myRole;       // "MANAGER", "MEMBER", null for admin

    private int taskCount;       // total tasks in project
    private int tasksDone;       // tasks with status DONE
    private int progress;        // percent done (0-100)

    // Later I'll add: taskCount, sprintCount, etc.
}