package emsi.SmartFlow.repo;

import emsi.SmartFlow.entity.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SprintRepo extends JpaRepository<Sprint, Long> {
    List<Sprint> findByProjectIdOrderByStartDateAscIdAsc(Long projectId);
}

