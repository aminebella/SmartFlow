package emsi.SmartFlow.service.facade;

import emsi.SmartFlow.controller.dto.teams.MemeberSummaryResponse;
import java.util.List;

public interface IManagerService {
    List<MemeberSummaryResponse> searchClientsByEmail(String email, Long managerId);
}
