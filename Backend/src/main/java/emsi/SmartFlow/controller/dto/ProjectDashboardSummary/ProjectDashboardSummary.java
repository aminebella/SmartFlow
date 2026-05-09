package emsi.SmartFlow.controller.dto.ProjectDashboardSummary;

import emsi.SmartFlow.entity.enums.SprintStatus;
import emsi.SmartFlow.entity.enums.TaskPriority;
import emsi.SmartFlow.entity.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * DTO returned by GET /projects/{projectId}/dashboard
 * Contains all data needed by the project dashboard page.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDashboardSummary {

    // ── KPI cards ──────────────────────────────────────────────────
    /** % of sprints that are COMPLETED */
    private int sprintProgress;

    /** Number of tasks with status DONE */
    private long tasksDone;

    /** Number of tasks with status IN_PROGRESS */
    private long activeTasks;

    /** Total number of members in this project */
    private int teamMemberCount;

    // ── Active sprints list ────────────────────────────────────────
    /** List of sprints that are ACTIVE (usually 1, but flexible) */
    private List<SprintInfo> activeSprints;

    // ── Team members list ──────────────────────────────────────────
    private List<MemberInfo> members;

    // ── Task list ──────────────────────────────────────────────────
    private List<TaskInfo> tasks;

    // ════════════════════════════════════════════════════════════════
    //  Nested DTOs
    // ════════════════════════════════════════════════════════════════

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class SprintInfo {
        private Long id;
        private String title;
        private String goal;
        private LocalDate startDate;
        private LocalDate endDate;
        private SprintStatus status;

        /** How many tasks are DONE in this sprint */
        private long doneTasks;
        /** Total tasks in this sprint */
        private long totalTasks;
        /** Progress percentage 0-100 */
        private int progress;

        /** Count per status: TODO, IN_PROGRESS, REVIEW, DONE */
        private Map<String, Long> tasksByStatus;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class MemberInfo {
        private Long clientId;
        private String fullName;
        private String postTitle;   // job title (e.g. "Backend Dev")
        private String role;        // MANAGER or MEMBER
        /** Number of tasks assigned to this member in this project */
        private long assignedTasks;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class TaskInfo {
        private Long id;
        private String title;
        private TaskPriority priority;
        private TaskStatus status;
        private Long assignedUserId;
        private String assignedUserFullName;
        private Long sprintId;
    }
}
