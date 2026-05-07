package emsi.SmartFlow.controller.facade;

import emsi.SmartFlow.controller.dto.ClientDashboardSummary;
import emsi.SmartFlow.service.ClientDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import emsi.SmartFlow.user.User;

@RestController
@RequestMapping("client/dashboard")
public class ClientDashboardController {

    private final ClientDashboardService clientDashboardService;

    public ClientDashboardController(ClientDashboardService clientDashboardService) {
        this.clientDashboardService = clientDashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<ClientDashboardSummary> summary(@AuthenticationPrincipal User currentUser) {
        ClientDashboardSummary summary = clientDashboardService.getClientSummary(currentUser);
        return ResponseEntity.ok(summary);
    }
}
