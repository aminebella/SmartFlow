package emsi.SmartFlow.controller.converter;

import emsi.SmartFlow.controller.dto.client.ClientResponse;
import emsi.SmartFlow.entity.Client;
import emsi.SmartFlow.role.Role;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ClientConverter {

    public ClientResponse toDTO(Client client) {
        return ClientResponse.builder()
                .id(client.getId())
                .fullName(client.getFullName())
                .email(client.getEmail())
                .postTitle(client.getPostTitle())
                .profilePicture(client.getProfilePicture())
                .coverPicture(client.getCoverPicture())
                .location(client.getLocation())
                .accountLocked(client.isAccountLocked())
                .enabled(client.isEnabled())
                .roles(client.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toList()))
                .build();
    }

    public List<ClientResponse> toDTOList(List<Client> clients) {
        return clients.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}