package emsi.SmartFlow.service.facade;

import emsi.SmartFlow.controller.dto.SprintRequest;
import emsi.SmartFlow.controller.dto.SprintResponse;

import java.util.List;

public interface SprintService {
    List<SprintResponse> listByProject(Long projectId);
    SprintResponse getById(Long sprintId);
    SprintResponse create(Long projectId, SprintRequest request);
    SprintResponse update(Long sprintId, SprintRequest request);
    void delete(Long sprintId);
}

