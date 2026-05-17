package emsi.SmartFlow.TestUnitaire.controller.facade;

import emsi.SmartFlow.controller.dto.client.ClientProfileResponse;
import emsi.SmartFlow.controller.facade.AdminController;
import emsi.SmartFlow.service.facade.AdminService;
import emsi.SmartFlow.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for AdminController.
 *
 * WHY assertThrows FOR "non-admin" CASES:
 * SecurityUtils.requireAdmin() throws AccessDeniedException.
 * In standaloneSetup (no global exception handler), MockMvc re-throws it
 * wrapped in ServletException instead of converting to HTTP 500.
 * So we use assertThrows(ServletException.class, ...) to verify the
 * security check fires. This also lets us verify the service is never called.
 */
@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

    @Mock
    private AdminService adminService;

    @InjectMocks
    private AdminController adminController;

    private MockMvc mockMvc; // admin user by default

    private User userWithRole(String role) {
        User u = mock(User.class);
        org.springframework.security.core.authority.SimpleGrantedAuthority auth =
                new org.springframework.security.core.authority.SimpleGrantedAuthority(role);
        lenient().doReturn(List.of(auth)).when(u).getAuthorities();
        return u;
    }

    private MockMvc buildMockMvc(User user) {
        return MockMvcBuilders
                .standaloneSetup(adminController)
                .setCustomArgumentResolvers(new HandlerMethodArgumentResolver() {
                    @Override
                    public boolean supportsParameter(MethodParameter p) {
                        return User.class.isAssignableFrom(p.getParameterType());
                    }
                    @Override
                    public Object resolveArgument(MethodParameter p, ModelAndViewContainer m,
                                                  NativeWebRequest r, WebDataBinderFactory b) {
                        return user;
                    }
                })
                .build();
    }

    @BeforeEach
    void setUp() {
        mockMvc = buildMockMvc(userWithRole("ADMIN"));
    }

    // ── GET /admin/clients ────────────────────────────────────────────

    @Test
    void getAllClients_asAdmin_returnsOkWithList() throws Exception {
        ClientProfileResponse c = ClientProfileResponse.builder()
                .id(1L).fullName("Ali Hassan").email("ali@test.com").build();
        when(adminService.getAllClients()).thenReturn(List.of(c));

        mockMvc.perform(get("/admin/clients"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].fullName").value("Ali Hassan"))
                .andExpect(jsonPath("$[0].id").value(1));

        verify(adminService).getAllClients();
    }

    @Test
    void getAllClients_asAdmin_emptyList_returnsOk() throws Exception {
        when(adminService.getAllClients()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/admin/clients"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void getAllClients_asAdmin_multipleClients_returnsAll() throws Exception {
        when(adminService.getAllClients()).thenReturn(List.of(
                ClientProfileResponse.builder().id(1L).fullName("Ali Hassan").email("ali@test.com").build(),
                ClientProfileResponse.builder().id(2L).fullName("Sara Benali").email("sara@test.com").build()
        ));

        mockMvc.perform(get("/admin/clients"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[1].fullName").value("Sara Benali"));
    }

    @Test
    void getAllClients_asClient_throwsServletException() {
        MockMvc clientMvc = buildMockMvc(userWithRole("CLIENT"));

        assertThrows(jakarta.servlet.ServletException.class,
                () -> clientMvc.perform(get("/admin/clients")));

        verifyNoInteractions(adminService);
    }

    // ── GET /admin/clients/{id} ───────────────────────────────────────

    @Test
    void getClientById_asAdmin_returnsClient() throws Exception {
        when(adminService.getClientById(2L)).thenReturn(
                ClientProfileResponse.builder()
                        .id(2L).fullName("Sara Benali").email("sara@test.com").build());

        mockMvc.perform(get("/admin/clients/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.fullName").value("Sara Benali"));

        verify(adminService).getClientById(2L);
    }

    @Test
    void getClientById_asAdmin_differentId_callsServiceCorrectly() throws Exception {
        when(adminService.getClientById(99L)).thenReturn(
                ClientProfileResponse.builder().id(99L).fullName("Test User").email("t@t.com").build());

        mockMvc.perform(get("/admin/clients/99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(99));
    }

    @Test
    void getClientById_asClient_throwsServletException() {
        MockMvc clientMvc = buildMockMvc(userWithRole("CLIENT"));

        assertThrows(jakarta.servlet.ServletException.class,
                () -> clientMvc.perform(get("/admin/clients/1")));

        verifyNoInteractions(adminService);
    }

    // ── PUT /admin/clients/{id}/block ─────────────────────────────────

    @Test
    void blockClient_asAdmin_returnsOk() throws Exception {
        doNothing().when(adminService).blockClient(3L);

        mockMvc.perform(put("/admin/clients/3/block"))
                .andExpect(status().isOk());

        verify(adminService).blockClient(3L);
    }

    @Test
    void blockClient_asAdmin_differentId_callsServiceCorrectly() throws Exception {
        doNothing().when(adminService).blockClient(42L);

        mockMvc.perform(put("/admin/clients/42/block"))
                .andExpect(status().isOk());

        verify(adminService).blockClient(42L);
    }

    @Test
    void blockClient_asClient_throwsServletException() {
        MockMvc clientMvc = buildMockMvc(userWithRole("CLIENT"));

        assertThrows(jakarta.servlet.ServletException.class,
                () -> clientMvc.perform(put("/admin/clients/3/block")));

        verifyNoInteractions(adminService);
    }

    // ── PUT /admin/clients/{id}/unblock ──────────────────────────────

    @Test
    void unblockClient_asAdmin_returnsOk() throws Exception {
        doNothing().when(adminService).unblockClient(3L);

        mockMvc.perform(put("/admin/clients/3/unblock"))
                .andExpect(status().isOk());

        verify(adminService).unblockClient(3L);
    }

    @Test
    void unblockClient_asAdmin_differentId_callsServiceCorrectly() throws Exception {
        doNothing().when(adminService).unblockClient(7L);

        mockMvc.perform(put("/admin/clients/7/unblock"))
                .andExpect(status().isOk());

        verify(adminService).unblockClient(7L);
    }

    @Test
    void unblockClient_asClient_throwsServletException() {
        MockMvc clientMvc = buildMockMvc(userWithRole("CLIENT"));

        assertThrows(jakarta.servlet.ServletException.class,
                () -> clientMvc.perform(put("/admin/clients/3/unblock")));

        verifyNoInteractions(adminService);
    }

    @Test
    void blockThenUnblock_callsBothServicesCorrectly() throws Exception {
        doNothing().when(adminService).blockClient(5L);
        doNothing().when(adminService).unblockClient(5L);

        mockMvc.perform(put("/admin/clients/5/block")).andExpect(status().isOk());
        mockMvc.perform(put("/admin/clients/5/unblock")).andExpect(status().isOk());

        verify(adminService).blockClient(5L);
        verify(adminService).unblockClient(5L);
    }
}