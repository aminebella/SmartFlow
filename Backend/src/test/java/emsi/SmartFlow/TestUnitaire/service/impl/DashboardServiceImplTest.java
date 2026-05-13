//package emsi.SmartFlow.TestUnitaire.service.impl;
//
//import emsi.SmartFlow.controller.dto.AdminDashboardSummary;
//import emsi.SmartFlow.entity.enums.ProjectStatus;
//import emsi.SmartFlow.entity.enums.TaskStatus;
//import emsi.SmartFlow.repo.ProjectRepository;
//import emsi.SmartFlow.repo.TaskRepository;
//import emsi.SmartFlow.service.impl.DashboardServiceImpl;
//import emsi.SmartFlow.user.UserRepository;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//
//import java.util.List;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.*;
//
//@ExtendWith(MockitoExtension.class)
//class DashboardServiceImplTest {
//
//    @Mock
//    private ProjectRepository projectRepository;
//
//    @Mock
//    private TaskRepository taskRepository;
//
//    @Mock
//    private UserRepository userRepository;
//
//    @InjectMocks
//    private DashboardServiceImpl dashboardService;
//
//    // ── Helper: stub all ProjectStatus.values() calls ─────────────────
//    // ProjectStatus = ACTIVE, ARCHIVED, FINISHED (no CANCELLED, no PLANNED)
//    private void stubProjectStatusCounts(long active, long archived, long finished) {
//        when(projectRepository.countByStatus(ProjectStatus.ACTIVE)).thenReturn(active);
//        when(projectRepository.countByStatus(ProjectStatus.ARCHIVED)).thenReturn(archived);
//        when(projectRepository.countByStatus(ProjectStatus.FINISHED)).thenReturn(finished);
//    }
//
//    @Test
//    void getAdminSummaryCurrentMonth_shouldReturnCorrectActiveProjectsAndUsers() {
//        stubProjectStatusCounts(5L, 1L, 3L);
//        when(userRepository.countNonAdminUsers()).thenReturn(10L);
//        when(taskRepository.countByStatus(TaskStatus.DONE)).thenReturn(20L);
//        when(taskRepository.count()).thenReturn(40L);
//        when(projectRepository.countGroupedByYearMonth(any(), any())).thenReturn(List.of());
//        when(taskRepository.countGroupedByYearMonth(any(), any())).thenReturn(List.of());
//        // Current-month call also triggers countGroupedByDay
//        when(projectRepository.countGroupedByDay(any(), any())).thenReturn(List.of());
//        when(taskRepository.countGroupedByDay(any(), any())).thenReturn(List.of());
//
//        AdminDashboardSummary result = dashboardService.getAdminSummaryCurrentMonth();
//
//        assertNotNull(result);
//        assertEquals(5L, result.getActiveProjects());
//        assertEquals(10L, result.getUsers());
//        assertEquals(20L, result.getTasksDone());
//    }
//
//    @Test
//    void getAdminSummaryCurrentMonth_shouldCalculateProductivityCorrectly() {
//        stubProjectStatusCounts(2L, 0L, 1L);
//        when(userRepository.countNonAdminUsers()).thenReturn(5L);
//        when(taskRepository.countByStatus(TaskStatus.DONE)).thenReturn(20L);
//        when(taskRepository.count()).thenReturn(40L);     // 20/40 * 100 = 50.0
//        when(projectRepository.countGroupedByYearMonth(any(), any())).thenReturn(List.of());
//        when(taskRepository.countGroupedByYearMonth(any(), any())).thenReturn(List.of());
//        when(projectRepository.countGroupedByDay(any(), any())).thenReturn(List.of());
//        when(taskRepository.countGroupedByDay(any(), any())).thenReturn(List.of());
//
//        AdminDashboardSummary result = dashboardService.getAdminSummaryCurrentMonth();
//
//        assertEquals(50.0, result.getProductivity());
//    }
//
//    @Test
//    void getAdminSummaryCurrentMonth_shouldReturnZeroProductivityWhenNoTasks() {
//        stubProjectStatusCounts(0L, 0L, 0L);
//        when(userRepository.countNonAdminUsers()).thenReturn(0L);
//        when(taskRepository.countByStatus(TaskStatus.DONE)).thenReturn(0L);
//        when(taskRepository.count()).thenReturn(0L);   // totalTasks = 0 → no division
//        when(projectRepository.countGroupedByYearMonth(any(), any())).thenReturn(List.of());
//        when(taskRepository.countGroupedByYearMonth(any(), any())).thenReturn(List.of());
//        when(projectRepository.countGroupedByDay(any(), any())).thenReturn(List.of());
//        when(taskRepository.countGroupedByDay(any(), any())).thenReturn(List.of());
//
//        AdminDashboardSummary result = dashboardService.getAdminSummaryCurrentMonth();
//
//        assertEquals(0.0, result.getProductivity());
//    }
//
//    @Test
//    void getAdminReportForYear_shouldReturnSummaryForGivenYear() {
//        stubProjectStatusCounts(3L, 1L, 2L);
//        when(userRepository.countNonAdminUsers()).thenReturn(8L);
//        when(taskRepository.countByStatus(TaskStatus.DONE)).thenReturn(15L);
//        when(taskRepository.count()).thenReturn(30L);
//        when(projectRepository.countGroupedByYearMonth(any(), any())).thenReturn(List.of());
//        when(taskRepository.countGroupedByYearMonth(any(), any())).thenReturn(List.of());
//        // Year report covers a full year → from.getYear() != to.getYear() is false
//        // but from.getMonth() == JANUARY, to.getMonth() == DECEMBER → so no daily call
//
//        AdminDashboardSummary result = dashboardService.getAdminReportForYear(2024);
//
//        assertNotNull(result);
//        assertEquals(3L, result.getActiveProjects());
//        assertEquals(8L, result.getUsers());
//        assertEquals(15L, result.getTasksDone());
//    }
//
//    @Test
//    void getAdminReportForYear_shouldPopulateProjectsActivity() {
//        stubProjectStatusCounts(1L, 0L, 0L);
//        when(userRepository.countNonAdminUsers()).thenReturn(2L);
//        when(taskRepository.countByStatus(TaskStatus.DONE)).thenReturn(5L);
//        when(taskRepository.count()).thenReturn(10L);
//
//        // Simulate DB returning one row: [year=2024, month=3, count=7]
//        Object[] row = new Object[]{2024, 3, 7L};
//        when(projectRepository.countGroupedByYearMonth(any(), any())).thenReturn(List.of(row));
//        when(taskRepository.countGroupedByYearMonth(any(), any())).thenReturn(List.of());
//
//        AdminDashboardSummary result = dashboardService.getAdminReportForYear(2024);
//
//        assertNotNull(result.getProjectsActivity());
//        assertEquals(1, result.getProjectsActivity().size());
//        AdminDashboardSummary.YearMonthPoint point = result.getProjectsActivity().get(0);
//        assertEquals(2024, point.getYear());
//        assertEquals(3, point.getMonth());
//        assertEquals(7L, point.getCount());
//    }
//
//    @Test
//    void getAdminReportForYear_shouldPopulateTasksActivity() {
//        stubProjectStatusCounts(1L, 0L, 0L);
//        when(userRepository.countNonAdminUsers()).thenReturn(2L);
//        when(taskRepository.countByStatus(TaskStatus.DONE)).thenReturn(5L);
//        when(taskRepository.count()).thenReturn(10L);
//        when(projectRepository.countGroupedByYearMonth(any(), any())).thenReturn(List.of());
//
//        Object[] taskRow = new Object[]{2024, 5, 12L};
//        when(taskRepository.countGroupedByYearMonth(any(), any())).thenReturn(List.of(taskRow));
//
//        AdminDashboardSummary result = dashboardService.getAdminReportForYear(2024);
//
//        assertNotNull(result.getTasksActivity());
//        assertEquals(1, result.getTasksActivity().size());
//        assertEquals(12L, result.getTasksActivity().get(0).getCount());
//        assertEquals(5, result.getTasksActivity().get(0).getMonth());
//    }
//
//    @Test
//    void getAdminSummaryCurrentMonth_shouldPopulateDailyActivityForCurrentMonth() {
//        stubProjectStatusCounts(1L, 0L, 0L);
//        when(userRepository.countNonAdminUsers()).thenReturn(2L);
//        when(taskRepository.countByStatus(TaskStatus.DONE)).thenReturn(5L);
//        when(taskRepository.count()).thenReturn(10L);
//        when(projectRepository.countGroupedByYearMonth(any(), any())).thenReturn(List.of());
//        when(taskRepository.countGroupedByYearMonth(any(), any())).thenReturn(List.of());
//
//        // Daily data for current month
//        Object[] projDay = new Object[]{15, 3L};
//        Object[] taskDay = new Object[]{15, 8L};
//        when(projectRepository.countGroupedByDay(any(), any())).thenReturn(List.of(projDay));
//        when(taskRepository.countGroupedByDay(any(), any())).thenReturn(List.of(taskDay));
//
//        AdminDashboardSummary result = dashboardService.getAdminSummaryCurrentMonth();
//
//        assertNotNull(result.getProjectsActivityDaily());
//        assertEquals(1, result.getProjectsActivityDaily().size());
//        assertEquals(15, result.getProjectsActivityDaily().get(0).getDay());
//        assertEquals(3L, result.getProjectsActivityDaily().get(0).getCount());
//
//        assertNotNull(result.getTasksActivityDaily());
//        assertEquals(1, result.getTasksActivityDaily().size());
//        assertEquals(8L, result.getTasksActivityDaily().get(0).getCount());
//    }
//
//    @Test
//    void getAdminSummaryCurrentMonth_shouldPopulateProjectsByStatus() {
//        stubProjectStatusCounts(5L, 2L, 3L);
//        when(userRepository.countNonAdminUsers()).thenReturn(5L);
//        when(taskRepository.countByStatus(TaskStatus.DONE)).thenReturn(10L);
//        when(taskRepository.count()).thenReturn(20L);
//        when(projectRepository.countGroupedByYearMonth(any(), any())).thenReturn(List.of());
//        when(taskRepository.countGroupedByYearMonth(any(), any())).thenReturn(List.of());
//        when(projectRepository.countGroupedByDay(any(), any())).thenReturn(List.of());
//        when(taskRepository.countGroupedByDay(any(), any())).thenReturn(List.of());
//
//        AdminDashboardSummary result = dashboardService.getAdminSummaryCurrentMonth();
//
//        assertNotNull(result.getProjectsByStatus());
//        // ProjectStatus has ACTIVE, ARCHIVED, FINISHED — all should be in the map
//        assertTrue(result.getProjectsByStatus().containsKey("ACTIVE"));
//        assertTrue(result.getProjectsByStatus().containsKey("ARCHIVED"));
//        assertTrue(result.getProjectsByStatus().containsKey("FINISHED"));
//        assertEquals(5L, result.getProjectsByStatus().get("ACTIVE"));
//        assertEquals(2L, result.getProjectsByStatus().get("ARCHIVED"));
//        assertEquals(3L, result.getProjectsByStatus().get("FINISHED"));
//    }
//}