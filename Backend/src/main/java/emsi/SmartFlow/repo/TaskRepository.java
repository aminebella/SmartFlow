package emsi.SmartFlow.repo;

import emsi.SmartFlow.entity.Task;
import emsi.SmartFlow.entity.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, String> {

    // ── Existantes (inchangées) ──────────────────────────────────────────

    /** MANAGER : toutes les tâches d'un projet */
    List<Task> findByProjectId(String projectId);

    /** Toutes les tâches d'un sprint */
    List<Task> findBySprintId(String sprintId);

    /** Kanban : tâches par statut dans un projet */
    List<Task> findByProjectIdAndStatus(String projectId, TaskStatus status);

    /** Backlog : tâches sans sprint */
    List<Task> findByProjectIdAndSprintIdIsNull(String projectId);

    // ── Nouvelles : accès par rôle ───────────────────────────────────────

    /** MEMBER : ses tâches dans un projet */
    List<Task> findByProjectIdAndAssignedUserId(String projectId, Long userId);

    /** Toutes les tâches assignées à un user (tous projets) */
    List<Task> findByAssignedUserId(Long userId);

    /** Tâches assignées à un user dans un sprint */
    List<Task> findBySprintIdAndAssignedUserId(String sprintId, Long userId);

    /** Tâches assignées à un user filtrées par statut */
    List<Task> findByProjectIdAndStatusAndAssignedUserId(
            String projectId, TaskStatus status, Long userId
    );
}