package emsi.SmartFlow.service.facade;

import emsi.SmartFlow.controller.dto.ProjectDashboardSummary.ProjectDashboardSummary;

/**
 * Service interface for the project-specific dashboard.
 * Path: service/facade/ProjectDashboardService.java  (same package as ProjectService, SprintService, etc.)
 */
public interface ProjectDashboardService {

    /**
     * Build the full dashboard summary for a specific project.
     * @param projectId  the project to summarize
     * @param currentUserId  used to verify membership (passed from controller)
     */
    ProjectDashboardSummary getDashboard(Long projectId, Long currentUserId);
}
