package emsi.SmartFlow.auth;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserResponse {
    private String email;
    private String fullName;
    private List<String> roles;
    private String profilePicture;     // img de profil
}