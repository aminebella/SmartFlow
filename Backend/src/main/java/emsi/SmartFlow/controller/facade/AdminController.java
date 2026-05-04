package emsi.SmartFlow.controller.facade;
import emsi.SmartFlow.Utils.SecurityUtils;
import emsi.SmartFlow.controller.dto.client.ClientProfileResponse;
import emsi.SmartFlow.service.facade.AdminService;
import emsi.SmartFlow.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // ─── GET tous les clients ─────────────────────────────
    @GetMapping("/clients")
    public ResponseEntity<List<ClientProfileResponse>> getAllClients(
            @AuthenticationPrincipal User currentUser) {
        SecurityUtils.requireAdmin(currentUser);
        return ResponseEntity.ok(adminService.getAllClients());
    }

    // ─── GET client par ID ────────────────────────────────
    @GetMapping("/clients/{id}")
    public ResponseEntity<ClientProfileResponse> getClientById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        SecurityUtils.requireAdmin(currentUser);
        return ResponseEntity.ok(adminService.getClientById(id));
    }


    // ─── BLOCK client ─────────────────────────────────────
    @PutMapping("/clients/{id}/block")
    public ResponseEntity<Void> blockClient(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        SecurityUtils.requireAdmin(currentUser);
        adminService.blockClient(id);
        return ResponseEntity.ok().build();
    }

    // ─── UNBLOCK client ───────────────────────────────────
    @PutMapping("/clients/{id}/unblock")
    public ResponseEntity<Void> unblockClient(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        SecurityUtils.requireAdmin(currentUser);
        adminService.unblockClient(id);
        return ResponseEntity.ok().build();
    }
}