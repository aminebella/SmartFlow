package emsi.SmartFlow.controller.facade;

import emsi.SmartFlow.Utils.SecurityUtils;
import emsi.SmartFlow.controller.dto.client.ClientResponse;
import emsi.SmartFlow.controller.dto.client.UpdateProfileRequest;
import emsi.SmartFlow.entity.Client;
import emsi.SmartFlow.service.facade.ClientService;
import emsi.SmartFlow.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/client")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @GetMapping("/{id}")
    public ResponseEntity<ClientResponse> getClientById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        SecurityUtils.requireClient(currentUser);
        SecurityUtils.requireSameUser(currentUser, id);
        return ResponseEntity.ok(clientService.getClientById(id));
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<ClientResponse> updateProfile(
            @PathVariable Long id,
            @ModelAttribute UpdateProfileRequest request,  // ← ModelAttribute pas RequestBody
            @AuthenticationPrincipal User currentUser) throws IOException {
        SecurityUtils.requireClient(currentUser);
        SecurityUtils.requireSameUser(currentUser, id);
        return ResponseEntity.ok(clientService.updateProfile(id, request));
    }
}