// src/main/java/emsi/SmartFlow/repo/ProjectTeamRepository.java

package emsi.SmartFlow.repo;

import emsi.SmartFlow.entity.ProjectTeam;
import emsi.SmartFlow.entity.enums.ProjectTeamRole;
import emsi.SmartFlow.entity.keys.ProjectTeamKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectTeamRepository extends JpaRepository<ProjectTeam, ProjectTeamKey> {

    // Find the specific row for (projectId, clientId)
    // Used to check: is this client in this project? what is their role?
    Optional<ProjectTeam> findByIdProjectIdAndIdClientId(Long projectId, Long clientId);

    // Check if client is already in project (avoid duplicates)
    boolean existsByIdProjectIdAndIdClientId(Long projectId, Long clientId);

    @Query("SELECT pt.projectRole FROM ProjectTeam pt " +
            "WHERE pt.project.id = :projectId AND pt.client.id = :userId")
    Optional<ProjectTeamRole> findRoleByProjectIdAndUserId(
            @Param("projectId") Long projectId,
            @Param("userId") Long userId
    );

    @Query("SELECT COUNT(pt) > 0 FROM ProjectTeam pt " +
            "WHERE pt.project.id = :projectId AND pt.client.id = :userId")
    boolean existsByProjectIdAndUserId(
            @Param("projectId") Long projectId,
            @Param("userId") Long userId
    );

    // Get List of all members in a project (for getProjectMembers)
    @Query("SELECT pt FROM ProjectTeam pt JOIN FETCH pt.client WHERE pt.project.id = :projectId")
    List<ProjectTeam> findByProjectIdWithClient(Long projectId);
}