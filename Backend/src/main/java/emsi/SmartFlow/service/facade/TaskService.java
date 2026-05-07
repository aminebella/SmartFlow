package emsi.SmartFlow.service.facade;

import emsi.SmartFlow.controller.dto.TaskRequest;
import emsi.SmartFlow.controller.dto.TaskResponse;
import emsi.SmartFlow.entity.enums.TaskStatus;
import emsi.SmartFlow.user.User;

import java.util.List;

public interface TaskService {

    // ── CRUD de base ─────────────────────────────────────────────────────

    TaskResponse createTask(TaskRequest request, User currentUser);
    TaskResponse getTaskById(Long id);
    TaskResponse updateTask(Long id, TaskRequest request, User currentUser);
    void deleteTask(Long id, User currentUser);

    // ── Lecture toutes tâches (sans filtre rôle) ─────────────────────────

    List<TaskResponse> getAllTasksByProject(Long projectId);

    // ── Lecture filtrée par rôle ─────────────────────────────────────────

    List<TaskResponse> getTasksByProjectForCurrentUser(Long projectId, User currentUser);

    List<TaskResponse> getMyTasks(User currentUser);

    List<TaskResponse> getTasksBySprintForCurrentUser(Long sprintId, User currentUser);

    List<TaskResponse> getTasksByProjectAndStatusForCurrentUser(
            Long projectId, TaskStatus status, User currentUser
    );

    List<TaskResponse> getBacklogTasksForCurrentUser(Long projectId, User currentUser);

    // ── Actions spéciales ────────────────────────────────────────────────

    TaskResponse updateTaskStatus(Long id, TaskStatus newStatus, User currentUser);

    TaskResponse assignTask(Long taskId, Long userId, User currentUser);

    TaskResponse moveTaskToSprint(Long taskId, Long sprintId, User currentUser);
}