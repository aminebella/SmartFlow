// src/main/java/emsi/SmartFlow/repo/ProjectTeamRepository.java

package emsi.SmartFlow.repo;

import emsi.SmartFlow.entity.ProjectTeam;
import emsi.SmartFlow.entity.enums.ProjectTeamRole;
import emsi.SmartFlow.entity.keys.ProjectTeamKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectTeamRepository extends JpaRepository<ProjectTeam, ProjectTeamKey> {

    // Find the specific row for (projectId, clientId)
    // Used to check: is this client in this project? what is their role?
    Optional<ProjectTeam> findByIdProjectIdAndIdClientId(Long projectId, Long clientId);

    // Check if client is already in project (avoid duplicates)
    boolean existsByIdProjectIdAndIdClientId(Long projectId, Long clientId);
}