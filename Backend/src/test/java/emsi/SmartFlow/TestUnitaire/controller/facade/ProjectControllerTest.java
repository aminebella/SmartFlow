package emsi.SmartFlow.TestUnitaire.controller.facade;

import emsi.SmartFlow.controller.dto.ProjectMember.ProjectMemberResponse;
import emsi.SmartFlow.controller.dto.project.ProjectRequest;
import emsi.SmartFlow.controller.dto.project.ProjectResponse;
import emsi.SmartFlow.controller.facade.ProjectController;
import emsi.SmartFlow.entity.Client;
import emsi.SmartFlow.entity.enums.ProjectStatus;
import emsi.SmartFlow.service.facade.ProjectService;
import emsi.SmartFlow.user.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for ProjectController — all endpoints.
 *
 * KEY RULES:
 * - ADMIN → mock(User.class) with "ADMIN" authority
 * - CLIENT → mock(Client.class) with "CLIENT" authority + getId() stubbed
 *   (controller casts: ((Client) currentUser).getId())
 * - FORBIDDEN paths: controller returns ResponseEntity.status(FORBIDDEN) → 403
 *   (NOT a thrown exception — so we assert isForbidden(), not assertThrows)
 * - When checking "null" status filter with matchers: use isNull(), not raw null
 */
@ExtendWith(MockitoExtension.class)
class ProjectControllerTest {

    @Mock
    private ProjectService projectService;

    @InjectMocks
    private ProjectController projectController;

    private ObjectMapper objectMapper;
    private User  adminUser;
    private Client clientManager; // CLIENT role, id=1L

    private ProjectResponse projectResponse;

    // ── helpers ──────────────────────────────────────────────────────────

    private User adminUser() {
        User u = mock(User.class);
        var auth = new org.springframework.security.core.authority.SimpleGrantedAuthority("ADMIN");
        lenient().doReturn(List.of(auth)).when(u).getAuthorities();
        return u;
    }

    private Client clientUser(Long id) {
        Client c = mock(Client.class);
        var auth = new org.springframework.security.core.authority.SimpleGrantedAuthority("CLIENT");
        lenient().doReturn(List.of(auth)).when(c).getAuthorities();
        lenient().when(c.getId()).thenReturn(id);
        return c;
    }

    private MockMvc buildMockMvc(User user) {
        return MockMvcBuilders
                .standaloneSetup(projectController)
                .setCustomArgumentResolvers(
                        new PageableHandlerMethodArgumentResolver(),
                        new HandlerMethodArgumentResolver() {
                            @Override
                            public boolean supportsParameter(MethodParameter p) {
                                return User.class.isAssignableFrom(p.getParameterType());
                            }
                            @Override
                            public Object resolveArgument(MethodParameter p, ModelAndViewContainer m,
                                                          NativeWebRequest r, WebDataBinderFactory b) {
                                return user;
                            }
                        }
                )
                .build();
    }

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        adminUser     = adminUser();
        clientManager = clientUser(1L);

        projectResponse = ProjectResponse.builder()
                .id(10L).name("SmartFlow").status(ProjectStatus.ACTIVE)
                .memberCount(3).progress(50).build();
    }

    // ════════════════════════════════════════════════════════════════════
    //  GET /projects  (ADMIN only)
    // ════════════════════════════════════════════════════════════════════

    @Test
    void getAllProjects_asAdmin_returnsPagedResults() throws Exception {
        Page<ProjectResponse> page =
                new PageImpl<>(List.of(projectResponse), PageRequest.of(0, 10), 1);
        // FIX: use isNull() instead of raw null — both args must use matchers
        when(projectService.getAllProjects(isNull(), any())).thenReturn(page);

        buildMockMvc(adminUser).perform(get("/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("SmartFlow"));
    }

    @Test
    void getAllProjects_withStatusFilter_passesStatusToService() throws Exception {
        Page<ProjectResponse> page =
                new PageImpl<>(List.of(projectResponse), PageRequest.of(0, 10), 1);
        when(projectService.getAllProjects(eq(ProjectStatus.ACTIVE), any())).thenReturn(page);

        buildMockMvc(adminUser).perform(get("/projects").param("status", "ACTIVE"))
                .andExpect(status().isOk());

        verify(projectService).getAllProjects(eq(ProjectStatus.ACTIVE), any());
    }

    @Test
    void getAllProjects_asClient_returnsForbidden() throws Exception {
        // Controller checks role == "ADMIN", CLIENT → returns 403 directly
        buildMockMvc(clientManager).perform(get("/projects"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(projectService);
    }

    // ════════════════════════════════════════════════════════════════════
    //  GET /projects/my  (CLIENT only)
    // ════════════════════════════════════════════════════════════════════

    @Test
    void getMyProjects_asClient_returnsProjects() throws Exception {
        when(projectService.getMyProjects(eq(1L), isNull()))
                .thenReturn(List.of(projectResponse));

        buildMockMvc(clientManager).perform(get("/projects/my"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("SmartFlow"));
    }

    @Test
    void getMyProjects_withStatusFilter_passesStatus() throws Exception {
        when(projectService.getMyProjects(eq(1L), eq(ProjectStatus.ACTIVE)))
                .thenReturn(List.of(projectResponse));

        buildMockMvc(clientManager).perform(get("/projects/my").param("status", "ACTIVE"))
                .andExpect(status().isOk());

        verify(projectService).getMyProjects(eq(1L), eq(ProjectStatus.ACTIVE));
    }

    @Test
    void getMyProjects_asAdmin_returnsForbidden() throws Exception {
        buildMockMvc(adminUser).perform(get("/projects/my"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(projectService);
    }

    @Test
    void getMyProjects_emptyList_returnsOk() throws Exception {
        when(projectService.getMyProjects(eq(1L), isNull()))
                .thenReturn(Collections.emptyList());

        buildMockMvc(clientManager).perform(get("/projects/my"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    // ════════════════════════════════════════════════════════════════════
    //  GET /projects/{id}
    // ════════════════════════════════════════════════════════════════════

    @Test
    void getProjectById_asAdmin_returnsProject() throws Exception {
        when(projectService.getProjectById(10L, null)).thenReturn(projectResponse);

        buildMockMvc(adminUser).perform(get("/projects/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10));
    }

    @Test
    void getProjectById_asClientMember_returnsProject() throws Exception {
        when(projectService.getMyRole(10L, 1L)).thenReturn("MEMBER");
        when(projectService.getProjectById(10L, 1L)).thenReturn(projectResponse);

        buildMockMvc(clientManager).perform(get("/projects/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("SmartFlow"));
    }

    @Test
    void getProjectById_asClientManager_returnsProject() throws Exception {
        when(projectService.getMyRole(10L, 1L)).thenReturn("MANAGER");
        when(projectService.getProjectById(10L, 1L)).thenReturn(projectResponse);

        buildMockMvc(clientManager).perform(get("/projects/10"))
                .andExpect(status().isOk());
    }

    @Test
    void getProjectById_asClientNotMember_returnsForbidden() throws Exception {
        when(projectService.getMyRole(10L, 1L)).thenReturn(null);

        buildMockMvc(clientManager).perform(get("/projects/10"))
                .andExpect(status().isForbidden());
    }

    // ════════════════════════════════════════════════════════════════════
    //  POST /projects  (CLIENT only)
    // ════════════════════════════════════════════════════════════════════

    @Test
    void createProject_asClient_returnsCreated() throws Exception {
        ProjectRequest req = new ProjectRequest();
        req.setName("New Project");
        req.setType("AGILE");

        when(projectService.createProject(any(ProjectRequest.class), eq(1L)))
                .thenReturn(projectResponse);

        buildMockMvc(clientManager).perform(post("/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("SmartFlow"));
    }

    @Test
    void createProject_asAdmin_returnsForbidden() throws Exception {
        buildMockMvc(adminUser).perform(post("/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ProjectRequest())))
                .andExpect(status().isForbidden());

        verifyNoInteractions(projectService);
    }

    // ════════════════════════════════════════════════════════════════════
    //  PUT /projects/{id}  (MANAGER only)
    // ════════════════════════════════════════════════════════════════════

    @Test
    void updateProject_asManager_returnsOk() throws Exception {
        ProjectRequest req = new ProjectRequest();
        req.setName("Updated");

        when(projectService.getMyRole(10L, 1L)).thenReturn("MANAGER");
        when(projectService.updateProject(eq(10L), any(), eq(1L))).thenReturn(projectResponse);

        buildMockMvc(clientManager).perform(put("/projects/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    @Test
    void updateProject_asMember_returnsForbidden() throws Exception {
        when(projectService.getMyRole(10L, 1L)).thenReturn("MEMBER");

        buildMockMvc(clientManager).perform(put("/projects/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ProjectRequest())))
                .andExpect(status().isForbidden());

        verify(projectService, never()).updateProject(any(), any(), any());
    }

    @Test
    void updateProject_asAdmin_returnsForbidden() throws Exception {
        buildMockMvc(adminUser).perform(put("/projects/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ProjectRequest())))
                .andExpect(status().isForbidden());
    }

    // ════════════════════════════════════════════════════════════════════
    //  PATCH /projects/{id}/archive
    // ════════════════════════════════════════════════════════════════════

    @Test
    void archiveProject_asAdmin_returnsNoContent() throws Exception {
        doNothing().when(projectService).archiveProject(10L);

        buildMockMvc(adminUser).perform(patch("/projects/10/archive"))
                .andExpect(status().isNoContent());

        verify(projectService).archiveProject(10L);
    }

    @Test
    void archiveProject_asManager_returnsNoContent() throws Exception {
        when(projectService.getMyRole(10L, 1L)).thenReturn("MANAGER");
        doNothing().when(projectService).archiveProject(10L);

        buildMockMvc(clientManager).perform(patch("/projects/10/archive"))
                .andExpect(status().isNoContent());
    }

    @Test
    void archiveProject_asMember_returnsForbidden() throws Exception {
        when(projectService.getMyRole(10L, 1L)).thenReturn("MEMBER");

        buildMockMvc(clientManager).perform(patch("/projects/10/archive"))
                .andExpect(status().isForbidden());

        verify(projectService, never()).archiveProject(any());
    }

    // ════════════════════════════════════════════════════════════════════
    //  PATCH /projects/{id}/restore
    // ════════════════════════════════════════════════════════════════════

    @Test
    void restoreProject_asAdmin_returnsNoContent() throws Exception {
        doNothing().when(projectService).restoreProject(10L);

        buildMockMvc(adminUser).perform(patch("/projects/10/restore"))
                .andExpect(status().isNoContent());
    }

    @Test
    void restoreProject_asManager_returnsNoContent() throws Exception {
        when(projectService.getMyRole(10L, 1L)).thenReturn("MANAGER");
        doNothing().when(projectService).restoreProject(10L);

        buildMockMvc(clientManager).perform(patch("/projects/10/restore"))
                .andExpect(status().isNoContent());
    }

    @Test
    void restoreProject_asMember_returnsForbidden() throws Exception {
        when(projectService.getMyRole(10L, 1L)).thenReturn("MEMBER");

        buildMockMvc(clientManager).perform(patch("/projects/10/restore"))
                .andExpect(status().isForbidden());
    }

    // ════════════════════════════════════════════════════════════════════
    //  PATCH /projects/{id}/finish  (MANAGER only)
    // ════════════════════════════════════════════════════════════════════

    @Test
    void finishProject_asManager_returnsNoContent() throws Exception {
        when(projectService.getMyRole(10L, 1L)).thenReturn("MANAGER");
        doNothing().when(projectService).finishProject(10L);

        buildMockMvc(clientManager).perform(patch("/projects/10/finish"))
                .andExpect(status().isNoContent());

        verify(projectService).finishProject(10L);
    }

    @Test
    void finishProject_asMember_returnsForbidden() throws Exception {
        when(projectService.getMyRole(10L, 1L)).thenReturn("MEMBER");

        buildMockMvc(clientManager).perform(patch("/projects/10/finish"))
                .andExpect(status().isForbidden());
    }

    @Test
    void finishProject_asAdmin_returnsForbidden() throws Exception {
        buildMockMvc(adminUser).perform(patch("/projects/10/finish"))
                .andExpect(status().isForbidden());
    }

    // ════════════════════════════════════════════════════════════════════
    //  PATCH /projects/{id}/restore-finished
    // ════════════════════════════════════════════════════════════════════

    @Test
    void restoreFinishedProject_asAdmin_returnsNoContent() throws Exception {
        doNothing().when(projectService).restoreFinishedProject(10L);

        buildMockMvc(adminUser).perform(patch("/projects/10/restore-finished"))
                .andExpect(status().isNoContent());
    }

    @Test
    void restoreFinishedProject_asManager_returnsNoContent() throws Exception {
        when(projectService.getMyRole(10L, 1L)).thenReturn("MANAGER");
        doNothing().when(projectService).restoreFinishedProject(10L);

        buildMockMvc(clientManager).perform(patch("/projects/10/restore-finished"))
                .andExpect(status().isNoContent());
    }

    @Test
    void restoreFinishedProject_asMember_returnsForbidden() throws Exception {
        when(projectService.getMyRole(10L, 1L)).thenReturn("MEMBER");

        buildMockMvc(clientManager).perform(patch("/projects/10/restore-finished"))
                .andExpect(status().isForbidden());
    }

    // ════════════════════════════════════════════════════════════════════
    //  GET /projects/{id}/members
    // ════════════════════════════════════════════════════════════════════

    @Test
    void getProjectMembers_asAdmin_returnsList() throws Exception {
        ProjectMemberResponse member = ProjectMemberResponse.builder()
                .clientId(5L).fullName("Bob Martin").role("MEMBER").build();

        when(projectService.getProjectMembers(10L)).thenReturn(List.of(member));

        buildMockMvc(adminUser).perform(get("/projects/10/members"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].fullName").value("Bob Martin"));
    }

    @Test
    void getProjectMembers_asClientMember_returnsOk() throws Exception {
        when(projectService.getMyRole(10L, 1L)).thenReturn("MEMBER");
        when(projectService.getProjectMembers(10L)).thenReturn(Collections.emptyList());

        buildMockMvc(clientManager).perform(get("/projects/10/members"))
                .andExpect(status().isOk());
    }

    @Test
    void getProjectMembers_asClientNotMember_returnsForbidden() throws Exception {
        when(projectService.getMyRole(10L, 1L)).thenReturn(null);

        buildMockMvc(clientManager).perform(get("/projects/10/members"))
                .andExpect(status().isForbidden());
    }

    // ════════════════════════════════════════════════════════════════════
    //  POST /projects/{id}/members/{clientId}  (MANAGER only)
    // ════════════════════════════════════════════════════════════════════

    @Test
    void addMember_asManager_returnsCreated() throws Exception {
        when(projectService.getMyRole(10L, 1L)).thenReturn("MANAGER");
        doNothing().when(projectService).addMember(10L, 5L, 1L);

        buildMockMvc(clientManager).perform(post("/projects/10/members/5"))
                .andExpect(status().isCreated());

        verify(projectService).addMember(10L, 5L, 1L);
    }

    @Test
    void addMember_asMember_returnsForbidden() throws Exception {
        when(projectService.getMyRole(10L, 1L)).thenReturn("MEMBER");

        buildMockMvc(clientManager).perform(post("/projects/10/members/5"))
                .andExpect(status().isForbidden());

        verify(projectService, never()).addMember(any(), any(), any());
    }

    @Test
    void addMember_asAdmin_returnsForbidden() throws Exception {
        buildMockMvc(adminUser).perform(post("/projects/10/members/5"))
                .andExpect(status().isForbidden());
    }

    // ════════════════════════════════════════════════════════════════════
    //  DELETE /projects/{id}/members/{clientId}  (MANAGER only)
    // ════════════════════════════════════════════════════════════════════

    @Test
    void removeMember_asManager_returnsNoContent() throws Exception {
        when(projectService.getMyRole(10L, 1L)).thenReturn("MANAGER");
        doNothing().when(projectService).removeMember(10L, 5L, 1L);

        buildMockMvc(clientManager).perform(delete("/projects/10/members/5"))
                .andExpect(status().isNoContent());

        verify(projectService).removeMember(10L, 5L, 1L);
    }

    @Test
    void removeMember_asMember_returnsForbidden() throws Exception {
        when(projectService.getMyRole(10L, 1L)).thenReturn("MEMBER");

        buildMockMvc(clientManager).perform(delete("/projects/10/members/5"))
                .andExpect(status().isForbidden());
    }

    @Test
    void removeMember_asAdmin_returnsForbidden() throws Exception {
        buildMockMvc(adminUser).perform(delete("/projects/10/members/5"))
                .andExpect(status().isForbidden());
    }

    // ════════════════════════════════════════════════════════════════════
    //  GET /projects/{id}/my-role
    // ════════════════════════════════════════════════════════════════════

    @Test
    void getMyRole_asAdmin_returnsAdminRole() throws Exception {
        buildMockMvc(adminUser).perform(get("/projects/10/my-role"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("ADMIN"));
    }

    @Test
    void getMyRole_asClientManager_returnsManagerRole() throws Exception {
        when(projectService.getMyRole(10L, 1L)).thenReturn("MANAGER");

        buildMockMvc(clientManager).perform(get("/projects/10/my-role"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("MANAGER"));
    }

    @Test
    void getMyRole_asClientMember_returnsMemberRole() throws Exception {
        when(projectService.getMyRole(10L, 1L)).thenReturn("MEMBER");

        buildMockMvc(clientManager).perform(get("/projects/10/my-role"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("MEMBER"));
    }

    @Test
    void getMyRole_asClientNotInProject_returnsForbidden() throws Exception {
        when(projectService.getMyRole(10L, 1L)).thenReturn(null);

        buildMockMvc(clientManager).perform(get("/projects/10/my-role"))
                .andExpect(status().isForbidden());
    }
}