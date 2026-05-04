package emsi.SmartFlow.service.facade;
import emsi.SmartFlow.controller.dto.client.ClientProfileResponse;
import java.util.List;


public interface AdminService {
    ClientProfileResponse getClientById(Long id);
    List<ClientProfileResponse> getAllClients();
    void blockClient(Long id);
    void unblockClient(Long id);
}