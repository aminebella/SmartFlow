package emsi.SmartFlow.TestUnitaire.service.impl;

import emsi.SmartFlow.controller.dto.ClientDashboardSummary;
import emsi.SmartFlow.entity.Client;
import emsi.SmartFlow.entity.Project;
import emsi.SmartFlow.entity.ProjectTeam;
import emsi.SmartFlow.entity.Task;
import emsi.SmartFlow.entity.enums.ProjectStatus;
import emsi.SmartFlow.entity.enums.TaskStatus;
import emsi.SmartFlow.repo.ProjectRepository;
import emsi.SmartFlow.repo.ProjectTeamRepository;
import emsi.SmartFlow.repo.TaskRepository;
import emsi.SmartFlow.service.impl.ClientDashboardServiceImpl;
import emsi.SmartFlow.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientDashboardServiceImplTest {

    @Mock private ProjectRepository     projectRepository;
    @Mock private ProjectTeamRepository projectTeamRepository;
    @Mock private TaskRepository        taskRepository;

    @InjectMocks
    private ClientDashboardServiceImpl clientDashboardService;

    private Client client;
    private Project project;

    @BeforeEach
    void setUp() {
        client = new Client();
        client.setId(1L);
        client.setFirstname("Alice");
        client.setLastname("Martin");

        project = new Project();
        project.setId(10L);
        project.setName("SmartFlow");
    }

    // helper — build a ProjectTeam for the client
    private ProjectTeam buildProjectTeam() {
        ProjectTeam pt = new ProjectTeam();
        pt.setProject(project);
        return pt;
    }

    // helper — build a Task assigned to the client
    private Task buildTask(TaskStatus status) {
        Task t = new Task();
        t.setId(1L);
        t.setTitle("Do something");
        t.setStatus(status);
        t.setProjectId(10L);
        t.setAssignedUser(client);
        t.setEstimatedEndDate(LocalDate.of(2026, 6, 30));
        return t;
    }

    // ═══════════════════════════════════════════════════════════
    //  getClientSummary
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("getClientSummary()")
    class GetClientSummaryTests {

        @Test
        void throwsIllegalArgument_whenUserIsNotClient() {
            User plainUser = mock(User.class);

            assertThatThrownBy(() -> clientDashboardService.getClientSummary(plainUser))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("client");
        }

        @Test
        void returnsCorrectProjectStats() {
            when(projectTeamRepository.findByClientId(1L))
                    .thenReturn(List.of(buildProjectTeam()));
            when(projectRepository.countByIdInAndStatus(anyList(), eq(ProjectStatus.ACTIVE)))
                    .thenReturn(1L);
            when(projectRepository.countByIdInAndStatus(anyList(), eq(ProjectStatus.FINISHED)))
                    .thenReturn(0L);
            when(taskRepository.countByAssignedUserIdAndStatus(1L, TaskStatus.DONE))
                    .thenReturn(0L);
            when(taskRepository.countByAssignedUserIdAndStatus(1L, TaskStatus.TODO))
                    .thenReturn(0L);
            when(taskRepository.countByAssignedUserIdAndStatus(1L, TaskStatus.IN_PROGRESS))
                    .thenReturn(0L);
            when(taskRepository.findTop5ByAssignedUserIdAndStatusInOrderByCreatedAtDesc(
                    anyLong(), anyList())).thenReturn(List.of());

            ClientDashboardSummary result = clientDashboardService.getClientSummary(client);

            assertThat(result.getTotalProjects()).isEqualTo(1L);
            assertThat(result.getActiveProjects()).isEqualTo(1L);
            assertThat(result.getFinishedProjects()).isEqualTo(0L);
        }

        @Test
        void returnsCorrectTaskStats() {
            when(projectTeamRepository.findByClientId(1L)).thenReturn(List.of());
            when(projectRepository.countByIdInAndStatus(anyList(), any())).thenReturn(0L);
            when(taskRepository.countByAssignedUserIdAndStatus(1L, TaskStatus.DONE))
                    .thenReturn(8L);
            when(taskRepository.countByAssignedUserIdAndStatus(1L, TaskStatus.TODO))
                    .thenReturn(2L);
            when(taskRepository.countByAssignedUserIdAndStatus(1L, TaskStatus.IN_PROGRESS))
                    .thenReturn(0L);
            when(taskRepository.findTop5ByAssignedUserIdAndStatusInOrderByCreatedAtDesc(
                    anyLong(), anyList())).thenReturn(List.of());

            ClientDashboardSummary result = clientDashboardService.getClientSummary(client);

            assertThat(result.getTasksDone()).isEqualTo(8L);
            assertThat(result.getTasksTodo()).isEqualTo(2L);
            // productivity = 8 / (8+2) * 100 = 80.0
            assertThat(result.getProductivity()).isEqualTo(80.0);
        }

        @Test
        void productivity_isZero_whenNoTasks() {
            when(projectTeamRepository.findByClientId(1L)).thenReturn(List.of());
            when(projectRepository.countByIdInAndStatus(anyList(), any())).thenReturn(0L);
            when(taskRepository.countByAssignedUserIdAndStatus(anyLong(), any())).thenReturn(0L);
            when(taskRepository.findTop5ByAssignedUserIdAndStatusInOrderByCreatedAtDesc(
                    anyLong(), anyList())).thenReturn(List.of());

            ClientDashboardSummary result = clientDashboardService.getClientSummary(client);

            assertThat(result.getProductivity()).isEqualTo(0.0);
        }

        @Test
        void recentTasks_arePopulated_withProjectName() {
            Task task = buildTask(TaskStatus.TODO);

            when(projectTeamRepository.findByClientId(1L)).thenReturn(List.of());
            when(projectRepository.countByIdInAndStatus(anyList(), any())).thenReturn(0L);
            when(taskRepository.countByAssignedUserIdAndStatus(anyLong(), any())).thenReturn(0L);
            when(taskRepository.findTop5ByAssignedUserIdAndStatusInOrderByCreatedAtDesc(
                    anyLong(), anyList())).thenReturn(List.of(task));
            when(projectRepository.findById(10L)).thenReturn(Optional.of(project));

            ClientDashboardSummary result = clientDashboardService.getClientSummary(client);

            assertThat(result.getRecentTasks()).hasSize(1);
            assertThat(result.getRecentTasks().get(0).getProjectName()).isEqualTo("SmartFlow");
            assertThat(result.getRecentTasks().get(0).getTitle()).isEqualTo("Do something");
        }

        @Test
        void recentTasks_showUnknownProject_whenProjectNotFound() {
            Task task = buildTask(TaskStatus.IN_PROGRESS);
            task.setEstimatedEndDate(null); // test null date branch

            when(projectTeamRepository.findByClientId(1L)).thenReturn(List.of());
            when(projectRepository.countByIdInAndStatus(anyList(), any())).thenReturn(0L);
            when(taskRepository.countByAssignedUserIdAndStatus(anyLong(), any())).thenReturn(0L);
            when(taskRepository.findTop5ByAssignedUserIdAndStatusInOrderByCreatedAtDesc(
                    anyLong(), anyList())).thenReturn(List.of(task));
            when(projectRepository.findById(10L)).thenReturn(Optional.empty());

            ClientDashboardSummary result = clientDashboardService.getClientSummary(client);

            assertThat(result.getRecentTasks().get(0).getProjectName()).isEqualTo("Unknown Project");
            assertThat(result.getRecentTasks().get(0).getDueDate()).isNull();
        }
    }
}