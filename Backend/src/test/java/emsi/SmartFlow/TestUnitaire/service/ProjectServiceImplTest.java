package emsi.SmartFlow.TestUnitaire.service;

import emsi.SmartFlow.controller.dto.project.ProjectRequest;
import emsi.SmartFlow.controller.dto.project.ProjectResponse;
import emsi.SmartFlow.entity.Client;
import emsi.SmartFlow.entity.Project;
import emsi.SmartFlow.entity.enums.ProjectStatus;
import emsi.SmartFlow.entity.keys.ProjectTeamKey;
import emsi.SmartFlow.repo.ClientRepo;
import emsi.SmartFlow.repo.ProjectRepository;
import emsi.SmartFlow.repo.ProjectTeamRepository;
import emsi.SmartFlow.repo.TaskRepository;
import emsi.SmartFlow.service.impl.ProjectServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceImplTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProjectTeamRepository projectTeamRepository;

    @Mock
    private ClientRepo clientRepo;

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private ProjectServiceImpl projectService;

    private Project project;
    private ProjectRequest request;
    private Client client;

    @BeforeEach
    void setUp() {
        client = Client.builder()
                .id(1L)
                .email("test@example.com")
                .build();

        project = Project.builder()
                .id(1L)
                .name("Project 1")
                .status(ProjectStatus.ACTIVE)
                .owner(client)
                .build();

        request = new ProjectRequest();
        request.setName("Project 1");
    }

    // ───────────── CREATE ─────────────
    @Test
    void create_shouldWork() {
        when(projectRepository.existsByNameAndOwnerId(anyString(), anyLong())).thenReturn(false);
        when(clientRepo.findById(1L)).thenReturn(Optional.of(client));
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        ProjectResponse res = projectService.createProject(request, 1L);

        assertThat(res.getName()).isEqualTo("Project 1");
    }

    // ───────────── GET OK ─────────────
    @Test
    void getById_shouldReturn() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));

        ProjectResponse res = projectService.getProjectById(1L, null);

        assertThat(res.getId()).isEqualTo(1L);
    }

    // ───────────── GET NOT FOUND ─────────────
    @Test
    void getById_shouldThrow() {
        when(projectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.getProjectById(99L, null))
                .isInstanceOf(EntityNotFoundException.class);
    }

    // ───────────── GET MY PROJECTS ─────────────
    @Test
    void getMyProjects_shouldReturn() {
        when(projectRepository.findAllByClientId(1L)).thenReturn(List.of(project));

        List<ProjectResponse> list = projectService.getMyProjects(1L, null);

        assertThat(list).hasSize(1);
    }

    // ───────────── ARCHIVE PROJECT ─────────────
    @Test
    void archiveProject_shouldWork() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        projectService.archiveProject(1L);

        verify(projectRepository).save(project);
    }

    // ───────────── RESTORE PROJECT ─────────────
    @Test
    void restoreProject_shouldWork() {
        project.setStatus(ProjectStatus.ARCHIVED);
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(projectRepository.save(any(Project.class))).thenReturn(project);
        projectService.restoreProject(1L);
        verify(projectRepository).save(project);
    }

    // ───────────── FINISH PROJECT ─────────────
    @Test
    void finishProject_shouldWork() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        projectService.finishProject(1L);

        verify(projectRepository).save(project);
    }

    // ───────────── GET MY ROLE ─────────────
    @Test
    void getMyRole_shouldReturn() {
        when(projectTeamRepository.findByIdProjectIdAndIdClientId(1L, 1L))
                .thenReturn(Optional.of(emsi.SmartFlow.entity.ProjectTeam.builder()
                        .projectRole(emsi.SmartFlow.entity.enums.ProjectTeamRole.MANAGER)
                        .build()));

        String role = projectService.getMyRole(1L, 1L);

        assertThat(role).isEqualTo("MANAGER");
    }

    // ───────────── GET MY ROLE NOT FOUND ─────────────
    @Test
    void getMyRole_shouldReturnNull() {
        when(projectTeamRepository.findByIdProjectIdAndIdClientId(1L, 1L))
                .thenReturn(Optional.empty());

        String role = projectService.getMyRole(1L, 1L);

        assertThat(role).isNull();
    }

    // ───────────── UPDATE PROJECT ─────────────
    @Test
    void updateProject_shouldWork() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        ProjectResponse res = projectService.updateProject(1L, request, 1L);

        assertThat(res.getId()).isEqualTo(1L);
    }

    // ───────────── ADD MEMBER ─────────────
    @Test
    void addMember_shouldWork() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(clientRepo.findById(2L)).thenReturn(Optional.of(client));
        when(projectTeamRepository.existsByIdProjectIdAndIdClientId(1L, 2L)).thenReturn(false);

        projectService.addMember(1L, 2L, 1L);

        verify(projectTeamRepository).save(any());
    }

    // ───────────── REMOVE MEMBER ─────────────
    @Test
    void removeMember_shouldWork() {

        ProjectTeamKey key = new ProjectTeamKey(1L, 2L);

        when(projectTeamRepository.existsById(key))
                .thenReturn(true);

        projectService.removeMember(1L, 2L, 1L);

        verify(projectTeamRepository).deleteById(key);
    }

    // ───────────── RESTORE FINISHED PROJECT ─────────────
    @Test
    void restoreFinishedProject_shouldWork() {
        project.setStatus(ProjectStatus.FINISHED);
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(projectRepository.save(any(Project.class))).thenReturn(project);
        projectService.restoreFinishedProject(1L);
        verify(projectRepository).save(project);
    }

    // ───────────── GET PROJECT MEMBERS ─────────────
    @Test
    void getProjectMembers_shouldReturn() {

        when(projectRepository.findById(1L))
                .thenReturn(Optional.of(project));

        when(projectTeamRepository.findByProjectIdWithClient(1L))
                .thenReturn(List.of());

        List<emsi.SmartFlow.controller.dto.ProjectMember.ProjectMemberResponse> members =
                projectService.getProjectMembers(1L);

        assertThat(members).isNotNull();
    }

    // ───────────── CREATE PROJECT WITH DUPLICATE NAME ─────────────
    @Test
    void createProject_shouldThrowOnDuplicateName() {
        when(projectRepository.existsByNameAndOwnerId(anyString(), anyLong())).thenReturn(true);

        assertThatThrownBy(() -> projectService.createProject(request, 1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already have a project with this name");
    }

    // ───────────── CREATE PROJECT WITH EMPTY NAME ─────────────
    @Test
    void createProject_shouldThrowOnEmptyName() {
        request.setName("");

        assertThatThrownBy(() -> projectService.createProject(request, 1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Project name is required");
    }
}