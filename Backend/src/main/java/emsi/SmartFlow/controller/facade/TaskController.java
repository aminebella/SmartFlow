package emsi.SmartFlow.controller.facade;

import emsi.SmartFlow.controller.dto.ApiResponse;
import emsi.SmartFlow.controller.dto.TaskRequest;
import emsi.SmartFlow.controller.dto.TaskResponse;
import emsi.SmartFlow.entity.enums.TaskStatus;
import emsi.SmartFlow.service.facade.TaskService;
import emsi.SmartFlow.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    // ── LECTURE ──────────────────────────────────────────────────────────

    /**
     * GET /api/tasks/project/{projectId}
     * Retourne TOUTES les tâches du projet — tab "All"
     * Visible par tous les membres sans filtre de rôle
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getByProject(
            @PathVariable String projectId
    ) {
        return ResponseEntity.ok(buildList(
                taskService.getAllTasksByProject(projectId),
                "Tasks retrieved"));
    }

    /**
     * GET /api/tasks/my-tasks
     * Toutes les tâches assignées à l'user connecté (tous projets)
     * Utilisé pour le tab "My Tickets"
     */
    @GetMapping("/my-tasks")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getMyTasks(
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(buildList(
                taskService.getMyTasks(currentUser),
                "My tasks retrieved"));
    }

    /**
     * GET /api/tasks/sprint/{sprintId}
     * MANAGER → tout le sprint
     * MEMBER  → ses tâches dans ce sprint
     */
    @GetMapping("/sprint/{sprintId}")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getBySprint(
            @PathVariable String sprintId,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(buildList(
                taskService.getTasksBySprintForCurrentUser(sprintId, currentUser),
                "Sprint tasks retrieved"));
    }

    /**
     * GET /api/tasks/project/{projectId}/status?status=IN_PROGRESS
     */
    @GetMapping("/project/{projectId}/status")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getByStatus(
            @PathVariable String projectId,
            @RequestParam TaskStatus status,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(buildList(
                taskService.getTasksByProjectAndStatusForCurrentUser(projectId, status, currentUser),
                "Tasks filtered by status"));
    }

    /**
     * GET /api/tasks/project/{projectId}/backlog
     */
    @GetMapping("/project/{projectId}/backlog")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getBacklog(
            @PathVariable String projectId,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(buildList(
                taskService.getBacklogTasksForCurrentUser(projectId, currentUser),
                "Backlog retrieved"));
    }

    /**
     * GET /api/tasks/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.<TaskResponse>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message("Task retrieved successfully")
                .data(taskService.getTaskById(id)).build());
    }

    // ── ÉCRITURE ─────────────────────────────────────────────────────────

    /**
     * POST /api/tasks
     * MANAGER uniquement
     */
    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        TaskResponse task = taskService.createTask(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<TaskResponse>builder()
                        .timestamp(LocalDateTime.now())
                        .status(HttpStatus.CREATED.value())
                        .message("Task created successfully")
                        .data(task).build());
    }

    /**
     * PUT /api/tasks/{id}
     * MANAGER → modifie tout
     * MEMBER  → modifie seulement ses tâches
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable String id,
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(ApiResponse.<TaskResponse>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message("Task updated successfully")
                .data(taskService.updateTask(id, request, currentUser)).build());
    }

    /**
     * DELETE /api/tasks/{id}
     * MANAGER uniquement
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable String id,
            @AuthenticationPrincipal User currentUser
    ) {
        taskService.deleteTask(id, currentUser);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message("Task deleted successfully").data(null).build());
    }

    // ── ACTIONS SPÉCIALES (PATCH) ─────────────────────────────────────────

    /**
     * PATCH /api/tasks/{id}/status?status=DONE
     * MANAGER → n'importe quelle tâche
     * MEMBER  → seulement ses tâches
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TaskResponse>> updateStatus(
            @PathVariable String id,
            @RequestParam TaskStatus status,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(ApiResponse.<TaskResponse>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message("Status updated")
                .data(taskService.updateTaskStatus(id, status, currentUser)).build());
    }

    /**
     * PATCH /api/tasks/{id}/assign?userId=xxx
     * MANAGER uniquement
     */
    @PatchMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<TaskResponse>> assignTask(
            @PathVariable String id,
            @RequestParam String userId,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(ApiResponse.<TaskResponse>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message("Task assigned")
                .data(taskService.assignTask(id, userId, currentUser)).build());
    }

    /**
     * PATCH /api/tasks/{id}/move-to-sprint?sprintId=xxx
     * MANAGER uniquement
     */
    @PatchMapping("/{id}/move-to-sprint")
    public ResponseEntity<ApiResponse<TaskResponse>> moveToSprint(
            @PathVariable String id,
            @RequestParam String sprintId,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(ApiResponse.<TaskResponse>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message("Task moved to sprint")
                .data(taskService.moveTaskToSprint(id, sprintId, currentUser)).build());
    }

    // ── HELPER ───────────────────────────────────────────────────────────

    private ApiResponse<List<TaskResponse>> buildList(List<TaskResponse> data, String message) {
        return ApiResponse.<List<TaskResponse>>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message(message).data(data).build();
    }
}