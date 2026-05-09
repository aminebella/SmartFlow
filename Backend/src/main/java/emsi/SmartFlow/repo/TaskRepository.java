package emsi.SmartFlow.repo;

import emsi.SmartFlow.entity.Task;
import emsi.SmartFlow.entity.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // ── Existantes (inchangées) ──────────────────────────────────────────

    List<Task> findByProjectId(Long projectId);

    List<Task> findBySprintId(Long sprintId);

    List<Task> findByProjectIdAndStatus(Long projectId, TaskStatus status);

    List<Task> findByProjectIdAndSprintIdIsNull(Long projectId);

    List<Task> findByProjectIdAndAssignedUserId(Long projectId, Long userId);

    List<Task> findByAssignedUserId(Long userId);

    List<Task> findBySprintIdAndAssignedUserId(Long sprintId, Long userId);

    List<Task> findByProjectIdAndStatusAndAssignedUserId(
            Long projectId, TaskStatus status, Long userId
    );

    // Amine 's Part
    // Count tasks by status
    long countByStatus(TaskStatus status);

    // Count tasks created between two datetimes
    long countByCreatedAtBetween(LocalDateTime from, LocalDateTime to);

    // Aggregate tasks count grouped by year and month
    @Query("SELECT FUNCTION('YEAR', t.createdAt) as yr, FUNCTION('MONTH', t.createdAt) as m, COUNT(t) as cnt " +
            "FROM Task t " +
            "WHERE t.createdAt BETWEEN :from AND :to " +
            "GROUP BY FUNCTION('YEAR', t.createdAt), FUNCTION('MONTH', t.createdAt) " +
            "ORDER BY FUNCTION('YEAR', t.createdAt), FUNCTION('MONTH', t.createdAt)")
    List<Object[]> countGroupedByYearMonth(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    // Aggregate tasks count grouped by day
    @Query("SELECT FUNCTION('DAY', t.createdAt) as d, COUNT(t) as cnt " +
            "FROM Task t " +
            "WHERE t.createdAt BETWEEN :from AND :to " +
            "GROUP BY FUNCTION('DAY', t.createdAt) " +
            "ORDER BY FUNCTION('DAY', t.createdAt)")
    List<Object[]> countGroupedByDay(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    // Count tasks for a specific project
    long countByProjectId(Long projectId);

    // Count tasks with given status for a specific project
    long countByProjectIdAndStatus(Long projectId, TaskStatus status);

    // Count tasks assigned to a user by status
    long countByAssignedUserIdAndStatus(Long assignedUserId, TaskStatus status);

    // Find top 5 recent tasks assigned to a user
    List<Task> findTop5ByAssignedUserIdOrderByCreatedAtDesc(Long assignedUserId);

    // Find top 5 recent tasks by assigned user and status
    @Query("SELECT t FROM Task t WHERE t.assignedUser.id = :userId AND t.status IN :statuses ORDER BY t.createdAt DESC")
    List<Task> findTop5ByAssignedUserIdAndStatusInOrderByCreatedAtDesc(
        @Param("userId") Long userId, 
        @Param("statuses") List<TaskStatus> statuses
    );
}