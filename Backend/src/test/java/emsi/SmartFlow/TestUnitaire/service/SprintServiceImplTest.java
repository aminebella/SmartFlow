package emsi.SmartFlow.TestUnitaire.service;

import emsi.SmartFlow.controller.dto.sprint.SprintRequest;
import emsi.SmartFlow.controller.dto.sprint.SprintResponse;
import emsi.SmartFlow.entity.Project;
import emsi.SmartFlow.entity.Sprint;
import emsi.SmartFlow.entity.enums.SprintStatus;
import emsi.SmartFlow.exception.ResourceNotFoundException;
import emsi.SmartFlow.repo.ProjectRepository;
import emsi.SmartFlow.repo.SprintRepo;
import emsi.SmartFlow.repo.TaskRepository;
import emsi.SmartFlow.service.impl.SprintServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SprintServiceImplTest {

    @Mock private SprintRepo sprintRepo;
    @Mock private ProjectRepository projectRepo;
    @Mock private TaskRepository taskRepo;

    @InjectMocks
    private SprintServiceImpl sprintService;

    private Project project;
    private Sprint sprint;
    private SprintRequest request;

    @BeforeEach
    void setUp() {
        project = Project.builder().id(1L).build();

        sprint = Sprint.builder()
                .id(1L)
                .title("Sprint 1")
                .goal("Objectif test")
                .startDate(LocalDate.of(2026, 5, 1))
                .endDate(LocalDate.of(2026, 5, 15))
                .status(SprintStatus.PLANNED)
                .project(project)
                .build();

        request = new SprintRequest(
                "Sprint 1",
                "Objectif test",
                LocalDate.of(2026, 5, 1),
                LocalDate.of(2026, 5, 15),
                SprintStatus.PLANNED
        );
    }

    @Test
    void listByProject_shouldReturnSprints() {
        when(projectRepo.existsById(1L)).thenReturn(true);
        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(1L))
                .thenReturn(List.of(sprint));

        List<SprintResponse> result = sprintService.listByProject(1L);

        assertThat(result).hasSize(1);
        verify(sprintRepo).findByProjectIdOrderByStartDateAscIdAsc(1L);
    }

    @Test
    void listByProject_shouldThrowIfProjectNotFound() {
        when(projectRepo.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> sprintService.listByProject(99L))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(sprintRepo, never()).findByProjectIdOrderByStartDateAscIdAsc(any());
    }

    @Test
    void getById_shouldReturnSprint() {
        when(sprintRepo.findById(1L)).thenReturn(Optional.of(sprint));

        SprintResponse result = sprintService.getById(1L);

        assertThat(result.id()).isEqualTo(1L);
    }

    @Test
    void getById_shouldThrowIfNotFound() {
        when(sprintRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sprintService.getById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void create_shouldCreateSprint() {
        when(projectRepo.findById(1L)).thenReturn(Optional.of(project));
        when(sprintRepo.save(any(Sprint.class))).thenReturn(sprint);

        SprintResponse result = sprintService.create(1L, request);

        assertThat(result.title()).isEqualTo("Sprint 1");
        verify(sprintRepo).save(any(Sprint.class));
    }

    @Test
    void create_shouldThrowIfProjectNotFound() {
        when(projectRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sprintService.create(99L, request))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(sprintRepo, never()).save(any());
    }

    @Test
    void delete_shouldDeleteSprint() {
        when(sprintRepo.existsById(1L)).thenReturn(true);

        sprintService.delete(1L);

        verify(sprintRepo).deleteById(1L);
    }

    @Test
    void delete_shouldThrowIfNotFound() {
        when(sprintRepo.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> sprintService.delete(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void create_shouldDefaultToPlanned() {
        SprintRequest req = new SprintRequest(
                "Sprint sans status",
                null,
                LocalDate.of(2026, 5, 1),
                LocalDate.of(2026, 5, 15),
                null
        );

        Sprint saved = Sprint.builder()
                .id(2L)
                .title("Sprint sans status")
                .status(SprintStatus.PLANNED)
                .project(project)
                .startDate(LocalDate.of(2026, 5, 1))
                .endDate(LocalDate.of(2026, 5, 15))
                .build();

        when(projectRepo.findById(1L)).thenReturn(Optional.of(project));
        when(sprintRepo.save(any(Sprint.class))).thenReturn(saved);

        SprintResponse result = sprintService.create(1L, req);

        assertThat(result.status()).isEqualTo(SprintStatus.PLANNED);
    }
}