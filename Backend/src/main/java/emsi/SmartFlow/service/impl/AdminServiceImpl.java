package emsi.SmartFlow.service.impl;
import emsi.SmartFlow.Utils.ClientUtils;
import emsi.SmartFlow.controller.converter.ClientConverter;
import emsi.SmartFlow.controller.dto.client.ClientResponse;
import emsi.SmartFlow.entity.Client;
import emsi.SmartFlow.repo.ClientRepo;
import emsi.SmartFlow.service.facade.AdminService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    private final ClientRepo clientRepo;
    private final ClientConverter clientConverter;

    public AdminServiceImpl(ClientRepo clientRepo, ClientConverter clientConverter) {
        this.clientRepo = clientRepo;
        this.clientConverter = clientConverter;
    }

    @Override
    public ClientResponse getClientById(Long id) {
        return clientConverter.toDTO(ClientUtils.findClientOrThrow(clientRepo, id));
    }

    @Override
    public List<ClientResponse> getAllClients() {
        return clientConverter.toDTOList(clientRepo.findAll());
    }

    @Override
    public void blockClient(Long id) {
        Client client = ClientUtils.findClientOrThrow(clientRepo, id);
        client.setAccountLocked(true);
        clientRepo.save(client);
    }

    @Override
    public void unblockClient(Long id) {
        Client client = ClientUtils.findClientOrThrow(clientRepo, id);
        client.setAccountLocked(false);
        clientRepo.save(client);
    }
}