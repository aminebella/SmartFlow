package emsi.SmartFlow.TestUnitaire.controller.facade;

import emsi.SmartFlow.controller.dto.AdminDashboardSummary;
import emsi.SmartFlow.controller.facade.AdminDashboardController;
import emsi.SmartFlow.service.DashboardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.Map;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AdminDashboardControllerTest {

    @Mock
    private DashboardService dashboardService;

    @InjectMocks
    private AdminDashboardController adminDashboardController;

    private MockMvc mockMvc;
    private AdminDashboardSummary summary;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(adminDashboardController).build();

        summary = new AdminDashboardSummary();
        summary.setActiveProjects(5L);
        summary.setUsers(12L);
        summary.setTasksDone(8L);
        summary.setProductivity(40.0);
        summary.setProjectsActivity(Collections.emptyList());
        summary.setTasksActivity(Collections.emptyList());
        summary.setProjectsByStatus(Map.of("ACTIVE", 5L));
    }

    // ── GET /admin/dashboard/summary ─────────────────────────────────

    @Test
    void summary_returnsOkWithBody() throws Exception {
        when(dashboardService.getAdminSummaryCurrentMonth()).thenReturn(summary);

        mockMvc.perform(get("/admin/dashboard/summary")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.activeProjects").value(5))
                .andExpect(jsonPath("$.users").value(12))
                .andExpect(jsonPath("$.tasksDone").value(8))
                .andExpect(jsonPath("$.productivity").value(40.0));

        verify(dashboardService).getAdminSummaryCurrentMonth();
    }

    @Test
    void summary_callsServiceOnce() throws Exception {
        when(dashboardService.getAdminSummaryCurrentMonth()).thenReturn(summary);

        mockMvc.perform(get("/admin/dashboard/summary"))
                .andExpect(status().isOk());

        verify(dashboardService, times(1)).getAdminSummaryCurrentMonth();
    }

    // ── GET /admin/dashboard/report?year= ─────────────────────────────

    @Test
    void report_returnsOkForValidYear() throws Exception {
        when(dashboardService.getAdminReportForYear(2024)).thenReturn(summary);

        mockMvc.perform(get("/admin/dashboard/report")
                        .param("year", "2024")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.activeProjects").value(5));

        verify(dashboardService).getAdminReportForYear(2024);
    }

    @Test
    void report_missingYearParam_returnsBadRequest() throws Exception {
        mockMvc.perform(get("/admin/dashboard/report"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(dashboardService);
    }

    @Test
    void report_returnsCorrectProductivity() throws Exception {
        AdminDashboardSummary s = new AdminDashboardSummary();
        s.setProductivity(100.0);
        s.setProjectsActivity(Collections.emptyList());
        s.setTasksActivity(Collections.emptyList());
        s.setProjectsByStatus(Collections.emptyMap());
        when(dashboardService.getAdminReportForYear(2023)).thenReturn(s);

        mockMvc.perform(get("/admin/dashboard/report").param("year", "2023"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.productivity").value(100.0));
    }
}