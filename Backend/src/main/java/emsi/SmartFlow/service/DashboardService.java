package emsi.SmartFlow.service;

import emsi.SmartFlow.controller.dto.AdminDashboardSummary;
import java.time.Year;

public interface DashboardService {
    AdminDashboardSummary getAdminSummaryCurrentMonth();
    AdminDashboardSummary getAdminReportForYear(int year);
}
