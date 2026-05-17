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
import org.springframework.core.MethodParameter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

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
        mockUser = mock(User.class);
        when(mockUser.getId()).thenReturn(1L);

        mockMvc = MockMvcBuilders
                .standaloneSetup(projectDashboardController)
                .setCustomArgumentResolvers(new HandlerMethodArgumentResolver() {
                    @Override
                    public boolean supportsParameter(MethodParameter parameter) {
                        return User.class.isAssignableFrom(parameter.getParameterType());
                    }
                    @Override
                    public Object resolveArgument(MethodParameter parameter,
                                                  ModelAndViewContainer mavContainer,
                                                  NativeWebRequest webRequest,
                                                  WebDataBinderFactory binderFactory) {
                        return mockUser;
                    }
                })
                .build();

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

        mockMvc.perform(get("/projects/10/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.sprintProgress").value(50))
                .andExpect(jsonPath("$.data.tasksDone").value(8))
                .andExpect(jsonPath("$.data.activeTasks").value(3))
                .andExpect(jsonPath("$.data.teamMemberCount").value(5))
                .andExpect(jsonPath("$.message").value("Project dashboard retrieved"))
                .andExpect(jsonPath("$.status").value(200));
    }

    @Test
    void getDashboard_callsServiceWithCorrectProjectAndUserId() throws Exception {
        when(projectDashboardService.getDashboard(42L, 1L)).thenReturn(summary);

        mockMvc.perform(get("/projects/42/dashboard"))
                .andExpect(status().isOk());

        verify(projectDashboardService).getDashboard(42L, 1L);
    }

    @Test
    void getDashboard_responseHasTimestamp() throws Exception {
        when(projectDashboardService.getDashboard(anyLong(), anyLong())).thenReturn(summary);

        mockMvc.perform(get("/projects/10/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    void getDashboard_withActiveSprintData_returnsSprintInfo() throws Exception {
        ProjectDashboardSummary.SprintInfo si = ProjectDashboardSummary.SprintInfo.builder()
                .id(1L).title("Sprint 1").progress(75)
                .doneTasks(6L).totalTasks(8L)
                .build();

        ProjectDashboardSummary withSprint = ProjectDashboardSummary.builder()
                .sprintProgress(75).tasksDone(6L).activeTasks(2L).teamMemberCount(3)
                .activeSprints(List.of(si))
                .members(Collections.emptyList())
                .tasks(Collections.emptyList())
                .build();

        when(projectDashboardService.getDashboard(10L, 1L)).thenReturn(withSprint);

        mockMvc.perform(get("/projects/10/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.activeSprints[0].title").value("Sprint 1"))
                .andExpect(jsonPath("$.data.activeSprints[0].progress").value(75));
    }

    @Test
    void getDashboard_withMemberData_returnsMemberInfo() throws Exception {
        ProjectDashboardSummary.MemberInfo m = ProjectDashboardSummary.MemberInfo.builder()
                .clientId(2L).fullName("Ali Hassan").role("MANAGER").assignedTasks(4L)
                .build();

        ProjectDashboardSummary withMember = ProjectDashboardSummary.builder()
                .sprintProgress(0).tasksDone(0L).activeTasks(0L).teamMemberCount(1)
                .activeSprints(Collections.emptyList())
                .members(List.of(m))
                .tasks(Collections.emptyList())
                .build();

        when(projectDashboardService.getDashboard(10L, 1L)).thenReturn(withMember);

        mockMvc.perform(get("/projects/10/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.members[0].fullName").value("Ali Hassan"))
                .andExpect(jsonPath("$.data.members[0].role").value("MANAGER"));
    }

//    @Test
//    void getDashboard_serviceThrowsEntityNotFound_returnsInternalServerError() throws Exception {
//        when(projectDashboardService.getDashboard(anyLong(), anyLong()))
//                .thenThrow(new EntityNotFoundException("Project not found: 999"));
//
//        // GlobalExceptionHandler catches Exception → returns 500
//        mockMvc.perform(get("/projects/999/dashboard"))
//                .andExpect(status().isInternalServerError());
//    }
}