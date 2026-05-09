package emsi.SmartFlow.service.impl;

import emsi.SmartFlow.controller.dto.ProjectDashboardSummary.ProjectDashboardSummary;
import emsi.SmartFlow.entity.Sprint;
import emsi.SmartFlow.entity.Task;
import emsi.SmartFlow.entity.enums.SprintStatus;
import emsi.SmartFlow.entity.enums.TaskStatus;
import emsi.SmartFlow.repo.ProjectRepository;
import emsi.SmartFlow.repo.ProjectTeamRepository;
import emsi.SmartFlow.repo.SprintRepo;
import emsi.SmartFlow.repo.TaskRepository;
import emsi.SmartFlow.service.facade.ProjectDashboardService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Implementation of ProjectDashboardService.
 * Path: service/impl/ProjectDashboardServiceImpl.java
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectDashboardServiceImpl implements ProjectDashboardService {

    private final ProjectRepository     projectRepo;
    private final ProjectTeamRepository projectTeamRepo;
    private final SprintRepo            sprintRepo;
    private final TaskRepository        taskRepo;

    @Override
    public ProjectDashboardSummary getDashboard(Long projectId, Long currentUserId) {

        // 1. Verify project exists
        if (!projectRepo.existsById(projectId)) {
            throw new EntityNotFoundException("Project not found: " + projectId);
        }

        // 2. Verify user is a member of the project
        boolean isMember = projectTeamRepo.existsByProjectIdAndUserId(projectId, currentUserId);
        if (!isMember) {
            throw new AccessDeniedException("You are not a member of this project");
        }

        // ── 3. Sprint progress: % of sprints that are COMPLETED ──────────
        List<Sprint> allSprints = sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(projectId);
        int totalSprints      = allSprints.size();
        long completedSprints = allSprints.stream()
                .filter(s -> s.getStatus() == SprintStatus.COMPLETED)
                .count();
        int sprintProgress = totalSprints == 0 ? 0
                : (int) Math.round((completedSprints * 100.0) / totalSprints);

        // ── 4. Task KPIs ──────────────────────────────────────────────────
        List<Task> allTasks  = taskRepo.findByProjectId(projectId);
        long tasksDone       = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count();
        long activeTasks     = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();

        // ── 5. Team member count ──────────────────────────────────────────
        var teamMembers = projectTeamRepo.findByProjectIdWithClient(projectId);
        int memberCount = teamMembers.size();

        // ── 6. Active sprints with per-sprint task breakdown ──────────────
        // Group all tasks by sprintId for efficient lookup
        Map<Long, List<Task>> tasksBySprint = allTasks.stream()
                .filter(t -> t.getSprintId() != null)
                .collect(Collectors.groupingBy(Task::getSprintId));

        List<ProjectDashboardSummary.SprintInfo> activeSprints = allSprints.stream()
                .filter(s -> s.getStatus() == SprintStatus.ACTIVE)
                .map(s -> {
                    List<Task> sprintTasks = tasksBySprint.getOrDefault(s.getId(), List.of());
                    long done  = sprintTasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count();
                    long total = sprintTasks.size();
                    int  pct   = total == 0 ? 0 : (int) Math.round((done * 100.0) / total);

                    // Breakdown by each status
                    Map<String, Long> byStatus = new LinkedHashMap<>();
                    byStatus.put("TODO",        sprintTasks.stream().filter(t -> t.getStatus() == TaskStatus.TODO).count());
                    byStatus.put("IN_PROGRESS", sprintTasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count());
                    byStatus.put("REVIEW",      sprintTasks.stream().filter(t -> t.getStatus() == TaskStatus.REVIEW).count());
                    byStatus.put("DONE",        done);

                    // Use the nested class with its full outer class name to avoid ambiguity
                    return ProjectDashboardSummary.SprintInfo.builder()
                            .id(s.getId())
                            .title(s.getTitle())
                            .goal(s.getGoal())
                            .startDate(s.getStartDate())
                            .endDate(s.getEndDate())
                            .status(s.getStatus())
                            .doneTasks(done)
                            .totalTasks(total)
                            .progress(pct)
                            .tasksByStatus(byStatus)
                            .build();
                })
                .collect(Collectors.toList());

        // ── 7. Members with assigned task count ───────────────────────────
        Map<Long, Long> tasksPerUser = allTasks.stream()
                .filter(t -> t.getAssignedUser() != null)
                .collect(Collectors.groupingBy(
                        t -> t.getAssignedUser().getId(),
                        Collectors.counting()
                ));

        List<ProjectDashboardSummary.MemberInfo> members = teamMembers.stream()
                .map(pt -> ProjectDashboardSummary.MemberInfo.builder()
                        .clientId(pt.getClient().getId())
                        .fullName(pt.getClient().getFirstname() + " " + pt.getClient().getLastname())
                        .postTitle(pt.getClient().getPostTitle())
                        .role(pt.getProjectRole().name())
                        .assignedTasks(tasksPerUser.getOrDefault(pt.getClient().getId(), 0L))
                        .build())
                .collect(Collectors.toList());

        // ── 8. Full task list for this project ────────────────────────────
        List<ProjectDashboardSummary.TaskInfo> taskInfos = allTasks.stream()
                .map(t -> ProjectDashboardSummary.TaskInfo.builder()
                        .id(t.getId())
                        .title(t.getTitle())
                        .priority(t.getPriority())
                        .status(t.getStatus())
                        .assignedUserId(t.getAssignedUser() != null ? t.getAssignedUser().getId() : null)
                        .assignedUserFullName(t.getAssignedUser() != null ? t.getAssignedUser().getFullName() : null)
                        .sprintId(t.getSprintId())
                        .build())
                .collect(Collectors.toList());

        // ── 9. Assemble and return ────────────────────────────────────────
        return ProjectDashboardSummary.builder()
                .sprintProgress(sprintProgress)
                .tasksDone(tasksDone)
                .activeTasks(activeTasks)
                .teamMemberCount(memberCount)
                .activeSprints(activeSprints)
                .members(members)
                .tasks(taskInfos)
                .build();
    }
}
