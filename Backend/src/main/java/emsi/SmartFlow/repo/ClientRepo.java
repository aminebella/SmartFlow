package emsi.SmartFlow.repo;

import emsi.SmartFlow.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * @author HP
 **/
public interface ClientRepo extends JpaRepository<Client,Long> {
    // Méthodes JPA automatiques :
    // findAll()          → getAllClients
    // findById(id)       → getClientById
    // save(client)       → updateProfile / blockClient
    // deleteAll()        → deleteAllClients
    // deleteById(id)     → deleteClientById
    // existsById(id)     → vérifier si client existe
    // Trouver par email (utile pour modifier profil)

    Optional<Client> findByEmail(String email);

    // Trouver tous les clients bloqués
    List<Client> findByAccountLocked(boolean accountLocked);

    // Trouver par location
    List<Client> findByLocation(String location);

}