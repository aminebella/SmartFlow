// src/main/java/emsi/SmartFlow/service/impl/ProjectServiceImpl.java
package emsi.SmartFlow.service.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import emsi.SmartFlow.controller.dto.project.ProjectRequest;
import emsi.SmartFlow.controller.dto.project.ProjectResponse;
import emsi.SmartFlow.entity.Client;
import emsi.SmartFlow.entity.Project;
import emsi.SmartFlow.entity.ProjectTeam;
import emsi.SmartFlow.entity.enums.ProjectTeamRole;
import emsi.SmartFlow.entity.keys.ProjectTeamKey;
import emsi.SmartFlow.repo.ClientRepo;
import emsi.SmartFlow.repo.ProjectRepository;
import emsi.SmartFlow.repo.ProjectTeamRepository;
import emsi.SmartFlow.service.facade.ProjectService;
import emsi.SmartFlow.entity.enums.ProjectStatus;


@Service
@RequiredArgsConstructor // injects all final fields via constructor (no @Autowired needed)
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectTeamRepository projectTeamRepository;
    private final ClientRepo clientRepo;

    // ─── ADMIN: All projects ───────────────────────────────────────────────
    @Override
    public List<ProjectResponse> getAllProjects(ProjectStatus status) {
        List<Project> projects = (status != null)
                ? projectRepository.findAllByStatus(status)
                : projectRepository.findAll(); // no filter = all statuses
        return projects.stream()
                .map(p -> toResponse(p, null))
                .collect(Collectors.toList());
    }

    // ─── CLIENT: only my projects ──────────────────────────────────────────
//    @Override
//    public List<ProjectResponse> getMyProjects(Long clientId, ProjectStatus status) {
//        ProjectStatus filter = (status != null) ? status : ProjectStatus.ACTIVE;
//        // default to ACTIVE — client normally sees only active projects
//        return projectRepository.findAllByClientIdAndStatus(clientId, filter)
//                .stream()
//                .map(p -> toResponse(p, clientId))
//                .collect(Collectors.toList());
//    }
    @Override
    public List<ProjectResponse> getMyProjects(Long clientId, ProjectStatus status) {
        List<Project> projects = (status != null)
                ? projectRepository.findAllByClientIdAndStatus(clientId, status)
                : projectRepository.findAllByClientId(clientId); // no filter = all statuses
        return projects.stream()
                .map(p -> toResponse(p, clientId))
                .collect(Collectors.toList());
    }

    // ─── ANYONE: one project by id ─────────────────────────────────────────
    @Override
    public ProjectResponse getProjectById(Long projectId, Long clientId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found: " + projectId));
        return toResponse(project, clientId);
    }

    // ─── CREATE project (client becomes MANAGER automatically) ─────────────
    // createProject — add new fields
    @Override
    public ProjectResponse createProject(ProjectRequest request, Long creatorClientId) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Project name is required");
        }

        // Check name uniqueness per owner
        if (projectRepository.existsByNameAndOwnerId(request.getName(), creatorClientId)) {
            throw new IllegalArgumentException("You already have a project with this name");
        }

        Client creator = clientRepo.findById(creatorClientId)
                .orElseThrow(() -> new EntityNotFoundException("Client not found"));

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(creator)
                .estimatedStartDate(request.getEstimatedStartDate())
                .estimatedEndDate(request.getEstimatedEndDate())
                .estimatedBudget(request.getEstimatedBudget() != null ? request.getEstimatedBudget() : 0)
                .status(ProjectStatus.ACTIVE)
                // realStartDate, realEndDate, realBudget = null at creation
                .build();
        project = projectRepository.save(project);

        // Creator automatically becomes MANAGER
        ProjectTeamKey key = new ProjectTeamKey(project.getId(), creatorClientId);
        ProjectTeam team = ProjectTeam.builder()
                .id(key)
                .project(project)
                .client(creator)
                .projectRole(ProjectTeamRole.MANAGER)
                .build();
        projectTeamRepository.save(team);

        return toResponse(project, creatorClientId);
    }

    // ─── UPDATE project (manager only — controller enforces this) ──────────
    // updateProject (partial — only non-null fields)
    @Override
    public ProjectResponse updateProject(Long projectId, ProjectRequest request, Long clientId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        // Cannot update FINISHED or ARCHIVED project
        if (project.getStatus() == ProjectStatus.FINISHED) {
            throw new IllegalStateException("Cannot update a finished project");
        }
        if (project.getStatus() == ProjectStatus.ARCHIVED) {
            throw new IllegalStateException("Cannot update an archived project. Restore it first");
        }

        // Update only provided fields
        if (request.getName() != null && !request.getName().isBlank()) {
            // Check uniqueness only if name is actually changing
            if (!request.getName().equals(project.getName()) &&
                    projectRepository.existsByNameAndOwnerId(request.getName(), project.getOwner().getId())) {
                throw new IllegalArgumentException("You already have a project named: " + request.getName());
            }
            project.setName(request.getName());
        }
        if (request.getDescription() != null)
            project.setDescription(request.getDescription());
        if (request.getEstimatedStartDate() != null)
            project.setEstimatedStartDate(request.getEstimatedStartDate());
        if (request.getEstimatedEndDate() != null)
            project.setEstimatedEndDate(request.getEstimatedEndDate());
        if (request.getRealStartDate() != null)
            project.setRealStartDate(request.getRealStartDate());
        if (request.getRealEndDate() != null)
            project.setRealEndDate(request.getRealEndDate());
        if (request.getEstimatedBudget() != null)
            project.setEstimatedBudget(request.getEstimatedBudget());
        if (request.getRealBudget() != null)
            project.setRealBudget(request.getRealBudget());

        project = projectRepository.save(project);
        return toResponse(project, clientId);
    }

    // ─── Manager: SOFT DELETE (archive) , reversible────────────────────
    @Override
    public void archiveProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        if (project.getStatus() == ProjectStatus.FINISHED) {
            throw new IllegalStateException("Cannot archive a finished project");
        }
        if (project.getStatus() == ProjectStatus.ARCHIVED) {
            throw new IllegalStateException("Project is already archived");
        }

        project.setStatus(ProjectStatus.ARCHIVED);
        projectRepository.save(project);
    }

    // ─── Manager: RESTORE ARCHIVED  ───────────────────────────────────────────────────────────
    @Override
    public void restoreProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        if (project.getStatus() != ProjectStatus.ARCHIVED) {
            throw new IllegalStateException("Only archived projects can be restored");
        }

        project.setStatus(ProjectStatus.ACTIVE);
        projectRepository.save(project);
    }

    // ───── FINISH — MANAGER only, irreversible by manager ─────────────────────
    // Sets realEndDate automatically
    @Override
    public void finishProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        if (project.getStatus() == ProjectStatus.FINISHED) {
            throw new IllegalStateException("Project is already finished");
        }
        if (project.getStatus() == ProjectStatus.ARCHIVED) {
            throw new IllegalStateException("Cannot finish an archived project. Restore it first");
        }

        project.setStatus(ProjectStatus.FINISHED);
        // Auto-set realEndDate if not already set
        if (project.getRealEndDate() == null) {
            project.setRealEndDate(LocalDateTime.now());
        }
        projectRepository.save(project);
    }

    // RESTORE FINISHED → ACTIVE — ADMIN only
    // ──────────────────────────────────────────────────────────────────────
    @Override
    public void restoreFinishedProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        if (project.getStatus() != ProjectStatus.FINISHED) {
            throw new IllegalStateException("Only finished projects can be restored this way");
        }

        project.setStatus(ProjectStatus.ACTIVE);
        // Clear the auto-set realEndDate since project is reopened
        project.setRealEndDate(null);
        projectRepository.save(project);
    }

    // ─── MANAGER : ADD MEMBER ────────────────────────────────────────────────────────
    @Override
    public void addMember(Long projectId, Long clientIdToAdd, Long requestingClientId) {
        // Cannot add to non-ACTIVE project
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));
        if (project.getStatus() != ProjectStatus.ACTIVE) {
            throw new IllegalStateException("Can only add members to ACTIVE projects");
        }

        // Cannot add someone already in the project
        if (projectTeamRepository.existsByIdProjectIdAndIdClientId(projectId, clientIdToAdd)) {
            throw new IllegalArgumentException("This client is already in the project");
        }

        Client clientToAdd = clientRepo.findById(clientIdToAdd)
                .orElseThrow(() -> new EntityNotFoundException("Client not found: " + clientIdToAdd));

        ProjectTeamKey key = new ProjectTeamKey(projectId, clientIdToAdd);
        ProjectTeam team = ProjectTeam.builder()
                .id(key)
                .project(project)
                .client(clientToAdd)
                .projectRole(ProjectTeamRole.MEMBER)
                .build();
        projectTeamRepository.save(team);
    }

    // ─── REMOVE MEMBER ─────────────────────────────────────────────────────
    @Override
    public void removeMember(Long projectId, Long clientIdToRemove, Long requestingClientId) {
        // Manager cannot remove themselves
        if (clientIdToRemove.equals(requestingClientId)) {
            throw new IllegalArgumentException("Manager cannot remove themselves from the project");
        }

        // Target must exist in project
        ProjectTeamKey key = new ProjectTeamKey(projectId, clientIdToRemove);
        if (!projectTeamRepository.existsById(key)) {
            throw new EntityNotFoundException("This member is not in the project");
        }

        projectTeamRepository.deleteById(key);
    }


    // ─── Manager: GET MY ROLE in a project ──────────────────────────────────────────
    @Override
    public String getMyRole(Long projectId, Long clientId) {
        return projectTeamRepository
                .findByIdProjectIdAndIdClientId(projectId, clientId)
                .map(pt -> pt.getProjectRole().name()) // "MANAGER" or "MEMBER"
                .orElse(null); // not in this project
    }

    // ─── PRIVATE helper: Project entity → ProjectResponse DTO ─────────────
    // toResponse — map all new fields
    private ProjectResponse toResponse(Project project, Long clientId) {
        String myRole = null;
        if (clientId != null) {
            myRole = projectTeamRepository
                    .findByIdProjectIdAndIdClientId(project.getId(), clientId)
                    .map(pt -> pt.getProjectRole().name())
                    .orElse(null);
        }

        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .estimatedStartDate(project.getEstimatedStartDate())
                .estimatedEndDate(project.getEstimatedEndDate())
                .realStartDate(project.getRealStartDate())
                .realEndDate(project.getRealEndDate())
                .estimatedBudget(project.getEstimatedBudget())
                .realBudget(project.getRealBudget())
                .status(project.getStatus())
                .ownerName(project.getOwner().getFirstname()
                        + " " + project.getOwner().getLastname())
                .memberCount(project.getProjectTeams() != null
                        ? project.getProjectTeams().size() : 0)
                .myRole(myRole)
                .build();
    }
}