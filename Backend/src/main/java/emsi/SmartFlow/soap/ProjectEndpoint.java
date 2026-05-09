package emsi.SmartFlow.soap;

import emsi.SmartFlow.controller.dto.project.ProjectResponse;
import emsi.SmartFlow.service.facade.ProjectService;
import emsi.SmartFlow.soap.generated.GetAllProjectsRequest;
import emsi.SmartFlow.soap.generated.GetAllProjectsResponse;
import emsi.SmartFlow.soap.generated.GetProjectByIdRequest;
import emsi.SmartFlow.soap.generated.GetProjectByIdResponse;
import emsi.SmartFlow.soap.generated.ProjectDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;
import org.springframework.data.domain.PageRequest;

import java.util.List;

@Slf4j
@Endpoint
@RequiredArgsConstructor
public class ProjectEndpoint {

    private static final String NAMESPACE = "http://smartflow.emsi/projects";
    private final ProjectService projectService;

    // ── GET ALL PROJECTS ──────────────────────────────────────────────

    @Transactional
    @PayloadRoot(namespace = NAMESPACE, localPart = "getAllProjectsRequest")
    @ResponsePayload
    public GetAllProjectsResponse getAllProjects(
            @RequestPayload GetAllProjectsRequest request) {

        log.info("[SOAP] getAllProjects appelé");

        List<ProjectResponse> projects =
                projectService.getAllProjects(null, PageRequest.of(0, 10))
                        .getContent();

        GetAllProjectsResponse response = new GetAllProjectsResponse();
        projects.forEach(p -> response.getProjects().add(toDto(p)));
        return response;
    }

    // ── GET PROJECT BY ID ─────────────────────────────────────────────

    @Transactional
    @PayloadRoot(namespace = NAMESPACE, localPart = "getProjectByIdRequest")
    @ResponsePayload
    public GetProjectByIdResponse getProjectById(
            @RequestPayload GetProjectByIdRequest request) {

        log.info("[SOAP] getProjectById id={}", request.getId());

        ProjectResponse project = projectService.getProjectById(request.getId(), null);

        GetProjectByIdResponse response = new GetProjectByIdResponse();
        response.setProject(toDto(project));
        return response;
    }

    // ── MAPPER ────────────────────────────────────────────────────────

    private ProjectDto toDto(ProjectResponse p) {
        ProjectDto dto = new ProjectDto();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setDescription(p.getDescription());
        dto.setStatus(p.getStatus() != null ? p.getStatus().name() : "");
        dto.setOwnerName(p.getOwnerName());
        dto.setMemberCount(p.getMemberCount());
        return dto;
    }
}