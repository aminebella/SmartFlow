package emsi.SmartFlow.TestUnitaire.service.impl;

import emsi.SmartFlow.Utils.ClientUtils;
import emsi.SmartFlow.controller.converter.ClientConverter;
import emsi.SmartFlow.controller.dto.client.ClientProfileResponse;
import emsi.SmartFlow.controller.dto.client.UpdateProfileRequest;
import emsi.SmartFlow.controller.dto.project.ProjectResponse;
import emsi.SmartFlow.entity.Client;
import emsi.SmartFlow.repo.ClientRepo;
import emsi.SmartFlow.service.facade.ProjectService;
import emsi.SmartFlow.service.impl.ClientServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientServiceImplTest {

    @Mock
    private ClientRepo clientRepo;

    @Mock
    private ClientConverter clientConverter;

    @Mock
    private ProjectService projectService;

    @InjectMocks
    private ClientServiceImpl clientService;

    private Client client;
    private ClientProfileResponse profileResponse;

    @BeforeEach
    void setUp() {
        client = new Client();
        client.setId(1L);
        client.setFirstname("Jane");
        client.setLastname("Doe");

        // ClientProfileResponse uses @Builder
        profileResponse = ClientProfileResponse.builder()
                .id(1L)
                .fullName("Jane Doe")
                .email("jane@test.com")
                .build();
    }

    @Test
    void getClientById_shouldReturnProfile() {
        List<ProjectResponse> projects = List.of();

        try (MockedStatic<ClientUtils> utils = mockStatic(ClientUtils.class)) {
            utils.when(() -> ClientUtils.findClientOrThrow(clientRepo, 1L)).thenReturn(client);
            when(projectService.getMyProjects(1L, null)).thenReturn(projects);
            when(clientConverter.toProfileDTO(client, projects)).thenReturn(profileResponse);

            ClientProfileResponse result = clientService.getClientById(1L);

            assertNotNull(result);
            assertEquals(1L, result.getId());
            verify(projectService).getMyProjects(1L, null);
            verify(clientConverter).toProfileDTO(client, projects);
        }
    }

    @Test
    void updateProfile_shouldUpdateFirstname() throws Exception {
        // UpdateProfileRequest uses @Data @NoArgsConstructor — standard setters
        // NOTE: field is "PostTitle" (capital P) based on the actual class
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setFirstname("NewName");

        List<ProjectResponse> projects = List.of();

        try (MockedStatic<ClientUtils> utils = mockStatic(ClientUtils.class)) {
            utils.when(() -> ClientUtils.findClientOrThrow(clientRepo, 1L)).thenReturn(client);
            when(clientRepo.save(client)).thenReturn(client);
            when(projectService.getMyProjects(1L, null)).thenReturn(projects);
            when(clientConverter.toProfileDTO(client, projects)).thenReturn(profileResponse);

            ClientProfileResponse result = clientService.updateProfile(1L, request);

            assertNotNull(result);
            assertEquals("NewName", client.getFirstname());
            verify(clientRepo).save(client);
        }
    }

    @Test
    void updateProfile_shouldUpdateLastname() throws Exception {
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setLastname("NewLastname");

        List<ProjectResponse> projects = List.of();

        try (MockedStatic<ClientUtils> utils = mockStatic(ClientUtils.class)) {
            utils.when(() -> ClientUtils.findClientOrThrow(clientRepo, 1L)).thenReturn(client);
            when(clientRepo.save(client)).thenReturn(client);
            when(projectService.getMyProjects(1L, null)).thenReturn(projects);
            when(clientConverter.toProfileDTO(client, projects)).thenReturn(profileResponse);

            clientService.updateProfile(1L, request);

            assertEquals("NewLastname", client.getLastname());
        }
    }

    @Test
    void updateProfile_shouldUpdateLocation() throws Exception {
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setLocation("Casablanca");

        List<ProjectResponse> projects = List.of();

        try (MockedStatic<ClientUtils> utils = mockStatic(ClientUtils.class)) {
            utils.when(() -> ClientUtils.findClientOrThrow(clientRepo, 1L)).thenReturn(client);
            when(clientRepo.save(client)).thenReturn(client);
            when(projectService.getMyProjects(1L, null)).thenReturn(projects);
            when(clientConverter.toProfileDTO(client, projects)).thenReturn(profileResponse);

            clientService.updateProfile(1L, request);

            assertEquals("Casablanca", client.getLocation());
        }
    }

    @Test
    void updateProfile_withAllNullFields_shouldNotModifyClient() throws Exception {
        // All fields null — no field should be changed
        UpdateProfileRequest request = new UpdateProfileRequest();

        List<ProjectResponse> projects = List.of();

        try (MockedStatic<ClientUtils> utils = mockStatic(ClientUtils.class)) {
            utils.when(() -> ClientUtils.findClientOrThrow(clientRepo, 1L)).thenReturn(client);
            when(clientRepo.save(client)).thenReturn(client);
            when(projectService.getMyProjects(1L, null)).thenReturn(projects);
            when(clientConverter.toProfileDTO(client, projects)).thenReturn(profileResponse);

            clientService.updateProfile(1L, request);

            // Values should remain unchanged
            assertEquals("Jane", client.getFirstname());
            assertEquals("Doe", client.getLastname());
        }
    }

    @Test
    void updateProfile_withEmptyProfilePicture_shouldNotSaveFile() throws Exception {
        UpdateProfileRequest request = new UpdateProfileRequest();
        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.isEmpty()).thenReturn(true);
        request.setProfilePicture(mockFile);

        List<ProjectResponse> projects = List.of();

        try (MockedStatic<ClientUtils> utils = mockStatic(ClientUtils.class)) {
            utils.when(() -> ClientUtils.findClientOrThrow(clientRepo, 1L)).thenReturn(client);
            when(clientRepo.save(client)).thenReturn(client);
            when(projectService.getMyProjects(1L, null)).thenReturn(projects);
            when(clientConverter.toProfileDTO(client, projects)).thenReturn(profileResponse);

            clientService.updateProfile(1L, request);

            // Profile picture stays null since file is empty
            assertNull(client.getProfilePicture());
        }
    }

    @Test
    void updateProfile_withEmptyCoverPicture_shouldNotSaveFile() throws Exception {
        UpdateProfileRequest request = new UpdateProfileRequest();
        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.isEmpty()).thenReturn(true);
        request.setCoverPicture(mockFile);

        List<ProjectResponse> projects = List.of();

        try (MockedStatic<ClientUtils> utils = mockStatic(ClientUtils.class)) {
            utils.when(() -> ClientUtils.findClientOrThrow(clientRepo, 1L)).thenReturn(client);
            when(clientRepo.save(client)).thenReturn(client);
            when(projectService.getMyProjects(1L, null)).thenReturn(projects);
            when(clientConverter.toProfileDTO(client, projects)).thenReturn(profileResponse);

            clientService.updateProfile(1L, request);

            assertNull(client.getCoverPicture());
        }
    }
}