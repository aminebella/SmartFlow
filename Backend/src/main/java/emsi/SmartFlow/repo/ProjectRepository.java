// src/main/java/emsi/SmartFlow/repo/ProjectRepository.java

package emsi.SmartFlow.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

import emsi.SmartFlow.entity.Project;
import emsi.SmartFlow.entity.enums.ProjectStatus;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    // Client sees only their projects — filter by status too
    @Query("SELECT p FROM Project p JOIN p.projectTeams pt WHERE pt.client.id = :clientId AND p.status = :status")
    List<Project> findAllByClientIdAndStatus(@Param("clientId") Long clientId, @Param("status") ProjectStatus status);

    // All projects of a client regardless of status
    @Query("SELECT p FROM Project p JOIN p.projectTeams pt WHERE pt.client.id = :clientId")
    List<Project> findAllByClientId(@Param("clientId") Long clientId);

    // For admin: all projects regardless of status
    // JpaRepository.findAll() already handles this

    // Admin sees all projects filter by status
    List<Project> findAllByStatus(ProjectStatus status);

    // Check name uniqueness per owner before creating
    boolean existsByNameAndOwnerId(String name, Long ownerId);
}