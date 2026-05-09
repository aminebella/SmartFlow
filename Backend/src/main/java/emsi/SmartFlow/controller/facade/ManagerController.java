package emsi.SmartFlow.controller.facade;
import emsi.SmartFlow.controller.dto.teams.MemeberSummaryResponse;
import emsi.SmartFlow.entity.Client;
import emsi.SmartFlow.service.facade.IManagerService;
import emsi.SmartFlow.service.facade.ProjectService;
import emsi.SmartFlow.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final IManagerService managerService;
    private final ProjectService projectService;


    private String getRole(User user) {
        return user.getAuthorities().iterator().next().getAuthority();
    }

    // GET /api/v1/manager/clients/search?name=ali
    // GET /api/v1/manager/projects/{projectId}/clients/search?name=ali
    @GetMapping("/projects/{projectId}/clients/search")
    public ResponseEntity<List<MemeberSummaryResponse>> searchClients(
            @PathVariable Long projectId,
            @RequestParam String email,          // ← name → email
            @AuthenticationPrincipal User currentUser) {

        if (!getRole(currentUser).equals("CLIENT")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Long clientId = ((Client) currentUser).getId();

        // Même logique que updateProject — simple et cohérent
        if (!"MANAGER".equals(projectService.getMyRole(projectId, clientId))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(managerService.searchClientsByEmail(email, clientId));
    }
}