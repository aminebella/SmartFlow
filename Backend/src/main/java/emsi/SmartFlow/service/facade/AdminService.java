package emsi.SmartFlow.service.facade;
import emsi.SmartFlow.controller.dto.client.ClientResponse;
import java.util.List;


public interface AdminService {
    ClientResponse getClientById(Long id);
    List<ClientResponse> getAllClients();
    void blockClient(Long id);
    void unblockClient(Long id);
}