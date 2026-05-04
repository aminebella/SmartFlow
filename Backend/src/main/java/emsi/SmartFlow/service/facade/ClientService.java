package emsi.SmartFlow.service.facade;
import emsi.SmartFlow.controller.dto.client.ClientProfileResponse;
import emsi.SmartFlow.controller.dto.client.UpdateProfileRequest;

import java.io.IOException;

public interface ClientService {
    ClientProfileResponse getClientById(Long id);
    ClientProfileResponse updateProfile(Long id, UpdateProfileRequest request) throws IOException;
}