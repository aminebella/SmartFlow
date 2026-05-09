package emsi.SmartFlow.controller.facade;

import emsi.SmartFlow.controller.dto.ApiResponse;
import emsi.SmartFlow.controller.dto.ProjectDashboardSummary.ProjectDashboardSummary;
import emsi.SmartFlow.service.facade.ProjectDashboardService;
import emsi.SmartFlow.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

/**
 * Endpoint: GET /api/v1/projects/{projectId}/dashboard
 *
 * Path: controller/facade/ProjectDashboardController.java
 * (same package as AdminDashboardController, ClientDashboardController, etc.)
 *
 * Security: any authenticated user who is a member/manager of the project.
 * The service layer enforces the membership check.
 */
@RestController
@RequestMapping("projects/{projectId}/dashboard")
@RequiredArgsConstructor
public class ProjectDashboardController {

    private final ProjectDashboardService projectDashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<ProjectDashboardSummary>> getDashboard(
            @PathVariable Long projectId,
            @AuthenticationPrincipal User currentUser
    ) {
        ProjectDashboardSummary summary =
                projectDashboardService.getDashboard(projectId, currentUser.getId());

        return ResponseEntity.ok(
                ApiResponse.<ProjectDashboardSummary>builder()
                        .timestamp(LocalDateTime.now())
                        .status(200)
                        .message("Project dashboard retrieved")
                        .data(summary)
                        .build()
        );
    }
}
