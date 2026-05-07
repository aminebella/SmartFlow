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
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getByProject(
            @PathVariable Long projectId
    ) {
        return ResponseEntity.ok(buildList(
                taskService.getAllTasksByProject(projectId),
                "Tasks retrieved"));
    }

    @GetMapping("/my-tasks")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getMyTasks(
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(buildList(
                taskService.getMyTasks(currentUser),
                "My tasks retrieved"));
    }

    @GetMapping("/sprint/{sprintId}")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getBySprint(
            @PathVariable Long sprintId,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(buildList(
                taskService.getTasksBySprintForCurrentUser(sprintId, currentUser),
                "Sprint tasks retrieved"));
    }

    @GetMapping("/project/{projectId}/status")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getByStatus(
            @PathVariable Long projectId,
            @RequestParam TaskStatus status,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(buildList(
                taskService.getTasksByProjectAndStatusForCurrentUser(projectId, status, currentUser),
                "Tasks filtered by status"));
    }

    @GetMapping("/project/{projectId}/backlog")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getBacklog(
            @PathVariable Long projectId,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(buildList(
                taskService.getBacklogTasksForCurrentUser(projectId, currentUser),
                "Backlog retrieved"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.<TaskResponse>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message("Task retrieved successfully")
                .data(taskService.getTaskById(id)).build());
    }

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

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(ApiResponse.<TaskResponse>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message("Task updated successfully")
                .data(taskService.updateTask(id, request, currentUser)).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        taskService.deleteTask(id, currentUser);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message("Task deleted successfully").data(null).build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TaskResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam TaskStatus status,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(ApiResponse.<TaskResponse>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message("Status updated")
                .data(taskService.updateTaskStatus(id, status, currentUser)).build());
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<TaskResponse>> assignTask(
            @PathVariable Long id,
            @RequestParam Long userId,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(ApiResponse.<TaskResponse>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message("Task assigned")
                .data(taskService.assignTask(id, userId, currentUser)).build());
    }

    @PatchMapping("/{id}/move-to-sprint")
    public ResponseEntity<ApiResponse<TaskResponse>> moveToSprint(
            @PathVariable Long id,
            @RequestParam Long sprintId,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(ApiResponse.<TaskResponse>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message("Task moved to sprint")
                .data(taskService.moveTaskToSprint(id, sprintId, currentUser)).build());
    }

    private ApiResponse<List<TaskResponse>> buildList(List<TaskResponse> data, String message) {
        return ApiResponse.<List<TaskResponse>>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message(message).data(data).build();
    }
}