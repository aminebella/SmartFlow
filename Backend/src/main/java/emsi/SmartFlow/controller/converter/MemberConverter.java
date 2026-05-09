package emsi.SmartFlow.controller.converter;

import emsi.SmartFlow.controller.dto.teams.MemeberSummaryResponse;
import emsi.SmartFlow.entity.Client;
import org.springframework.stereotype.Component;

@Component
public class MemberConverter {
    public MemeberSummaryResponse toMemeberSummaryResponse(Client client) {
        return MemeberSummaryResponse.builder()
                .id(client.getId())
                .email(client.getEmail())
                .fullName(client.getFullName())
                .profilePicture(client.getProfilePicture())
                .build();
    }
}