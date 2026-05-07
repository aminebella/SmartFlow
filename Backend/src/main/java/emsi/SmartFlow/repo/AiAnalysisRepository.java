package emsi.SmartFlow.repo;

import emsi.SmartFlow.entity.AiAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AiAnalysisRepository extends JpaRepository<AiAnalysis, Long> {
    Optional<AiAnalysis> findByProjectId(Long projectId);
    boolean existsByProjectId(Long projectId);
}