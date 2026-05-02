package emsi.SmartFlow.controller.dto.client;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    private String firstname;
    private String lastname;
    private String PostTitle;
    private String location;
    private MultipartFile profilePicture;
    private MultipartFile coverPicture;

}
