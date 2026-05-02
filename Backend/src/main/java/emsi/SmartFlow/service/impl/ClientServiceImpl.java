package emsi.SmartFlow.service.impl;

import emsi.SmartFlow.Utils.ClientUtils;
import emsi.SmartFlow.Utils.FileStorageUtils;
import emsi.SmartFlow.controller.converter.ClientConverter;
import emsi.SmartFlow.controller.dto.client.ClientResponse;
import emsi.SmartFlow.controller.dto.client.UpdateProfileRequest;
import emsi.SmartFlow.entity.Client;
import emsi.SmartFlow.repo.ClientRepo;
import emsi.SmartFlow.service.facade.ClientService;
import org.springframework.stereotype.Service;
import java.io.IOException;


@Service
public class ClientServiceImpl implements ClientService {

    private final ClientRepo clientRepo;
    private final ClientConverter clientConverter;

    public ClientServiceImpl(ClientRepo clientRepo, ClientConverter clientConverter) {
        this.clientRepo = clientRepo;
        this.clientConverter = clientConverter;
    }

    @Override
    public ClientResponse getClientById(Long id) {
        return clientConverter.toDTO(ClientUtils.findClientOrThrow(clientRepo, id));
    }

    @Override
    public ClientResponse updateProfile(Long id, UpdateProfileRequest request) throws IOException {
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

        return clientConverter.toDTO(clientRepo.save(client));
    }
}