package emsi.SmartFlow.controller.dto.teams;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MemeberSummaryResponse {
    private Long id;
    private String email;
    private String fullName;
    private String profilePicture;
}