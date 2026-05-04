package emsi.SmartFlow.service.impl;

import emsi.SmartFlow.Utils.ClientUtils;
import emsi.SmartFlow.Utils.FileStorageUtils;
import emsi.SmartFlow.controller.converter.ClientConverter;
import emsi.SmartFlow.controller.dto.client.ClientProfileResponse;
import emsi.SmartFlow.controller.dto.client.UpdateProfileRequest;
import emsi.SmartFlow.controller.dto.project.ProjectResponse;
import emsi.SmartFlow.entity.Client;
import emsi.SmartFlow.repo.ClientRepo;
import emsi.SmartFlow.service.facade.ClientService;
import emsi.SmartFlow.service.facade.ProjectService;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.List;


@Service
public class ClientServiceImpl implements ClientService {

    private final ClientRepo clientRepo;
    private final ClientConverter clientConverter;
    private final ProjectService projectService;

    public ClientServiceImpl(ClientRepo clientRepo, ClientConverter clientConverter, ProjectService projectService) {
        this.clientRepo = clientRepo;
        this.clientConverter = clientConverter;
        this.projectService=projectService;
    }

    @Override
    public ClientProfileResponse getClientById(Long id) {
        Client client = ClientUtils.findClientOrThrow(clientRepo, id);
        List<ProjectResponse> projects = projectService.getMyProjects(id, null); // ← ajouter
        return clientConverter.toProfileDTO(client, projects); // ← toDTO() → toProfileDTO()
    }

    @Override
    public ClientProfileResponse updateProfile(Long id, UpdateProfileRequest request) throws IOException {
        Client client = ClientUtils.findClientOrThrow(clientRepo, id);

        if (request.getFirstname() != null)    client.setFirstname(request.getFirstname());
        if (request.getLastname() != null)     client.setLastname(request.getLastname());
        if (request.getPostTitle() != null)    client.setPostTitle(request.getPostTitle());
        if (request.getLocation() != null)     client.setLocation(request.getLocation());

        // ─── profile picture ──────────────────────────────────
        if (request.getProfilePicture() != null && !request.getProfilePicture().isEmpty()) {
            FileStorageUtils.deleteFile(client.getProfilePicture()); // supprimer l'ancienne
            String path = FileStorageUtils.saveFile(request.getProfilePicture(), "profiles");
            client.setProfilePicture(path);
        }

        // ─── cover picture ────────────────────────────────────
        if (request.getCoverPicture() != null && !request.getCoverPicture().isEmpty()) {
            FileStorageUtils.deleteFile(client.getCoverPicture()); // supprimer l'ancienne
            String path = FileStorageUtils.saveFile(request.getCoverPicture(), "covers");
            client.setCoverPicture(path);
        }

        Client saved = clientRepo.save(client);
        List<ProjectResponse> projects = projectService.getMyProjects(saved.getId(), null);
        return clientConverter.toProfileDTO(saved, projects);
    }
}