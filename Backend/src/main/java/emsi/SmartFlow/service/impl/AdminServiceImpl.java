package emsi.SmartFlow.service.impl;
import emsi.SmartFlow.Utils.ClientUtils;
import emsi.SmartFlow.controller.converter.ClientConverter;
import emsi.SmartFlow.controller.dto.client.ClientProfileResponse;
import emsi.SmartFlow.controller.dto.project.ProjectResponse;
import emsi.SmartFlow.entity.Client;
import emsi.SmartFlow.repo.ClientRepo;
import emsi.SmartFlow.service.facade.AdminService;
import emsi.SmartFlow.service.facade.ProjectService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    private final ClientRepo clientRepo;
    private final ClientConverter clientConverter;
    private final ProjectService projectService;


    public AdminServiceImpl(ClientRepo clientRepo, ClientConverter clientConverter,ProjectService projectService) {
        this.clientRepo = clientRepo;
        this.clientConverter = clientConverter;
        this.projectService= projectService;
    }

    @Override
    public ClientProfileResponse getClientById(Long id) {
        Client client = ClientUtils.findClientOrThrow(clientRepo, id);
        List<ProjectResponse> projects = projectService.getMyProjects(id, null);
        return clientConverter.toProfileDTO(client, projects);
    }

    @Override
    public List<ClientProfileResponse> getAllClients() {
        List<Client> clients = clientRepo.findAll();
        return clientConverter.toProfileDTOList(clients, projectService);
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