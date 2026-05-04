package emsi.SmartFlow.controller.facade;

import emsi.SmartFlow.controller.dto.ApiResponse;
import emsi.SmartFlow.controller.dto.sprint.SprintRequest;
import emsi.SmartFlow.controller.dto.sprint.SprintResponse;
import emsi.SmartFlow.service.facade.SprintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class SprintController {

    private final SprintService sprintService;

    // GET /api/v1/projects/{projectId}/sprints
    @GetMapping("projects/{projectId}/sprints")
    public ResponseEntity<ApiResponse<List<SprintResponse>>> listByProject(@PathVariable Long projectId) {
        var data = sprintService.listByProject(projectId);
        return ResponseEntity.ok(ApiResponse.<List<SprintResponse>>builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.OK.value())
                .message("Sprints récupérés")
                .data(data)
                .build());
    }

    // GET /api/v1/sprints/{id}
    @GetMapping("sprints/{id}")
    public ResponseEntity<ApiResponse<SprintResponse>> getById(@PathVariable Long id) {
        var data = sprintService.getById(id);
        return ResponseEntity.ok(ApiResponse.<SprintResponse>builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.OK.value())
                .message("Sprint récupéré")
                .data(data)
                .build());
    }

    // POST /api/v1/projects/{projectId}/sprints
    @PostMapping("projects/{projectId}/sprints")
    public ResponseEntity<ApiResponse<SprintResponse>> create(
            @PathVariable Long projectId,
            @RequestBody @Valid SprintRequest request
    ) {
        var data = sprintService.create(projectId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<SprintResponse>builder()
                        .timestamp(LocalDateTime.now())
                        .status(HttpStatus.CREATED.value())
                        .message("Sprint créé")
                        .data(data)
                        .build());
    }

    // PUT /api/v1/sprints/{id}
    @PutMapping("sprints/{id}")
    public ResponseEntity<ApiResponse<SprintResponse>> update(
            @PathVariable Long id,
            @RequestBody @Valid SprintRequest request
    ) {
        var data = sprintService.update(id, request);
        return ResponseEntity.ok(ApiResponse.<SprintResponse>builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.OK.value())
                .message("Sprint modifié")
                .data(data)
                .build());
    }

    // DELETE /api/v1/sprints/{id}
    @DeleteMapping("sprints/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        sprintService.delete(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.OK.value())
                .message("Sprint supprimé")
                .data(null)
                .build());
    }
}

