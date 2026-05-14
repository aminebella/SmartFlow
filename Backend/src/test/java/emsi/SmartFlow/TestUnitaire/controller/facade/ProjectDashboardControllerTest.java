package emsi.SmartFlow.TestUnitaire.controller.facade;

import emsi.SmartFlow.controller.dto.ProjectDashboardSummary.ProjectDashboardSummary;
import emsi.SmartFlow.controller.facade.ProjectDashboardController;
import emsi.SmartFlow.service.facade.ProjectDashboardService;
import emsi.SmartFlow.user.User;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ProjectDashboardControllerTest {

    @Mock
    private ProjectDashboardService projectDashboardService;

    @InjectMocks
    private ProjectDashboardController projectDashboardController;

    private MockMvc mockMvc;
    private User mockUser;
    private ProjectDashboardSummary summary;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(projectDashboardController).build();

        mockUser = mock(User.class);
        when(mockUser.getId()).thenReturn(1L);

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockUser, null, Collections.emptyList())
        );

        summary = ProjectDashboardSummary.builder()
                .sprintProgress(50)
                .tasksDone(8L)
                .activeTasks(3L)
                .teamMemberCount(5)
                .activeSprints(Collections.emptyList())
                .members(Collections.emptyList())
                .tasks(Collections.emptyList())
                .build();
    }

    // ── GET /projects/{projectId}/dashboard ───────────────────────────

    @Test
    void getDashboard_returnsOkWithSummary() throws Exception {
        when(projectDashboardService.getDashboard(10L, 1L)).thenReturn(summary);

        mockMvc.perform(get("/projects/10/dashboard")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.sprintProgress").value(50))
                .andExpect(jsonPath("$.data.tasksDone").value(8))
                .andExpect(jsonPath("$.data.activeTasks").value(3))
                .andExpect(jsonPath("$.data.teamMemberCount").value(5))
                .andExpect(jsonPath("$.message").value("Project dashboard retrieved"))
                .andExpect(jsonPath("$.status").value(200));
    }

    @Test
    void getDashboard_callsServiceWithCorrectIds() throws Exception {
        when(projectDashboardService.getDashboard(anyLong(), anyLong())).thenReturn(summary);

        mockMvc.perform(get("/projects/42/dashboard"))
                .andExpect(status().isOk());

        verify(projectDashboardService).getDashboard(42L, 1L);
    }

    @Test
    void getDashboard_serviceThrowsEntityNotFound_returns500() throws Exception {
        when(projectDashboardService.getDashboard(anyLong(), anyLong()))
                .thenThrow(new EntityNotFoundException("Project not found: 999"));

        mockMvc.perform(get("/projects/999/dashboard"))
                .andExpect(status().isInternalServerError()); // default Spring MVC behavior without global handler
    }

    @Test
    void getDashboard_withActiveSprintData_returnsSprints() throws Exception {
        ProjectDashboardSummary.SprintInfo si = ProjectDashboardSummary.SprintInfo.builder()
                .id(1L).title("Sprint 1").progress(75)
                .doneTasks(6L).totalTasks(8L)
                .build();

        ProjectDashboardSummary summaryWithSprint = ProjectDashboardSummary.builder()
                .sprintProgress(75)
                .tasksDone(6L)
                .activeTasks(2L)
                .teamMemberCount(3)
                .activeSprints(List.of(si))
                .members(Collections.emptyList())
                .tasks(Collections.emptyList())
                .build();

        when(projectDashboardService.getDashboard(10L, 1L)).thenReturn(summaryWithSprint);

        mockMvc.perform(get("/projects/10/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.activeSprints").isArray())
                .andExpect(jsonPath("$.data.activeSprints[0].title").value("Sprint 1"))
                .andExpect(jsonPath("$.data.activeSprints[0].progress").value(75));
    }

    @Test
    void getDashboard_responseHasTimestamp() throws Exception {
        when(projectDashboardService.getDashboard(anyLong(), anyLong())).thenReturn(summary);

        mockMvc.perform(get("/projects/10/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.timestamp").exists());
    }
}