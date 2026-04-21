package emsi.SmartFlow.controller.facade;

import emsi.SmartFlow.controller.dto.ApiResponse;
import emsi.SmartFlow.controller.dto.TaskRequest;
import emsi.SmartFlow.controller.dto.TaskResponse;
import emsi.SmartFlow.entity.enums.TaskStatus;
import emsi.SmartFlow.service.facade.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(@Valid @RequestBody TaskRequest request) {
        TaskResponse task = taskService.createTask(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<TaskResponse>builder()
                        .timestamp(LocalDateTime.now())
                        .status(HttpStatus.CREATED.value())
                        .message("Task created successfully")
                        .data(task).build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.<TaskResponse>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message("Task retrieved successfully")
                .data(taskService.getTaskById(id)).build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable String id, @Valid @RequestBody TaskRequest request) {
        return ResponseEntity.ok(ApiResponse.<TaskResponse>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message("Task updated successfully")
                .data(taskService.updateTask(id, request)).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable String id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message("Task deleted successfully").data(null).build());
    }

    // Toutes les tâches d'un projet
    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getByProject(@PathVariable String projectId) {
        return ResponseEntity.ok(buildList(taskService.getTasksByProject(projectId), "Tasks retrieved"));
    }

    // Tâches d'un sprint
    @GetMapping("/sprint/{sprintId}")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getBySprint(@PathVariable String sprintId) {
        return ResponseEntity.ok(buildList(taskService.getTasksBySprint(sprintId), "Sprint tasks retrieved"));
    }

    // Kanban : GET /api/tasks/project/{id}/status?status=IN_PROGRESS
    @GetMapping("/project/{projectId}/status")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getByStatus(
            @PathVariable String projectId, @RequestParam TaskStatus status) {
        return ResponseEntity.ok(buildList(taskService.getTasksByProjectAndStatus(projectId, status), "Tasks filtered"));
    }

    // Backlog : tâches sans sprint
    @GetMapping("/project/{projectId}/backlog")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getBacklog(@PathVariable String projectId) {
        return ResponseEntity.ok(buildList(taskService.getBacklogTasks(projectId), "Backlog retrieved"));
    }

    // PATCH /api/tasks/{id}/status?status=DONE
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TaskResponse>> updateStatus(
            @PathVariable String id, @RequestParam TaskStatus status) {
        return ResponseEntity.ok(ApiResponse.<TaskResponse>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message("Status updated").data(taskService.updateTaskStatus(id, status)).build());
    }

    // PATCH /api/tasks/{id}/assign?userId=xxx
    @PatchMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<TaskResponse>> assignTask(
            @PathVariable String id, @RequestParam String userId) {
        return ResponseEntity.ok(ApiResponse.<TaskResponse>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message("Task assigned").data(taskService.assignTask(id, userId)).build());
    }

    // PATCH /api/tasks/{id}/move-to-sprint?sprintId=xxx
    @PatchMapping("/{id}/move-to-sprint")
    public ResponseEntity<ApiResponse<TaskResponse>> moveToSprint(
            @PathVariable String id, @RequestParam String sprintId) {
        return ResponseEntity.ok(ApiResponse.<TaskResponse>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message("Task moved to sprint").data(taskService.moveTaskToSprint(id, sprintId)).build());
    }

    private ApiResponse<List<TaskResponse>> buildList(List<TaskResponse> data, String message) {
        return ApiResponse.<List<TaskResponse>>builder()
                .timestamp(LocalDateTime.now()).status(200)
                .message(message).data(data).build();
    }
}