package emsi.SmartFlow.Utils;
import emsi.SmartFlow.entity.Client;
import emsi.SmartFlow.repo.ClientRepo;
import jakarta.persistence.EntityNotFoundException;

public class ClientUtils {

    public static Client findClientOrThrow(ClientRepo clientRepo, Long id) {
        return clientRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Client not found with id: " + id));
    }
}