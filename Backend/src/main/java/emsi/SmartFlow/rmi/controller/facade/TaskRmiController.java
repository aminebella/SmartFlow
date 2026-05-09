package emsi.SmartFlow.rmi.controller.facade;

import emsi.SmartFlow.controller.dto.ApiResponse;
import emsi.SmartFlow.controller.dto.TaskRequest;
import emsi.SmartFlow.controller.dto.TaskResponse;
import emsi.SmartFlow.entity.enums.TaskStatus;
import emsi.SmartFlow.rmi.ITaskRemoteService;
import emsi.SmartFlow.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.rmi.RemoteException;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/rmi/tasks")
@RequiredArgsConstructor
public class TaskRmiController {

    private final ITaskRemoteService taskRmiService;

    // ── LECTURE ──────────────────────────────────────────────────────────

    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getByProject(
            @PathVariable Long projectId) {
        try {
            return ResponseEntity.ok(buildList(
                    taskRmiService.getAllTasksByProject(projectId),
                    "Tasks retrieved via RMI"));
        } catch (RemoteException e) {
            log.error("[RMI] Erreur getByProject: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(buildError("Erreur RMI: " + e.getMessage()));
        }
    }

    @GetMapping("/my-tasks")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getMyTasks(
            @AuthenticationPrincipal User currentUser) {
        try {
            return ResponseEntity.ok(buildList(
                    taskRmiService.getMyTasks(currentUser.getId()),
                    "My tasks retrieved via RMI"));
        } catch (RemoteException e) {
            log.error("[RMI] Erreur getMyTasks: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(buildError("Erreur RMI: " + e.getMessage()));
        }
    }

    @GetMapping("/project/{projectId}/backlog")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getBacklog(
            @PathVariable Long projectId,
            @AuthenticationPrincipal User currentUser) {
        try {
            return ResponseEntity.ok(buildList(
                    taskRmiService.getBacklogTasks(projectId, currentUser.getId()),
                    "Backlog retrieved via RMI"));
        } catch (RemoteException e) {
            log.error("[RMI] Erreur getBacklog: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(buildError("Erreur RMI: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ApiResponse.<TaskResponse>builder()
                    .timestamp(LocalDateTime.now()).status(200)
                    .message("Task retrieved via RMI")
                    .data(taskRmiService.getTaskById(id)).build());
        } catch (RemoteException e) {
            log.error("[RMI] Erreur getTaskById: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ── ÉCRITURE ─────────────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal User currentUser) {
        try {
            TaskResponse task = taskRmiService.createTask(request, currentUser.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    ApiResponse.<TaskResponse>builder()
                            .timestamp(LocalDateTime.now())
                            .status(HttpStatus.CREATED.value())
                            .message("Task created via RMI")
                            .data(task).build());
        } catch (RemoteException e) {
            log.error("[RMI] Erreur createTask: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal User currentUser) {
        try {
            return ResponseEntity.ok(ApiResponse.<TaskResponse>builder()
                    .timestamp(LocalDateTime.now()).status(200)
                    .message("Task updated via RMI")
                    .data(taskRmiService.updateTask(id, request, currentUser.getId())).build());
        } catch (RemoteException e) {
            log.error("[RMI] Erreur updateTask: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        try {
            taskRmiService.deleteTask(id, currentUser.getId());
            return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .timestamp(LocalDateTime.now()).status(200)
                    .message("Task deleted via RMI").data(null).build());
        } catch (RemoteException e) {
            log.error("[RMI] Erreur deleteTask: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ── ACTIONS SPÉCIALES ─────────────────────────────────────────────────

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TaskResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam TaskStatus status,
            @AuthenticationPrincipal User currentUser) {
        try {
            return ResponseEntity.ok(ApiResponse.<TaskResponse>builder()
                    .timestamp(LocalDateTime.now()).status(200)
                    .message("Status updated via RMI")
                    .data(taskRmiService.updateTaskStatus(id, status, currentUser.getId())).build());
        } catch (RemoteException e) {
            log.error("[RMI] Erreur updateStatus: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<TaskResponse>> assignTask(
            @PathVariable Long id,
            @RequestParam Long userId,
            @AuthenticationPrincipal User currentUser) {
        try {
            return ResponseEntity.ok(ApiResponse.<TaskResponse>builder()
                    .timestamp(LocalDateTime.now()).status(200)
                    .message("Task assigned via RMI")
                    .data(taskRmiService.assignTask(id, userId, currentUser.getId())).build());
        } catch (RemoteException e) {
            log.error("[RMI] Erreur assignTask: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PatchMapping("/{id}/move-to-sprint")
    public ResponseEntity<ApiResponse<TaskResponse>> moveToSprint(
            @PathVariable Long id,
            @RequestParam Long sprintId,
            @AuthenticationPrincipal User currentUser) {
        try {
            return ResponseEntity.ok(ApiResponse.<TaskResponse>builder()
                    .timestamp(LocalDateTime.now()).status(200)
                    .message("Task moved to sprint via RMI")
                    .data(taskRmiService.moveTaskToSprint(id, sprintId, currentUser.getId())).build());
        } catch (RemoteException e) {
            log.error("[RMI] Erreur moveToSprint: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ── HELPERS ───────────────────────────────────────────────────────────

    private ApiResponse<List<TaskResponse>> buildList(List<TaskResponse> data, String message) {
        return ApiResponse.<List<TaskResponse>>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message(message).data(data).build();
    }

    private ApiResponse<List<TaskResponse>> buildError(String message) {
        return ApiResponse.<List<TaskResponse>>builder()
                .timestamp(LocalDateTime.now()).status(500)
                .message(message).data(null).build();
    }
}