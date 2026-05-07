package emsi.SmartFlow.controller.facade;

import emsi.SmartFlow.controller.dto.AdminDashboardSummary;
import emsi.SmartFlow.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("admin/dashboard")
public class AdminDashboardController {

    private final DashboardService dashboardService;

    public AdminDashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // Summary for current month
    @GetMapping("/summary")
    public ResponseEntity<AdminDashboardSummary> summary(@AuthenticationPrincipal Object user){
        // Controller assumes security config already restricts this endpoint to ADMIN; if not, also check here
        AdminDashboardSummary s = dashboardService.getAdminSummaryCurrentMonth();
        return ResponseEntity.ok(s);
    }

    // Report for a specific year (full year range)
    @GetMapping("/report")
    public ResponseEntity<AdminDashboardSummary> report(@RequestParam int year){
        AdminDashboardSummary s = dashboardService.getAdminReportForYear(year);
        return ResponseEntity.ok(s);
    }
}
