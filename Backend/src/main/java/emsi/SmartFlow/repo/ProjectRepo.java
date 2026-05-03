package emsi.SmartFlow.repo;

import emsi.SmartFlow.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepo extends JpaRepository<Project, Long> {
}

