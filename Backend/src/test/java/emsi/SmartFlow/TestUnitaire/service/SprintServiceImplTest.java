package emsi.SmartFlow.TestUnitaire.service;

import emsi.SmartFlow.controller.dto.sprint.SprintRequest;
import emsi.SmartFlow.controller.dto.sprint.SprintResponse;
import emsi.SmartFlow.entity.Project;
import emsi.SmartFlow.entity.Sprint;
import emsi.SmartFlow.entity.enums.SprintStatus;
import emsi.SmartFlow.exception.ResourceNotFoundException;
import emsi.SmartFlow.repo.ProjectRepository;
import emsi.SmartFlow.repo.SprintRepo;
import emsi.SmartFlow.service.impl.SprintServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
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

    @Mock private SprintRepo        sprintRepo;
    @Mock private ProjectRepository projectRepo;

    @InjectMocks
    private SprintServiceImpl sprintService;

    private Project project;
    private Sprint  plannedSprint;
    private Sprint  activeSprint;
    private SprintRequest request;

    @BeforeEach
    void setUp() {
        project = Project.builder().id(1L).build();

        plannedSprint = Sprint.builder()
                .id(1L).title("Sprint 1").goal("Objectif test")
                .startDate(LocalDate.of(2026, 5, 1))
                .endDate(LocalDate.of(2026, 5, 15))
                .status(SprintStatus.PLANNED).project(project)
                .build();

        activeSprint = Sprint.builder()
                .id(2L).title("Sprint 2").goal("Goal active")
                .startDate(LocalDate.of(2026, 5, 1))
                .endDate(LocalDate.of(2026, 5, 15))
                .status(SprintStatus.ACTIVE).project(project)
                .build();

        request = new SprintRequest(
                "Sprint 1", "Objectif test",
                LocalDate.of(2026, 5, 1),
                LocalDate.of(2026, 5, 15),
                SprintStatus.PLANNED
        );
    }

    // ═══════════════════════════════════════════════════════════
    //  listByProject
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("listByProject()")
    class ListByProjectTests {

        @Test
        void returnsSprintList_whenProjectExists() {
            when(projectRepo.existsById(1L)).thenReturn(true);
            when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(1L))
                    .thenReturn(List.of(plannedSprint));

            List<SprintResponse> result = sprintService.listByProject(1L);

            assertThat(result).hasSize(1);
            assertThat(result.get(0).title()).isEqualTo("Sprint 1");
        }

        @Test
        void throwsResourceNotFound_whenProjectMissing() {
            when(projectRepo.existsById(99L)).thenReturn(false);

            assertThatThrownBy(() -> sprintService.listByProject(99L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("99");

            verify(sprintRepo, never()).findByProjectIdOrderByStartDateAscIdAsc(any());
        }

        @Test
        void returnsEmptyList_whenProjectHasNoSprints() {
            when(projectRepo.existsById(1L)).thenReturn(true);
            when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(1L))
                    .thenReturn(List.of());

            assertThat(sprintService.listByProject(1L)).isEmpty();
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  getById
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("getById()")
    class GetByIdTests {

        @Test
        void returnsSprint_whenFound() {
            when(sprintRepo.findById(1L)).thenReturn(Optional.of(plannedSprint));

            SprintResponse result = sprintService.getById(1L);

            assertThat(result.id()).isEqualTo(1L);
            assertThat(result.status()).isEqualTo(SprintStatus.PLANNED);
        }

        @Test
        void throwsResourceNotFound_whenMissing() {
            when(sprintRepo.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> sprintService.getById(99L))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  create
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("create()")
    class CreateTests {

        @Test
        void createsSprint_withGivenStatus() {
            when(projectRepo.findById(1L)).thenReturn(Optional.of(project));
            when(sprintRepo.save(any(Sprint.class))).thenReturn(plannedSprint);

            SprintResponse result = sprintService.create(1L, request);

            assertThat(result.title()).isEqualTo("Sprint 1");
            verify(sprintRepo).save(any(Sprint.class));
        }

        @Test
        void createsSprint_defaultsToPlanned_whenStatusNull() {
            SprintRequest nullStatusReq = new SprintRequest(
                    "No Status Sprint", null,
                    LocalDate.of(2026, 5, 1), LocalDate.of(2026, 5, 15),
                    null
            );
            Sprint saved = Sprint.builder().id(3L).title("No Status Sprint")
                    .status(SprintStatus.PLANNED).project(project).build();

            when(projectRepo.findById(1L)).thenReturn(Optional.of(project));
            when(sprintRepo.save(any(Sprint.class))).thenReturn(saved);

            SprintResponse result = sprintService.create(1L, nullStatusReq);

            assertThat(result.status()).isEqualTo(SprintStatus.PLANNED);
        }

        @Test
        void throwsResourceNotFound_whenProjectMissing() {
            when(projectRepo.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> sprintService.create(99L, request))
                    .isInstanceOf(ResourceNotFoundException.class);

            verify(sprintRepo, never()).save(any());
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  update
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("update()")
    class UpdateTests {

        @Test
        void updatesSprint_whenFound() {
            SprintRequest updateReq = new SprintRequest(
                    "Sprint Updated", "New Goal",
                    LocalDate.of(2026, 6, 1), LocalDate.of(2026, 6, 15),
                    SprintStatus.ACTIVE
            );
            when(sprintRepo.findById(1L)).thenReturn(Optional.of(plannedSprint));
            when(sprintRepo.save(any())).thenReturn(plannedSprint);

            SprintResponse result = sprintService.update(1L, updateReq);

            assertThat(result).isNotNull();
            verify(sprintRepo).save(plannedSprint);
        }

        @Test
        void doesNotUpdateStatus_whenStatusNull() {
            SprintRequest nullStatusReq = new SprintRequest(
                    "Sprint Updated", "Goal",
                    LocalDate.of(2026, 6, 1), LocalDate.of(2026, 6, 15),
                    null
            );
            when(sprintRepo.findById(1L)).thenReturn(Optional.of(plannedSprint));
            when(sprintRepo.save(any())).thenReturn(plannedSprint);

            sprintService.update(1L, nullStatusReq);

            // status should remain PLANNED (unchanged)
            assertThat(plannedSprint.getStatus()).isEqualTo(SprintStatus.PLANNED);
        }

        @Test
        void throwsResourceNotFound_whenMissing() {
            when(sprintRepo.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> sprintService.update(99L, request))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  delete
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("delete()")
    class DeleteTests {

        @Test
        void deletesSprint_whenFound() {
            when(sprintRepo.existsById(1L)).thenReturn(true);

            sprintService.delete(1L);

            verify(sprintRepo).deleteById(1L);
        }

        @Test
        void throwsResourceNotFound_whenMissing() {
            when(sprintRepo.existsById(99L)).thenReturn(false);

            assertThatThrownBy(() -> sprintService.delete(99L))
                    .isInstanceOf(ResourceNotFoundException.class);

            verify(sprintRepo, never()).deleteById(any());
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  startSprint
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("startSprint()")
    class StartSprintTests {

        @Test
        void startsSprint_whenPlanned() {
            when(sprintRepo.findById(1L)).thenReturn(Optional.of(plannedSprint));
            when(sprintRepo.save(any())).thenReturn(plannedSprint);

            SprintResponse result = sprintService.startSprint(1L);

            assertThat(result).isNotNull();
            assertThat(plannedSprint.getStatus()).isEqualTo(SprintStatus.ACTIVE);
        }

        @Test
        void setsStartDateToNow_whenStartDateIsNull() {
            plannedSprint.setStartDate(null);
            when(sprintRepo.findById(1L)).thenReturn(Optional.of(plannedSprint));
            when(sprintRepo.save(any())).thenReturn(plannedSprint);

            sprintService.startSprint(1L);

            assertThat(plannedSprint.getStartDate()).isNotNull();
        }

        @Test
        void throwsIllegalState_whenNotPlanned() {
            when(sprintRepo.findById(2L)).thenReturn(Optional.of(activeSprint));

            assertThatThrownBy(() -> sprintService.startSprint(2L))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("planifié");
        }

        @Test
        void throwsResourceNotFound_whenMissing() {
            when(sprintRepo.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> sprintService.startSprint(99L))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  completeSprint
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("completeSprint()")
    class CompleteSprintTests {

        @Test
        void completesSprint_whenActive() {
            when(sprintRepo.findById(2L)).thenReturn(Optional.of(activeSprint));
            when(sprintRepo.save(any())).thenReturn(activeSprint);

            SprintResponse result = sprintService.completeSprint(2L);

            assertThat(result).isNotNull();
            assertThat(activeSprint.getStatus()).isEqualTo(SprintStatus.COMPLETED);
        }

        @Test
        void setsEndDateToNow_whenEndDateIsNull() {
            activeSprint.setEndDate(null);
            when(sprintRepo.findById(2L)).thenReturn(Optional.of(activeSprint));
            when(sprintRepo.save(any())).thenReturn(activeSprint);

            sprintService.completeSprint(2L);

            assertThat(activeSprint.getEndDate()).isNotNull();
        }

        @Test
        void throwsIllegalState_whenNotActive() {
            when(sprintRepo.findById(1L)).thenReturn(Optional.of(plannedSprint));

            assertThatThrownBy(() -> sprintService.completeSprint(1L))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("actif");
        }

        @Test
        void throwsResourceNotFound_whenMissing() {
            when(sprintRepo.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> sprintService.completeSprint(99L))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }
}