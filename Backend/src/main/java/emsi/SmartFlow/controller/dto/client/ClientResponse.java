package emsi.SmartFlow.controller.dto.client;

import lombok.Builder;
import lombok.Data;

import java.util.List;
@Data
@Builder
public class ClientResponse {
        private Long id;
        private String fullName;
        private String email;
        private String postTitle;
        private String profilePicture;
        private String coverPicture;
        private String location;
        private boolean accountLocked;
        private boolean enabled;
        private List<String> roles;
}