package emsi.SmartFlow.controller.dto.ProjectMember;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProjectMemberResponse {
    private Long id;
    private String fullName;
    private String role; // MANAGER or MEMBER
    private LocalDateTime joinedAt;
}
