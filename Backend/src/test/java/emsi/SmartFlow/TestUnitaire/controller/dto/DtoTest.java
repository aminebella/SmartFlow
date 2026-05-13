package emsi.SmartFlow.TestUnitaire.controller.dto;

import emsi.SmartFlow.controller.dto.TaskRequest;
import emsi.SmartFlow.controller.dto.TaskResponse;
import emsi.SmartFlow.controller.dto.ProjectDashboardSummary.ProjectDashboardSummary;
import emsi.SmartFlow.controller.dto.project.ProjectRequest;
import emsi.SmartFlow.entity.enums.SprintStatus;
import emsi.SmartFlow.entity.enums.TaskPriority;
import emsi.SmartFlow.entity.enums.TaskStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for DTOs — covers getters, setters, builder, equals/hashCode.
 * No Spring context needed: pure Java object tests.
 * These tests cover the many uncovered lines in DTO classes reported by SonarQube.
 */
class DtoTest {

    // ═══════════════════════════════════════════════════════════
    //  TaskRequest
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("TaskRequest")
    class TaskRequestTests {

        @Test
        void builder_setsAllFields() {
            TaskRequest req = TaskRequest.builder()
                    .title("Fix bug")
                    .description("Critical issue")
                    .priority(TaskPriority.HIGH)
                    .status(TaskStatus.TODO)
                    .estimatedStartDate(LocalDate.of(2026, 1, 1))
                    .estimatedEndDate(LocalDate.of(2026, 1, 10))
                    .realStartDate(LocalDate.of(2026, 1, 2))
                    .realEndDate(LocalDate.of(2026, 1, 9))
                    .estimatedCost(new BigDecimal("1000.00"))
                    .realCost(new BigDecimal("950.00"))
                    .assignedUserId(5L)
                    .projectId(1L)
                    .sprintId(3L)
                    .build();

            assertThat(req.getTitle()).isEqualTo("Fix bug");
            assertThat(req.getDescription()).isEqualTo("Critical issue");
            assertThat(req.getPriority()).isEqualTo(TaskPriority.HIGH);
            assertThat(req.getStatus()).isEqualTo(TaskStatus.TODO);
            assertThat(req.getEstimatedStartDate()).isEqualTo(LocalDate.of(2026, 1, 1));
            assertThat(req.getEstimatedEndDate()).isEqualTo(LocalDate.of(2026, 1, 10));
            assertThat(req.getRealStartDate()).isEqualTo(LocalDate.of(2026, 1, 2));
            assertThat(req.getRealEndDate()).isEqualTo(LocalDate.of(2026, 1, 9));
            assertThat(req.getEstimatedCost()).isEqualByComparingTo("1000.00");
            assertThat(req.getRealCost()).isEqualByComparingTo("950.00");
            assertThat(req.getAssignedUserId()).isEqualTo(5L);
            assertThat(req.getProjectId()).isEqualTo(1L);
            assertThat(req.getSprintId()).isEqualTo(3L);
        }

        @Test
        void setters_workCorrectly() {
            TaskRequest req = new TaskRequest();
            req.setTitle("Updated");
            req.setPriority(TaskPriority.LOW);
            req.setProjectId(2L);

            assertThat(req.getTitle()).isEqualTo("Updated");
            assertThat(req.getPriority()).isEqualTo(TaskPriority.LOW);
            assertThat(req.getProjectId()).isEqualTo(2L);
        }

        @Test
        void noArgsConstructor_createsEmptyObject() {
            TaskRequest req = new TaskRequest();
            assertThat(req.getTitle()).isNull();
            assertThat(req.getProjectId()).isNull();
        }

        @Test
        void allArgsConstructor_setsAllFields() {
            TaskRequest req = new TaskRequest(
                    "Title", "Desc", TaskPriority.MEDIUM, TaskStatus.IN_PROGRESS,
                    LocalDate.now(), LocalDate.now(), LocalDate.now(), LocalDate.now(),
                    BigDecimal.TEN, BigDecimal.ONE, 1L, 2L, 3L
            );
            assertThat(req.getTitle()).isEqualTo("Title");
            assertThat(req.getProjectId()).isEqualTo(2L);
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  TaskResponse
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("TaskResponse")
    class TaskResponseTests {

        @Test
        void builder_setsAllFields() {
            LocalDateTime now = LocalDateTime.now();
            TaskResponse res = TaskResponse.builder()
                    .id(1L)
                    .title("Deploy feature")
                    .description("Deploy to prod")
                    .priority(TaskPriority.HIGH)
                    .status(TaskStatus.DONE)
                    .estimatedStartDate(LocalDate.of(2026, 2, 1))
                    .estimatedEndDate(LocalDate.of(2026, 2, 28))
                    .realStartDate(LocalDate.of(2026, 2, 3))
                    .realEndDate(LocalDate.of(2026, 2, 25))
                    .estimatedCost(new BigDecimal("5000"))
                    .realCost(new BigDecimal("4800"))
                    .assignedUserId(7L)
                    .assignedUserFullName("Alice Martin")
                    .projectId(2L)
                    .sprintId(4L)
                    .updatedAt(now)
                    .build();

            assertThat(res.getId()).isEqualTo(1L);
            assertThat(res.getTitle()).isEqualTo("Deploy feature");
            assertThat(res.getDescription()).isEqualTo("Deploy to prod");
            assertThat(res.getPriority()).isEqualTo(TaskPriority.HIGH);
            assertThat(res.getStatus()).isEqualTo(TaskStatus.DONE);
            assertThat(res.getAssignedUserId()).isEqualTo(7L);
            assertThat(res.getAssignedUserFullName()).isEqualTo("Alice Martin");
            assertThat(res.getProjectId()).isEqualTo(2L);
            assertThat(res.getSprintId()).isEqualTo(4L);
            assertThat(res.getUpdatedAt()).isEqualTo(now);
        }

        @Test
        void setters_workCorrectly() {
            TaskResponse res = new TaskResponse();
            res.setId(10L);
            res.setTitle("My Task");
            res.setStatus(TaskStatus.IN_PROGRESS);
            res.setAssignedUserFullName("Bob");

            assertThat(res.getId()).isEqualTo(10L);
            assertThat(res.getTitle()).isEqualTo("My Task");
            assertThat(res.getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);
            assertThat(res.getAssignedUserFullName()).isEqualTo("Bob");
        }

        @Test
        void noAssignee_fieldsAreNull() {
            TaskResponse res = TaskResponse.builder().id(1L).title("T").build();
            assertThat(res.getAssignedUserId()).isNull();
            assertThat(res.getAssignedUserFullName()).isNull();
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  ProjectRequest
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("ProjectRequest")
    class ProjectRequestTests {

        @Test
        void settersAndGetters_workCorrectly() {
            ProjectRequest req = new ProjectRequest();
            req.setName("SmartFlow");
            req.setDescription("Project management app");
            req.setEstimatedBudget(10000.0);
            req.setRealBudget(9500.0);
            req.setType("AGILE");

            LocalDateTime start = LocalDateTime.of(2026, 1, 1, 9, 0);
            LocalDateTime end   = LocalDateTime.of(2026, 6, 30, 18, 0);
            req.setEstimatedStartDate(start);
            req.setEstimatedEndDate(end);
            req.setRealStartDate(start.plusDays(2));
            req.setRealEndDate(end.minusDays(5));

            assertThat(req.getName()).isEqualTo("SmartFlow");
            assertThat(req.getDescription()).isEqualTo("Project management app");
            assertThat(req.getEstimatedBudget()).isEqualTo(10000.0);
            assertThat(req.getRealBudget()).isEqualTo(9500.0);
            assertThat(req.getType()).isEqualTo("AGILE");
            assertThat(req.getEstimatedStartDate()).isEqualTo(start);
            assertThat(req.getEstimatedEndDate()).isEqualTo(end);
        }

        @Test
        void defaultConstructor_allFieldsNull() {
            ProjectRequest req = new ProjectRequest();
            assertThat(req.getName()).isNull();
            assertThat(req.getEstimatedBudget()).isNull();
            assertThat(req.getType()).isNull();
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  ProjectDashboardSummary + nested DTOs
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("ProjectDashboardSummary")
    class ProjectDashboardSummaryTests {

        @Test
        void builder_setsTopLevelKpis() {
            ProjectDashboardSummary summary = ProjectDashboardSummary.builder()
                    .sprintProgress(75)
                    .tasksDone(10L)
                    .activeTasks(3L)
                    .teamMemberCount(5)
                    .build();

            assertThat(summary.getSprintProgress()).isEqualTo(75);
            assertThat(summary.getTasksDone()).isEqualTo(10L);
            assertThat(summary.getActiveTasks()).isEqualTo(3L);
            assertThat(summary.getTeamMemberCount()).isEqualTo(5);
        }

        @Test
        void setters_workCorrectly() {
            ProjectDashboardSummary summary = new ProjectDashboardSummary();
            summary.setSprintProgress(50);
            summary.setTasksDone(8L);
            summary.setActiveTasks(2L);
            summary.setTeamMemberCount(4);

            assertThat(summary.getSprintProgress()).isEqualTo(50);
            assertThat(summary.getTasksDone()).isEqualTo(8L);
        }

        @Test
        void sprintInfo_builder_setsAllFields() {
            ProjectDashboardSummary.SprintInfo info = ProjectDashboardSummary.SprintInfo.builder()
                    .id(1L)
                    .title("Sprint Alpha")
                    .goal("Deliver MVP")
                    .startDate(LocalDate.of(2026, 3, 1))
                    .endDate(LocalDate.of(2026, 3, 15))
                    .status(SprintStatus.ACTIVE)
                    .doneTasks(5L)
                    .totalTasks(8L)
                    .progress(62)
                    .tasksByStatus(Map.of("TODO", 1L, "DONE", 5L))
                    .build();

            assertThat(info.getId()).isEqualTo(1L);
            assertThat(info.getTitle()).isEqualTo("Sprint Alpha");
            assertThat(info.getGoal()).isEqualTo("Deliver MVP");
            assertThat(info.getStatus()).isEqualTo(SprintStatus.ACTIVE);
            assertThat(info.getDoneTasks()).isEqualTo(5L);
            assertThat(info.getTotalTasks()).isEqualTo(8L);
            assertThat(info.getProgress()).isEqualTo(62);
            assertThat(info.getTasksByStatus()).containsKey("DONE");
        }

        @Test
        void memberInfo_builder_setsAllFields() {
            ProjectDashboardSummary.MemberInfo member = ProjectDashboardSummary.MemberInfo.builder()
                    .clientId(3L)
                    .fullName("Alice Dupont")
                    .postTitle("Backend Dev")
                    .role("MANAGER")
                    .assignedTasks(7L)
                    .build();

            assertThat(member.getClientId()).isEqualTo(3L);
            assertThat(member.getFullName()).isEqualTo("Alice Dupont");
            assertThat(member.getPostTitle()).isEqualTo("Backend Dev");
            assertThat(member.getRole()).isEqualTo("MANAGER");
            assertThat(member.getAssignedTasks()).isEqualTo(7L);
        }

        @Test
        void taskInfo_builder_setsAllFields() {
            ProjectDashboardSummary.TaskInfo taskInfo = ProjectDashboardSummary.TaskInfo.builder()
                    .id(10L)
                    .title("Fix login")
                    .priority(TaskPriority.CRITICAL)
                    .status(TaskStatus.IN_PROGRESS)
                    .assignedUserId(2L)
                    .assignedUserFullName("Bob Martin")
                    .sprintId(5L)
                    .build();

            assertThat(taskInfo.getId()).isEqualTo(10L);
            assertThat(taskInfo.getTitle()).isEqualTo("Fix login");
            assertThat(taskInfo.getPriority()).isEqualTo(TaskPriority.CRITICAL);
            assertThat(taskInfo.getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);
            assertThat(taskInfo.getAssignedUserId()).isEqualTo(2L);
            assertThat(taskInfo.getAssignedUserFullName()).isEqualTo("Bob Martin");
            assertThat(taskInfo.getSprintId()).isEqualTo(5L);
        }

        @Test
        void summary_withNestedLists() {
            ProjectDashboardSummary.SprintInfo sprint = ProjectDashboardSummary.SprintInfo.builder()
                    .id(1L).title("S1").status(SprintStatus.PLANNED).build();

            ProjectDashboardSummary.MemberInfo member = ProjectDashboardSummary.MemberInfo.builder()
                    .clientId(1L).fullName("Alice").role("MEMBER").build();

            ProjectDashboardSummary.TaskInfo taskInfo = ProjectDashboardSummary.TaskInfo.builder()
                    .id(1L).title("T1").status(TaskStatus.TODO).build();

            ProjectDashboardSummary summary = ProjectDashboardSummary.builder()
                    .activeSprints(List.of(sprint))
                    .members(List.of(member))
                    .tasks(List.of(taskInfo))
                    .build();

            assertThat(summary.getActiveSprints()).hasSize(1);
            assertThat(summary.getMembers()).hasSize(1);
            assertThat(summary.getTasks()).hasSize(1);
        }
    }
}