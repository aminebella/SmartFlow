package emsi.SmartFlow.controller.dto.client;

import emsi.SmartFlow.controller.dto.project.ProjectResponse;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ClientProfileResponse {
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
    private LocalDateTime createdAt;
    private List<ProjectResponse> projects;
}