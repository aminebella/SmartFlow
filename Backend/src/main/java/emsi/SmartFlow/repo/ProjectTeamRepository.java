package emsi.SmartFlow.repo;

import emsi.SmartFlow.entity.ProjectTeam;
import emsi.SmartFlow.entity.enums.ProjectTeamRole;
import emsi.SmartFlow.entity.keys.ProjectTeamKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectTeamRepository extends JpaRepository<ProjectTeam, ProjectTeamKey> {

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
}