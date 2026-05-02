package emsi.SmartFlow.service.facade;
import emsi.SmartFlow.controller.dto.client.ClientResponse;
import emsi.SmartFlow.controller.dto.client.UpdateProfileRequest;

import java.io.IOException;

public interface ClientService {
    ClientResponse getClientById(Long id);
    ClientResponse updateProfile(Long id, UpdateProfileRequest request) throws IOException;
}