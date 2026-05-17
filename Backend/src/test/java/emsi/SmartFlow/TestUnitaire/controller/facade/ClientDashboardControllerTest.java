package emsi.SmartFlow.TestUnitaire.controller.facade;

import emsi.SmartFlow.controller.dto.ClientDashboardSummary;
import emsi.SmartFlow.controller.facade.ClientDashboardController;
import emsi.SmartFlow.service.ClientDashboardService;
import emsi.SmartFlow.user.User;
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

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ClientDashboardControllerTest {

    @Mock
    private ClientDashboardService clientDashboardService;

    @InjectMocks
    private ClientDashboardController clientDashboardController;

    private MockMvc mockMvc;
    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = mock(User.class);

        mockMvc = MockMvcBuilders
                .standaloneSetup(clientDashboardController)
                .setCustomArgumentResolvers(new HandlerMethodArgumentResolver() {
                    @Override
                    public boolean supportsParameter(MethodParameter parameter) {
                        return User.class.isAssignableFrom(parameter.getParameterType());
                    }
                    @Override
                    public Object resolveArgument(MethodParameter p, ModelAndViewContainer m,
                                                  NativeWebRequest r, WebDataBinderFactory b) {
                        return mockUser;
                    }
                })
                .build();
    }

    @Test
    void summary_returnsOkWithData() throws Exception {
        ClientDashboardSummary summary = new ClientDashboardSummary();
        summary.setTotalProjects(3L);
        summary.setActiveProjects(2L);
        summary.setFinishedProjects(1L);
        summary.setTasksDone(5L);
        summary.setTasksTodo(3L);
        summary.setProductivity(62.5);
        summary.setRecentTasks(Collections.emptyList());

        when(clientDashboardService.getClientSummary(any(User.class))).thenReturn(summary);

        mockMvc.perform(get("/client/dashboard/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalProjects").value(3))
                .andExpect(jsonPath("$.activeProjects").value(2))
                .andExpect(jsonPath("$.tasksDone").value(5))
                .andExpect(jsonPath("$.productivity").value(62.5));

        verify(clientDashboardService).getClientSummary(any(User.class));
    }

    @Test
    void summary_withRecentTasks_returnsTasks() throws Exception {
        ClientDashboardSummary summary = new ClientDashboardSummary();
        summary.setTotalProjects(1L);
        summary.setActiveProjects(1L);
        summary.setFinishedProjects(0L);
        summary.setTasksDone(2L);
        summary.setTasksTodo(1L);
        summary.setProductivity(66.7);

        ClientDashboardSummary.TaskSummary ts =
                new ClientDashboardSummary.TaskSummary("Fix bug", "Project A", "10", "TODO", "2025-06-01");
        summary.setRecentTasks(List.of(ts));

        when(clientDashboardService.getClientSummary(any(User.class))).thenReturn(summary);

        mockMvc.perform(get("/client/dashboard/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.recentTasks[0].title").value("Fix bug"))
                .andExpect(jsonPath("$.recentTasks[0].status").value("TODO"));
    }

    @Test
    void summary_callsServiceOnce() throws Exception {
        ClientDashboardSummary summary = new ClientDashboardSummary();
        summary.setRecentTasks(Collections.emptyList());
        when(clientDashboardService.getClientSummary(any(User.class))).thenReturn(summary);

        mockMvc.perform(get("/client/dashboard/summary"))
                .andExpect(status().isOk());

        verify(clientDashboardService, times(1)).getClientSummary(any(User.class));
    }
}
