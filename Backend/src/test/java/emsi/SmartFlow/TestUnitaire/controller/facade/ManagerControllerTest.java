package emsi.SmartFlow.TestUnitaire.controller.facade;

import emsi.SmartFlow.controller.dto.teams.MemeberSummaryResponse;
import emsi.SmartFlow.controller.facade.ManagerController;
import emsi.SmartFlow.entity.Client;
import emsi.SmartFlow.service.facade.IManagerService;
import emsi.SmartFlow.service.facade.ProjectService;
import emsi.SmartFlow.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ManagerControllerTest {

    @Mock
    private IManagerService managerService;

    @Mock
    private ProjectService projectService;

    @InjectMocks
    private ManagerController managerController;

    private MockMvc mockMvc;

    // The controller does: ((Client) currentUser).getId()
    // So we need a real Client stub, not just a User mock
    private Client mockClientUser;

    private MockMvc buildMockMvc(User userToInject) {
        return MockMvcBuilders
                .standaloneSetup(managerController)
                .setCustomArgumentResolvers(new HandlerMethodArgumentResolver() {
                    @Override
                    public boolean supportsParameter(MethodParameter parameter) {
                        return User.class.isAssignableFrom(parameter.getParameterType());
                    }
                    @Override
                    public Object resolveArgument(MethodParameter p, ModelAndViewContainer m,
                                                  NativeWebRequest r, WebDataBinderFactory b) {
                        return userToInject;
                    }
                })
                .build();
    }

    @BeforeEach
    void setUp() {
        // Client extends User, so we mock Client to satisfy the cast in the controller
        mockClientUser = mock(Client.class);
        SimpleGrantedAuthority clientAuthority = new SimpleGrantedAuthority("CLIENT");
        doReturn(List.of(clientAuthority)).when(mockClientUser).getAuthorities();
        when(mockClientUser.getId()).thenReturn(1L);

        mockMvc = buildMockMvc(mockClientUser);
    }

    // ── GET /manager/projects/{projectId}/clients/search?email= ──────

    @Test
    void searchClients_asManager_returnsResults() throws Exception {
        MemeberSummaryResponse member = MemeberSummaryResponse.builder()
                .id(5L).email("sara@test.com").fullName("Sara Benali").build();

        when(projectService.getMyRole(10L, 1L)).thenReturn("MANAGER");
        when(managerService.searchClientsByEmail("sara", 1L)).thenReturn(List.of(member));

        mockMvc.perform(get("/manager/projects/10/clients/search")
                        .param("email", "sara"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("sara@test.com"))
                .andExpect(jsonPath("$[0].fullName").value("Sara Benali"));
    }

    @Test
    void searchClients_asManager_emptyResults_returnsOk() throws Exception {
        when(projectService.getMyRole(10L, 1L)).thenReturn("MANAGER");
        when(managerService.searchClientsByEmail("unknown", 1L)).thenReturn(List.of());

        mockMvc.perform(get("/manager/projects/10/clients/search")
                        .param("email", "unknown"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void searchClients_asMember_returnsForbidden() throws Exception {
        when(projectService.getMyRole(10L, 1L)).thenReturn("MEMBER");

        mockMvc.perform(get("/manager/projects/10/clients/search")
                        .param("email", "sara"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(managerService);
    }

    @Test
    void searchClients_notInProject_returnsForbidden() throws Exception {
        when(projectService.getMyRole(10L, 1L)).thenReturn(null);

        mockMvc.perform(get("/manager/projects/10/clients/search")
                        .param("email", "test"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(managerService);
    }

//    @Test
//    void searchClients_asAdminRole_returnsForbidden() throws Exception {
//        // Controller checks role == "CLIENT" first — admin gets 403
//        User adminUser = mock(User.class);
//        SimpleGrantedAuthority adminAuth = new SimpleGrantedAuthority("ADMIN");
//        doReturn(List.of(adminAuth)).when(adminUser).getAuthorities();
//
//        MockMvc adminMvc = buildMockMvc(adminUser);
//
//        adminMvc.perform(get("/manager/projects/10/clients/search")
//                        .param("email", "test"))
//                .andExpect(status().isForbidden());
//    }
}
