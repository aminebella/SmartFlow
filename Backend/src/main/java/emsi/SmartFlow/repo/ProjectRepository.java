// src/main/java/emsi/SmartFlow/repo/ProjectRepository.java

package emsi.SmartFlow.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

import emsi.SmartFlow.entity.Project;
import emsi.SmartFlow.entity.enums.ProjectStatus;
import java.time.LocalDateTime;
import java.util.Map;
import org.springframework.data.jpa.repository.Query;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    // Client sees only their projects — filter by status too
    @Query("SELECT p FROM Project p JOIN p.projectTeams pt WHERE pt.client.id = :clientId AND p.status = :status")
    List<Project> findAllByClientIdAndStatus(@Param("clientId") Long clientId, @Param("status") ProjectStatus status);

    // All projects of a client regardless of status
    @Query("SELECT p FROM Project p JOIN p.projectTeams pt WHERE pt.client.id = :clientId")
    List<Project> findAllByClientId(@Param("clientId") Long clientId);

    // For admin: all projects regardless of status
    // JpaRepository.findAll() already handles this
    Page<Project> findAll(Pageable pageable);

    // Admin sees all projects filter by status
    Page<Project> findAllByStatus(ProjectStatus status, Pageable pageable);

    // Check name uniqueness per owner before creating
    boolean existsByNameAndOwnerId(String name, Long ownerId);

    // Count projects by status
    long countByStatus(ProjectStatus status);

    // Count projects created between two datetimes
    long countByCreatedAtBetween(LocalDateTime from, LocalDateTime to);

    // Aggregate projects count grouped by year and month
    @Query("SELECT YEAR(p.createdAt) as yr, MONTH(p.createdAt) as m, COUNT(p) as cnt FROM Project p WHERE p.createdAt BETWEEN :from AND :to GROUP BY YEAR(p.createdAt), MONTH(p.createdAt) ORDER BY yr, m")
    List<Object[]> countGroupedByYearMonth(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    // Aggregate projects count grouped by day (useful for month activity)
    @Query("SELECT DAY(p.createdAt) as d, COUNT(p) as cnt FROM Project p WHERE p.createdAt BETWEEN :from AND :to GROUP BY DAY(p.createdAt) ORDER BY d")
    List<Object[]> countGroupedByDay(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    // Count projects by status and list of project IDs
    long countByIdInAndStatus(List<Long> projectIds, ProjectStatus status);

}