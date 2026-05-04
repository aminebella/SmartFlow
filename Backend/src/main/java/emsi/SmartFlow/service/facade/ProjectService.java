// src/main/java/emsi/SmartFlow/service/facade/ProjectService.java
package emsi.SmartFlow.service.facade;

import java.util.List;

import emsi.SmartFlow.controller.dto.project.ProjectRequest;
import emsi.SmartFlow.controller.dto.project.ProjectResponse;
import emsi.SmartFlow.controller.dto.ProjectMember.ProjectMemberResponse;
import emsi.SmartFlow.entity.enums.ProjectStatus;


public interface ProjectService {

    // Admin: get all projects in the platform, optionally filtered by status
    List<ProjectResponse> getAllProjects(ProjectStatus status);

    // Client: get only projects where this client is a member: my projects, only ACTIVE by default
    List<ProjectResponse> getMyProjects(Long clientId, ProjectStatus status);

    // Anyone with access(member/manager in that project or Admin): get one project by id
    // clientId = null if caller is admin
    ProjectResponse getProjectById(Long projectId, Long clientId);

    // Manager: create a new project
    // creatorClientId = the client who creates it (becomes MANAGER automatically)
    ProjectResponse createProject(ProjectRequest request, Long creatorClientId);

    // Manager only: update project info (partial — only non-null fields updated)
    ProjectResponse updateProject(Long projectId, ProjectRequest request, Long clientId);

    // Manager only: Soft delete — set status to ARCHIVED
    void archiveProject(Long projectId);

    // Manager only: Restore archived project → ACTIVE
    void restoreProject(Long projectId);

    // MANAGER: mark project as FINISHED (irreversible by manager)
    void finishProject(Long projectId);

    // ADMIN only: reverse FINISHED → ACTIVE
    void restoreFinishedProject(Long projectId);

    // Client (Manager / Member / Admin): Get all members of a project with their roles
    List<ProjectMemberResponse> getProjectMembers(Long projectId);

    // Manager: add a member to project
    void addMember(Long projectId, Long clientIdToAdd, Long requestingClientId);

    // Manager: remove a member
    void removeMember(Long projectId, Long clientIdToRemove, Long requestingClientId);

    // Manager: get role of current client in a project
    // Returns "MANAGER", "MEMBER", or null
    String getMyRole(Long projectId, Long clientId);

//    // Client: get all projects where this client is a member, with pagination and optional status filter
//    List<ProjectResponse> getMyProjectsPaginated(Long clientId, ProjectStatus status, int page, int size);

//    // Member: leave a project
//    void leaveProject(Long projectId, Long clientId);
}