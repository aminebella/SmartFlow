package emsi.SmartFlow.TestUnitaire.service.impl;

import emsi.SmartFlow.Utils.ClientUtils;
import emsi.SmartFlow.controller.converter.ClientConverter;
import emsi.SmartFlow.controller.dto.client.ClientProfileResponse;
import emsi.SmartFlow.controller.dto.project.ProjectResponse;
import emsi.SmartFlow.entity.Client;
import emsi.SmartFlow.repo.ClientRepo;
import emsi.SmartFlow.service.facade.ProjectService;
import emsi.SmartFlow.service.impl.AdminServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceImplTest {

    @Mock
    private ClientRepo clientRepo;

    @Mock
    private ClientConverter clientConverter;

    @Mock
    private ProjectService projectService;

    @InjectMocks
    private AdminServiceImpl adminService;

    private Client client;
    private ClientProfileResponse profileResponse;

    @BeforeEach
    void setUp() {
        client = new Client();
        client.setId(1L);
        client.setFirstname("John");
        client.setLastname("Doe");
        client.setAccountLocked(false);

        // ClientProfileResponse uses @Builder
        profileResponse = ClientProfileResponse.builder()
                .id(1L)
                .fullName("John Doe")
                .email("john@test.com")
                .build();
    }

    @Test
    void getClientById_shouldReturnProfile() {
        List<ProjectResponse> projects = List.of();

        try (MockedStatic<ClientUtils> utils = mockStatic(ClientUtils.class)) {
            utils.when(() -> ClientUtils.findClientOrThrow(clientRepo, 1L)).thenReturn(client);
            when(projectService.getMyProjects(1L, null)).thenReturn(projects);
            when(clientConverter.toProfileDTO(client, projects)).thenReturn(profileResponse);

            ClientProfileResponse result = adminService.getClientById(1L);

            assertNotNull(result);
            assertEquals(1L, result.getId());
            verify(projectService).getMyProjects(1L, null);
            verify(clientConverter).toProfileDTO(client, projects);
        }
    }

    @Test
    void getAllClients_shouldReturnListOfProfiles() {
        List<Client> clients = List.of(client);
        List<ClientProfileResponse> responses = List.of(profileResponse);

        when(clientRepo.findAll()).thenReturn(clients);
        when(clientConverter.toProfileDTOList(clients, projectService)).thenReturn(responses);

        List<ClientProfileResponse> result = adminService.getAllClients();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(clientRepo).findAll();
        verify(clientConverter).toProfileDTOList(clients, projectService);
    }

    @Test
    void getAllClients_shouldReturnEmptyListWhenNoClients() {
        when(clientRepo.findAll()).thenReturn(List.of());
        when(clientConverter.toProfileDTOList(List.of(), projectService)).thenReturn(List.of());

        List<ClientProfileResponse> result = adminService.getAllClients();

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void blockClient_shouldSetAccountLockedTrue() {
        try (MockedStatic<ClientUtils> utils = mockStatic(ClientUtils.class)) {
            utils.when(() -> ClientUtils.findClientOrThrow(clientRepo, 1L)).thenReturn(client);
            when(clientRepo.save(client)).thenReturn(client);

            adminService.blockClient(1L);

            assertTrue(client.isAccountLocked());
            verify(clientRepo).save(client);
        }
    }

    @Test
    void unblockClient_shouldSetAccountLockedFalse() {
        client.setAccountLocked(true);

        try (MockedStatic<ClientUtils> utils = mockStatic(ClientUtils.class)) {
            utils.when(() -> ClientUtils.findClientOrThrow(clientRepo, 1L)).thenReturn(client);
            when(clientRepo.save(client)).thenReturn(client);

            adminService.unblockClient(1L);

            assertFalse(client.isAccountLocked());
            verify(clientRepo).save(client);
        }
    }

    @Test
    void blockClient_thenUnblock_shouldToggleLockState() {
        try (MockedStatic<ClientUtils> utils = mockStatic(ClientUtils.class)) {
            utils.when(() -> ClientUtils.findClientOrThrow(clientRepo, 1L)).thenReturn(client);
            when(clientRepo.save(client)).thenReturn(client);

            adminService.blockClient(1L);
            assertTrue(client.isAccountLocked());

            adminService.unblockClient(1L);
            assertFalse(client.isAccountLocked());
        }
    }
}