package emsi.SmartFlow.service.facade;

import emsi.SmartFlow.controller.dto.TaskRequest;
import emsi.SmartFlow.controller.dto.TaskResponse;
import emsi.SmartFlow.entity.enums.TaskStatus;
import emsi.SmartFlow.user.User;

import java.util.List;

public interface TaskService {

    // ── CRUD de base ─────────────────────────────────────────────────────

    TaskResponse createTask(TaskRequest request, User currentUser);
    TaskResponse getTaskById(String id);
    TaskResponse updateTask(String id, TaskRequest request, User currentUser);
    void deleteTask(String id, User currentUser);

    // ── Lecture toutes tâches (sans filtre rôle) ─────────────────────────

    /**
     * Toutes les tâches du projet — sans filtre de rôle
     * Utilisé pour le tab "All" visible par tous les membres
     */
    List<TaskResponse> getAllTasksByProject(String projectId);

    // ── Lecture filtrée par rôle ─────────────────────────────────────────

    /**
     * MANAGER  → toutes les tâches du projet
     * MEMBER   → uniquement ses tâches assignées
     */
    List<TaskResponse> getTasksByProjectForCurrentUser(String projectId, User currentUser);

    /**
     * Toutes les tâches assignées à l'user connecté (tous projets)
     */
    List<TaskResponse> getMyTasks(User currentUser);

    /**
     * MANAGER  → toutes les tâches du sprint
     * MEMBER   → ses tâches dans ce sprint
     */
    List<TaskResponse> getTasksBySprintForCurrentUser(String sprintId, User currentUser);

    /**
     * MANAGER  → toutes les tâches du projet avec ce statut
     * MEMBER   → ses tâches avec ce statut
     */
    List<TaskResponse> getTasksByProjectAndStatusForCurrentUser(
            String projectId, TaskStatus status, User currentUser
    );

    /**
     * MANAGER  → toutes les tâches sans sprint
     * MEMBER   → ses tâches sans sprint
     */
    List<TaskResponse> getBacklogTasksForCurrentUser(String projectId, User currentUser);

    // ── Actions spéciales ────────────────────────────────────────────────

    /** MEMBER peut changer le statut de ses propres tâches */
    TaskResponse updateTaskStatus(String id, TaskStatus newStatus, User currentUser);

    /** MANAGER uniquement */
    TaskResponse assignTask(String taskId, String userId, User currentUser);

    /** MANAGER uniquement */
    TaskResponse moveTaskToSprint(String taskId, String sprintId, User currentUser);
}