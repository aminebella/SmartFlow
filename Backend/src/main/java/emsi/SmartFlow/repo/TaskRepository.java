package emsi.SmartFlow.repo;

import emsi.SmartFlow.entity.Task;
import emsi.SmartFlow.entity.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, String> {

    // Toutes les tâches d'un projet
    List<Task> findByProjectId(String projectId);

    // Toutes les tâches d'un sprint
    List<Task> findBySprintId(String sprintId);

    // Kanban : tâches par statut
    List<Task> findByProjectIdAndStatus(String projectId, TaskStatus status);

    // Backlog : sprintId est null  ← correction ici
    List<Task> findByProjectIdAndSprintIdIsNull(String projectId);
}