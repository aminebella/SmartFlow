package emsi.SmartFlow.service.impl;

import emsi.SmartFlow.controller.dto.AdminDashboardSummary;
import emsi.SmartFlow.entity.enums.ProjectStatus;
import emsi.SmartFlow.entity.enums.TaskStatus;
import emsi.SmartFlow.repo.ProjectRepository;
import emsi.SmartFlow.repo.TaskRepository;
import emsi.SmartFlow.user.UserRepository;
import emsi.SmartFlow.service.DashboardService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public DashboardServiceImpl(ProjectRepository projectRepository, TaskRepository taskRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @Override
    public AdminDashboardSummary getAdminSummaryCurrentMonth() {
        LocalDateTime now = LocalDateTime.now();
        YearMonth current = YearMonth.from(now);
        LocalDateTime from = current.atDay(1).atStartOfDay();
        LocalDateTime to = current.atEndOfMonth().atTime(23,59,59);
        return buildSummary(from, to);
    }

    @Override
    public AdminDashboardSummary getAdminReportForYear(int year) {
        LocalDateTime from = LocalDateTime.of(year, 1, 1, 0, 0);
        LocalDateTime to = LocalDateTime.of(year, 12, 31, 23, 59, 59);
        return buildSummary(from, to);
    }

    private AdminDashboardSummary buildSummary(LocalDateTime from, LocalDateTime to){
        AdminDashboardSummary summary = new AdminDashboardSummary();

        long activeProjects = projectRepository.countByStatus(ProjectStatus.ACTIVE);
        long users = userRepository.countNonAdminUsers();
        long tasksDone = taskRepository.countByStatus(TaskStatus.DONE);
        long totalTasks = taskRepository.count();
        double productivity = totalTasks == 0 ? 0 : (tasksDone * 100.0) / totalTasks;

        summary.setActiveProjects(activeProjects);
        summary.setUsers(users);
        summary.setTasksDone(tasksDone);
        summary.setProductivity(productivity);

        // projects activity grouped by year/month in the range
        List<Object[]> projGrouped = projectRepository.countGroupedByYearMonth(from, to);
        List<AdminDashboardSummary.YearMonthPoint> projPoints = projGrouped.stream().map(arr->
                new AdminDashboardSummary.YearMonthPoint(((Number)arr[0]).intValue(), ((Number)arr[1]).intValue(), ((Number)arr[2]).longValue())
        ).collect(Collectors.toList());
        summary.setProjectsActivity(projPoints);

        // tasks activity grouped
        List<Object[]> taskGrouped = taskRepository.countGroupedByYearMonth(from, to);
        List<AdminDashboardSummary.YearMonthPoint> taskPoints = taskGrouped.stream().map(arr->
                new AdminDashboardSummary.YearMonthPoint(((Number)arr[0]).intValue(), ((Number)arr[1]).intValue(), ((Number)arr[2]).longValue())
        ).collect(Collectors.toList());
        summary.setTasksActivity(taskPoints);

    // If the range is within a single month, also populate daily activity lists
    if (from.getYear() == to.getYear() && from.getMonth() == to.getMonth()) {
        List<Object[]> projByDay = projectRepository.countGroupedByDay(from, to);
        List<AdminDashboardSummary.DayPoint> projDayPoints = projByDay.stream().map(arr ->
            new AdminDashboardSummary.DayPoint(((Number)arr[0]).intValue(), ((Number)arr[1]).longValue())
        ).collect(Collectors.toList());
        summary.setProjectsActivityDaily(projDayPoints);

        List<Object[]> taskByDay = taskRepository.countGroupedByDay(from, to);
        List<AdminDashboardSummary.DayPoint> taskDayPoints = taskByDay.stream().map(arr ->
            new AdminDashboardSummary.DayPoint(((Number)arr[0]).intValue(), ((Number)arr[1]).longValue())
        ).collect(Collectors.toList());
        summary.setTasksActivityDaily(taskDayPoints);
    }

        // projects by status
        Map<String, Long> byStatus = new HashMap<>();
        for (ProjectStatus s : ProjectStatus.values()){
            byStatus.put(s.name(), projectRepository.countByStatus(s));
        }
        summary.setProjectsByStatus(byStatus);

        return summary;
    }
}
