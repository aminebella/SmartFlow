package emsi.SmartFlow.repo;

import emsi.SmartFlow.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author HP
 **/
public interface ClientRepo extends JpaRepository<Client,Long> {
}
