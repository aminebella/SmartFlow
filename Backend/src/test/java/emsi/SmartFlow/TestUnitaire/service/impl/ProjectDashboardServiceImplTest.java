package emsi.SmartFlow.TestUnitaire.service.impl;

import emsi.SmartFlow.controller.dto.ProjectDashboardSummary.ProjectDashboardSummary;
import emsi.SmartFlow.entity.Client;
import emsi.SmartFlow.entity.ProjectTeam;
import emsi.SmartFlow.entity.Sprint;
import emsi.SmartFlow.entity.Task;
import emsi.SmartFlow.entity.enums.ProjectTeamRole;
import emsi.SmartFlow.entity.enums.SprintStatus;
import emsi.SmartFlow.entity.enums.TaskPriority;
import emsi.SmartFlow.entity.enums.TaskStatus;
import emsi.SmartFlow.entity.keys.ProjectTeamKey;
import emsi.SmartFlow.repo.ProjectRepository;
import emsi.SmartFlow.repo.ProjectTeamRepository;
import emsi.SmartFlow.repo.SprintRepo;
import emsi.SmartFlow.repo.TaskRepository;
import emsi.SmartFlow.service.impl.ProjectDashboardServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectDashboardServiceImplTest {

    @Mock
    private ProjectRepository projectRepo;

    @Mock
    private ProjectTeamRepository projectTeamRepo;

    @Mock
    private SprintRepo sprintRepo;

    @Mock
    private TaskRepository taskRepo;

    @InjectMocks
    private ProjectDashboardServiceImpl projectDashboardService;

    private final Long projectId = 1L;
    private final Long userId    = 10L;

    @BeforeEach
    void setUp() {
        // Default happy path: project exists, user is a member
        when(projectRepo.existsById(projectId)).thenReturn(true);
        when(projectTeamRepo.existsByProjectIdAndUserId(projectId, userId)).thenReturn(true);
    }

    // ── Access control ────────────────────────────────────────────────

//    @Test
//    void getDashboard_shouldThrowEntityNotFoundWhenProjectDoesNotExist() {
//        when(projectRepo.existsById(99L)).thenReturn(false);
//
//        assertThrows(EntityNotFoundException.class,
//                () -> projectDashboardService.getDashboard(99L, userId));
//    }

//    @Test
//    void getDashboard_shouldThrowAccessDeniedWhenUserIsNotMember() {
//        when(projectTeamRepo.existsByProjectIdAndUserId(projectId, 99L)).thenReturn(false);
//
//        assertThrows(AccessDeniedException.class,
//                () -> projectDashboardService.getDashboard(projectId, 99L));
//    }

    // ── Sprint progress ───────────────────────────────────────────────

    @Test
    void getDashboard_shouldReturnZeroSprintProgressWhenNoSprints() {
        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(projectId)).thenReturn(List.of());
        when(taskRepo.findByProjectId(projectId)).thenReturn(List.of());
        when(projectTeamRepo.findByProjectIdWithClient(projectId)).thenReturn(List.of());

        ProjectDashboardSummary result = projectDashboardService.getDashboard(projectId, userId);

        assertEquals(0, result.getSprintProgress());
    }

    @Test
    void getDashboard_shouldReturn100SprintProgressWhenAllSprintsCompleted() {
        Sprint s1 = buildSprint(1L, SprintStatus.COMPLETED);
        Sprint s2 = buildSprint(2L, SprintStatus.COMPLETED);

        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(projectId)).thenReturn(List.of(s1, s2));
        when(taskRepo.findByProjectId(projectId)).thenReturn(List.of());
        when(projectTeamRepo.findByProjectIdWithClient(projectId)).thenReturn(List.of());

        ProjectDashboardSummary result = projectDashboardService.getDashboard(projectId, userId);

        assertEquals(100, result.getSprintProgress());
    }

    @Test
    void getDashboard_shouldCalculate50PercentWhenHalfSprintsCompleted() {
        Sprint completed = buildSprint(1L, SprintStatus.COMPLETED);
        Sprint planned   = buildSprint(2L, SprintStatus.PLANNED);

        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(projectId)).thenReturn(List.of(completed, planned));
        when(taskRepo.findByProjectId(projectId)).thenReturn(List.of());
        when(projectTeamRepo.findByProjectIdWithClient(projectId)).thenReturn(List.of());

        ProjectDashboardSummary result = projectDashboardService.getDashboard(projectId, userId);

        assertEquals(50, result.getSprintProgress());
    }

    // ── Task KPIs ─────────────────────────────────────────────────────

    @Test
    void getDashboard_shouldCountDoneAndActiveTasksCorrectly() {
        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(projectId)).thenReturn(List.of());

        Task done    = buildTask(1L, TaskStatus.DONE, null);
        Task active  = buildTask(2L, TaskStatus.IN_PROGRESS, null);
        Task todo    = buildTask(3L, TaskStatus.TODO, null);
        Task review  = buildTask(4L, TaskStatus.REVIEW, null);

        when(taskRepo.findByProjectId(projectId)).thenReturn(List.of(done, active, todo, review));
        when(projectTeamRepo.findByProjectIdWithClient(projectId)).thenReturn(List.of());

        ProjectDashboardSummary result = projectDashboardService.getDashboard(projectId, userId);

        assertEquals(1L, result.getTasksDone());
        assertEquals(1L, result.getActiveTasks());
    }

    @Test
    void getDashboard_shouldReturnZeroTasksWhenNoTasks() {
        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(projectId)).thenReturn(List.of());
        when(taskRepo.findByProjectId(projectId)).thenReturn(List.of());
        when(projectTeamRepo.findByProjectIdWithClient(projectId)).thenReturn(List.of());

        ProjectDashboardSummary result = projectDashboardService.getDashboard(projectId, userId);

        assertEquals(0L, result.getTasksDone());
        assertEquals(0L, result.getActiveTasks());
    }

    // ── Team members ──────────────────────────────────────────────────

    @Test
    void getDashboard_shouldReturnCorrectTeamMemberCount() {
        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(projectId)).thenReturn(List.of());
        when(taskRepo.findByProjectId(projectId)).thenReturn(List.of());

        Client c1 = buildClient(10L, "Alice", "Smith");
        Client c2 = buildClient(11L, "Bob",   "Jones");
        ProjectTeam pt1 = buildProjectTeam(c1, ProjectTeamRole.MEMBER);
        ProjectTeam pt2 = buildProjectTeam(c2, ProjectTeamRole.MANAGER);

        when(projectTeamRepo.findByProjectIdWithClient(projectId)).thenReturn(List.of(pt1, pt2));

        ProjectDashboardSummary result = projectDashboardService.getDashboard(projectId, userId);

        assertEquals(2, result.getTeamMemberCount());
    }

    @Test
    void getDashboard_shouldReturnMembersWithCorrectRolesAndNames() {
        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(projectId)).thenReturn(List.of());
        when(taskRepo.findByProjectId(projectId)).thenReturn(List.of());

        Client manager = buildClient(10L, "Alice", "Smith");
        manager.setPostTitle("Lead Dev");
        ProjectTeam pt = buildProjectTeam(manager, ProjectTeamRole.MANAGER);

        when(projectTeamRepo.findByProjectIdWithClient(projectId)).thenReturn(List.of(pt));

        ProjectDashboardSummary result = projectDashboardService.getDashboard(projectId, userId);

        assertNotNull(result.getMembers());
        assertEquals(1, result.getMembers().size());
        ProjectDashboardSummary.MemberInfo member = result.getMembers().get(0);
        assertEquals("Alice Smith", member.getFullName());
        assertEquals("MANAGER", member.getRole());
        assertEquals("Lead Dev", member.getPostTitle());
    }

    // ── Active sprints ────────────────────────────────────────────────

    @Test
    void getDashboard_shouldReturnActiveSprintsWithTaskBreakdown() {
        Sprint active = buildSprint(1L, SprintStatus.ACTIVE);

        // 2 tasks in sprint 1: one DONE, one TODO
        Task done = buildTask(1L, TaskStatus.DONE, 1L);
        Task todo = buildTask(2L, TaskStatus.TODO, 1L);

        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(projectId)).thenReturn(List.of(active));
        when(taskRepo.findByProjectId(projectId)).thenReturn(List.of(done, todo));
        when(projectTeamRepo.findByProjectIdWithClient(projectId)).thenReturn(List.of());

        ProjectDashboardSummary result = projectDashboardService.getDashboard(projectId, userId);

        assertNotNull(result.getActiveSprints());
        assertEquals(1, result.getActiveSprints().size());

        ProjectDashboardSummary.SprintInfo sprintInfo = result.getActiveSprints().get(0);
        assertEquals(1L, sprintInfo.getDoneTasks());
        assertEquals(2L, sprintInfo.getTotalTasks());
        assertEquals(50, sprintInfo.getProgress()); // 1/2 * 100
    }

    @Test
    void getDashboard_shouldReturnTasksByStatusBreakdownInActiveSprint() {
        Sprint active = buildSprint(1L, SprintStatus.ACTIVE);

        Task todo       = buildTask(1L, TaskStatus.TODO, 1L);
        Task inProgress = buildTask(2L, TaskStatus.IN_PROGRESS, 1L);
        Task review     = buildTask(3L, TaskStatus.REVIEW, 1L);
        Task done       = buildTask(4L, TaskStatus.DONE, 1L);

        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(projectId)).thenReturn(List.of(active));
        when(taskRepo.findByProjectId(projectId)).thenReturn(List.of(todo, inProgress, review, done));
        when(projectTeamRepo.findByProjectIdWithClient(projectId)).thenReturn(List.of());

        ProjectDashboardSummary result = projectDashboardService.getDashboard(projectId, userId);

        Map<String, Long> byStatus = result.getActiveSprints().get(0).getTasksByStatus();
        assertEquals(1L, byStatus.get("TODO"));
        assertEquals(1L, byStatus.get("IN_PROGRESS"));
        assertEquals(1L, byStatus.get("REVIEW"));
        assertEquals(1L, byStatus.get("DONE"));
    }

    @Test
    void getDashboard_shouldNotIncludePlannedSprintsInActiveSprintsList() {
        Sprint planned   = buildSprint(1L, SprintStatus.PLANNED);
        Sprint completed = buildSprint(2L, SprintStatus.COMPLETED);

        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(projectId)).thenReturn(List.of(planned, completed));
        when(taskRepo.findByProjectId(projectId)).thenReturn(List.of());
        when(projectTeamRepo.findByProjectIdWithClient(projectId)).thenReturn(List.of());

        ProjectDashboardSummary result = projectDashboardService.getDashboard(projectId, userId);

        // Only ACTIVE sprints appear in activeSprints
        assertTrue(result.getActiveSprints().isEmpty());
    }

    // ── Task list ─────────────────────────────────────────────────────

    @Test
    void getDashboard_shouldReturnFullTaskListForProject() {
        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(projectId)).thenReturn(List.of());

        Task t1 = buildTask(1L, TaskStatus.TODO, null);
        Task t2 = buildTask(2L, TaskStatus.DONE, null);

        when(taskRepo.findByProjectId(projectId)).thenReturn(List.of(t1, t2));
        when(projectTeamRepo.findByProjectIdWithClient(projectId)).thenReturn(List.of());

        ProjectDashboardSummary result = projectDashboardService.getDashboard(projectId, userId);

        assertNotNull(result.getTasks());
        assertEquals(2, result.getTasks().size());
    }

    // ── Helpers ───────────────────────────────────────────────────────

    private Sprint buildSprint(Long id, SprintStatus status) {
        Sprint s = new Sprint();
        s.setId(id);
        s.setTitle("Sprint " + id);
        s.setStatus(status);
        s.setStartDate(LocalDate.now());
        s.setEndDate(LocalDate.now().plusWeeks(2));
        return s;
    }

    private Task buildTask(Long id, TaskStatus status, Long sprintId) {
        Task t = new Task();
        t.setId(id);
        t.setTitle("Task " + id);
        t.setStatus(status);
        t.setPriority(TaskPriority.MEDIUM);
        t.setProjectId(projectId);
        t.setSprintId(sprintId);
        // assignedUser left null — tests that don't need it
        return t;
    }

    private Client buildClient(Long id, String firstname, String lastname) {
        Client c = new Client();
        c.setId(id);
        c.setFirstname(firstname);
        c.setLastname(lastname);
        return c;
    }

    private ProjectTeam buildProjectTeam(Client client, ProjectTeamRole role) {
        // ProjectTeam uses composite key ProjectTeamKey(projectId, clientId)
        ProjectTeamKey key = new ProjectTeamKey(projectId, client.getId());
        ProjectTeam pt = new ProjectTeam();
        pt.setId(key);
        pt.setClient(client);
        pt.setProjectRole(role);
        return pt;
    }
}