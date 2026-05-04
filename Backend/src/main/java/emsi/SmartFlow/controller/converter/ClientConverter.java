package emsi.SmartFlow.controller.converter;

import emsi.SmartFlow.controller.dto.client.ClientProfileResponse;
import emsi.SmartFlow.controller.dto.project.ProjectResponse;
import emsi.SmartFlow.entity.Client;
import emsi.SmartFlow.role.Role;
import emsi.SmartFlow.service.facade.ProjectService;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ClientConverter {

    public ClientProfileResponse toDTO(Client client) {
        return ClientProfileResponse.builder()
                .id(client.getId())
                .fullName(client.getFullName())
                .email(client.getEmail())
                .postTitle(client.getPostTitle())
                .profilePicture(client.getProfilePicture())
                .coverPicture(client.getCoverPicture())
                .location(client.getLocation())
                .accountLocked(client.isAccountLocked())
                .enabled(client.isEnabled())
                .createdAt(client.getCreatedAt())
                .roles(client.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toList()))
                .build();
    }

    public List<ClientProfileResponse> toDTOList(List<Client> clients) {
        return clients.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    // ajouter cette méthode (garde toDTO() existant intact)
    public ClientProfileResponse toProfileDTO(Client client, List<ProjectResponse> projects) {
        return ClientProfileResponse.builder()
                .id(client.getId())
                .fullName(client.getFullName())
                .email(client.getEmail())
                .postTitle(client.getPostTitle())
                .profilePicture(client.getProfilePicture())
                .coverPicture(client.getCoverPicture())
                .location(client.getLocation())
                .accountLocked(client.isAccountLocked())
                .enabled(client.isEnabled())
                .createdAt(client.getCreatedAt())
                .roles(client.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toList()))
                .projects(projects)
                .build();
    }

    public List<ClientProfileResponse> toProfileDTOList(List<Client> clients, ProjectService projectService) {
        return clients.stream()
                .map(c -> toProfileDTO(c, projectService.getMyProjects(c.getId(), null)))
                .collect(Collectors.toList());
    }
}