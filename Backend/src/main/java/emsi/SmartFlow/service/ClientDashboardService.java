package emsi.SmartFlow.service;

import emsi.SmartFlow.controller.dto.ClientDashboardSummary;
import emsi.SmartFlow.user.User;

public interface ClientDashboardService {
    ClientDashboardSummary getClientSummary(User currentUser);
}
