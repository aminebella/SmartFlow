package emsi.SmartFlow.service.impl;

import emsi.SmartFlow.controller.dto.ClientDashboardSummary;
import emsi.SmartFlow.entity.Client;
import emsi.SmartFlow.user.User;
import emsi.SmartFlow.entity.ProjectTeam;
import emsi.SmartFlow.entity.Task;
import emsi.SmartFlow.entity.Project;
import emsi.SmartFlow.entity.enums.ProjectStatus;
import emsi.SmartFlow.entity.enums.TaskStatus;
import emsi.SmartFlow.repo.ProjectRepository;
import emsi.SmartFlow.repo.ProjectTeamRepository;
import emsi.SmartFlow.repo.TaskRepository;
import emsi.SmartFlow.service.ClientDashboardService;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientDashboardServiceImpl implements ClientDashboardService {

    private final ProjectRepository projectRepository;
    private final ProjectTeamRepository projectTeamRepository;
    private final TaskRepository taskRepository;

    public ClientDashboardServiceImpl(ProjectRepository projectRepository, 
                                    ProjectTeamRepository projectTeamRepository,
                                    TaskRepository taskRepository) {
        this.projectRepository = projectRepository;
        this.projectTeamRepository = projectTeamRepository;
        this.taskRepository = taskRepository;
    }

    @Override
    public ClientDashboardSummary getClientSummary(User currentUser) {
        if (!(currentUser instanceof Client)) {
            throw new IllegalArgumentException("User must be a client");
        }

        Client client = (Client) currentUser;
        Long clientId = client.getId();

        ClientDashboardSummary summary = new ClientDashboardSummary();

        // Get all projects where client is member or manager
        List<ProjectTeam> projectTeams = projectTeamRepository.findByClientId(clientId);
        List<Long> projectIds = projectTeams.stream()
                .map(pt -> pt.getProject().getId())
                .collect(Collectors.toList());

        // Project statistics
        long totalProjects = projectIds.size();
        long activeProjects = projectRepository.countByIdInAndStatus(projectIds, ProjectStatus.ACTIVE);
        long finishedProjects = projectRepository.countByIdInAndStatus(projectIds, ProjectStatus.FINISHED);

        // Task statistics for this client
        long tasksDone = taskRepository.countByAssignedUserIdAndStatus(clientId, TaskStatus.DONE);
        long tasksTodo = taskRepository.countByAssignedUserIdAndStatus(clientId, TaskStatus.TODO);

        // Calculate productivity
        double productivity = 0.0;
        if (tasksDone > 0 || tasksTodo > 0) {
            productivity = (double) tasksDone / (tasksDone + tasksTodo) * 100;
        }

        // Get recent tasks assigned to client
        List<Task> recentTasks = taskRepository.findTop5ByAssignedUserIdOrderByCreatedAtDesc(clientId);
        List<ClientDashboardSummary.TaskSummary> taskSummaries = recentTasks.stream()
                .map(task -> {
                    // Get project info from repository since Task only has projectId
                    Project project = projectRepository.findById(task.getProjectId()).orElse(null);
                    return new ClientDashboardSummary.TaskSummary(
                            task.getTitle(),
                            project != null ? project.getName() : "Unknown Project",
                            String.valueOf(task.getProjectId()),
                            task.getStatus().toString(),
                            task.getEstimatedEndDate() != null ? task.getEstimatedEndDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) : null
                    );
                })
                .collect(Collectors.toList());

        // Set summary values
        summary.setTotalProjects(totalProjects);
        summary.setActiveProjects(activeProjects);
        summary.setFinishedProjects(finishedProjects);
        summary.setTasksDone(tasksDone);
        summary.setTasksTodo(tasksTodo);
        summary.setProductivity(Math.round(productivity * 10.0) / 10.0); // Round to 1 decimal
        summary.setRecentTasks(taskSummaries);

        return summary;
    }
}
