package emsi.SmartFlow.controller.facade;

import emsi.SmartFlow.controller.dto.ProjectMember.ProjectMemberResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import emsi.SmartFlow.controller.dto.project.ProjectRequest;
import emsi.SmartFlow.controller.dto.project.ProjectResponse;
import emsi.SmartFlow.entity.Client;
import emsi.SmartFlow.entity.enums.ProjectStatus;
import emsi.SmartFlow.service.facade.ProjectService;
import emsi.SmartFlow.user.User;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    // ─── helper: extract global role from JWT ─────────────────────────────
    private String getRole(User user) {
        return user.getAuthorities().iterator().next().getAuthority();
    }

    // ─── ADMIN: all projects, optional ?status= filter ────────────────────
    // GET /api/v1/projects
    // GET /api/v1/projects?status=ACTIVE
    // GET /api/v1/projects?status=ARCHIVED
    // GET /api/v1/projects?status=FINISHED
    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects(
            @RequestParam(required = false) ProjectStatus status,
            @AuthenticationPrincipal User currentUser) {

        if (!getRole(currentUser).equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(projectService.getAllProjects(status));
    }

    // ─── CLIENT: my projects, optional ?status= filter ────────────────────
    // GET /api/v1/projects/my
    // GET /api/v1/projects/my?status=ARCHIVED
    @GetMapping("/my")
    public ResponseEntity<List<ProjectResponse>> getMyProjects(
            @RequestParam(required = false) ProjectStatus status,
            @AuthenticationPrincipal User currentUser) {

        if (!getRole(currentUser).equals("CLIENT")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Long clientId = ((Client) currentUser).getId();
        System.out.println("DEBUG clientId from token: " + clientId); // check this in console
        return ResponseEntity.ok(projectService.getMyProjects(clientId, status));
    }

    // ─── ADMIN or project member/manager: get one project ─────────────────
    // GET /api/v1/projects/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        String role = getRole(currentUser);

        // ADMIN → always allowed, no project role
        if (role.equals("ADMIN")) {
            return ResponseEntity.ok(projectService.getProjectById(id, null));
        }

        // CLIENT → must be MEMBER or MANAGER of this project
        if (role.equals("CLIENT")) {
            Long clientId = ((Client) currentUser).getId();
            String myRole = projectService.getMyRole(id, clientId);
            if (myRole != null) {
                return ResponseEntity.ok(projectService.getProjectById(id, clientId));
            }
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    // ─── CLIENT only: create project → becomes MANAGER ────────────────────
    // POST /api/v1/projects
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody ProjectRequest request,
            @AuthenticationPrincipal User currentUser) {

        if (!getRole(currentUser).equals("CLIENT")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Long clientId = ((Client) currentUser).getId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.createProject(request, clientId));
    }

    // ─── MANAGER only: update project (partial update) ────────────────────
    // PUT /api/v1/projects/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long id,
            @RequestBody ProjectRequest request,       // no @Valid — partial update allowed
            @AuthenticationPrincipal User currentUser) {

        if (!getRole(currentUser).equals("CLIENT")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Long clientId = ((Client) currentUser).getId();
        if (!"MANAGER".equals(projectService.getMyRole(id, clientId))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(projectService.updateProject(id, request, clientId));
    }

    // ─── MANAGER only: archive project (soft delete, reversible) ──────────
    // PATCH /api/v1/projects/{id}/archive
    @PatchMapping("/{id}/archive")
    public ResponseEntity<Void> archiveProject(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        String role = getRole(currentUser);
        // ADMIN can archive directly
        if (role.equals("ADMIN")) {
            projectService.archiveProject(id);
            return ResponseEntity.noContent().build();
        }
        // CLIENT must be MANAGER of the project
        if (role.equals("CLIENT")) {
            Long clientId = ((Client) currentUser).getId();

            if ("MANAGER".equals(projectService.getMyRole(id, clientId))) {
                projectService.archiveProject(id);
                return ResponseEntity.noContent().build();
            }
        }
        // everyone else forbidden
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    // ─── MANAGER or ADMIN: restore ARCHIVED → ACTIVE ──────────────────────
    // PATCH /api/v1/projects/{id}/restore
    @PatchMapping("/{id}/restore")
    public ResponseEntity<Void> restoreProject(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        String role = getRole(currentUser);

        if (role.equals("ADMIN")) {
            projectService.restoreProject(id);
            return ResponseEntity.noContent().build();
        }

        if (role.equals("CLIENT")) {
            Long clientId = ((Client) currentUser).getId();
            if ("MANAGER".equals(projectService.getMyRole(id, clientId))) {
                projectService.restoreProject(id);
                return ResponseEntity.noContent().build();
            }
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    // ─── MANAGER only: finish project (sets realEndDate, irreversible by manager)
    // PATCH /api/v1/projects/{id}/finish
    @PatchMapping("/{id}/finish")
    public ResponseEntity<Void> finishProject(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        if (!getRole(currentUser).equals("CLIENT")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Long clientId = ((Client) currentUser).getId();
        if (!"MANAGER".equals(projectService.getMyRole(id, clientId))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        projectService.finishProject(id);
        return ResponseEntity.noContent().build();
    }

    // ─── ADMIN or MANAGER: restore FINISHED → ACTIVE ──────────────────────
    // PATCH /api/v1/projects/{id}/restore-finished
    @PatchMapping("/{id}/restore-finished")
    public ResponseEntity<Void> restoreFinishedProject(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        String role = getRole(currentUser);

        if (role.equals("ADMIN")) {
            projectService.restoreFinishedProject(id);
            return ResponseEntity.noContent().build();
        }

        if (role.equals("CLIENT")) {
            Long clientId = ((Client) currentUser).getId();
            if ("MANAGER".equals(projectService.getMyRole(id, clientId))) {
                projectService.restoreFinishedProject(id);
                return ResponseEntity.noContent().build();
            }
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }


    // ─── ADMIN / MEMBER / MANAGER: get project members ─────────────────────
    // GET /api/v1/projects/{id}/members
    @GetMapping("/{id}/members")
    public ResponseEntity<List<ProjectMemberResponse>> getProjectMembers(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        String role = getRole(currentUser);

        // ADMIN → always allowed
        if (role.equals("ADMIN")) {
            return ResponseEntity.ok(projectService.getProjectMembers(id));
        }

        // CLIENT → must be MEMBER or MANAGER
        if (role.equals("CLIENT")) {
            Long clientId = ((Client) currentUser).getId();

            String myRole = projectService.getMyRole(id, clientId);

            if (myRole != null) { // MEMBER or MANAGER
                return ResponseEntity.ok(projectService.getProjectMembers(id));
            }
        }

        // Others → forbidden
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    // ─── MANAGER only: add member to project ──────────────────────────────
    // POST /api/v1/projects/{id}/members/{clientId}
    @PostMapping("/{id}/members/{clientId}")
    public ResponseEntity<Void> addMember(
            @PathVariable Long id,
            @PathVariable Long clientId,
            @AuthenticationPrincipal User currentUser) {

        // 1. Must be CLIENT globally
        if (!getRole(currentUser).equals("CLIENT")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // 2. Must be MANAGER of this specific project
        Long requestingClientId = ((Client) currentUser).getId();
        if (!"MANAGER".equals(projectService.getMyRole(id, requestingClientId))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        projectService.addMember(id, clientId, requestingClientId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // ─── MANAGER only: remove member from project ──────────────────────────
    // DELETE /api/v1/projects/{id}/members/{clientId}
    @DeleteMapping("/{id}/members/{clientId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable Long id,
            @PathVariable Long clientId,
            @AuthenticationPrincipal User currentUser) {

        // 1. Must be CLIENT globally
        if (!getRole(currentUser).equals("CLIENT")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // 2. Must be MANAGER of this specific project
        Long requestingClientId = ((Client) currentUser).getId();
        if (!"MANAGER".equals(projectService.getMyRole(id, requestingClientId))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        projectService.removeMember(id, clientId, requestingClientId);
        return ResponseEntity.noContent().build();
    }

    // ─── CLIENT or ADMIN: get role in a project ────────────────────────────
    // GET /api/v1/projects/{id}/my-role
    // CLIENT → returns "MANAGER" or "MEMBER"
    // ADMIN  → returns "ADMIN" (always has access, no project role)
    @GetMapping("/{id}/my-role")
    public ResponseEntity<Map<String, String>> getMyRole(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        String role = getRole(currentUser);

        // ADMIN always gets "ADMIN" back — frontend uses this to show/hide UI
        if (role.equals("ADMIN")) {
            return ResponseEntity.ok(Map.of("role", "ADMIN"));
        }

        // CLIENT → look up their actual project role
        if (role.equals("CLIENT")) {
            Long clientId = ((Client) currentUser).getId();
            String myRole = projectService.getMyRole(id, clientId);
            if (myRole == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            return ResponseEntity.ok(Map.of("role", myRole));
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
}