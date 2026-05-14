package emsi.SmartFlow.TestUnitaire.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import emsi.SmartFlow.controller.dto.AiAnalysisRequest;
import emsi.SmartFlow.controller.dto.AiAnalysisResponse;
import emsi.SmartFlow.controller.dto.ApiResponse;
import emsi.SmartFlow.entity.AiAnalysis;
import emsi.SmartFlow.entity.Project;
import emsi.SmartFlow.entity.Sprint;
import emsi.SmartFlow.entity.Task;
import emsi.SmartFlow.entity.enums.SprintStatus;
import emsi.SmartFlow.entity.enums.TaskPriority;
import emsi.SmartFlow.entity.enums.TaskStatus;
import emsi.SmartFlow.repo.*;
import emsi.SmartFlow.service.impl.AiAnalysisServiceImpl;
import emsi.SmartFlow.service.impl.GeminiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AiAnalysisServiceImplTest {

    @Mock private AiAnalysisRepository aiAnalysisRepository;
    @Mock private GeminiService geminiService;
    @Mock private SprintRepo sprintRepo;
    @Mock private TaskRepository taskRepository;
    @Mock private ProjectRepository projectRepository;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private AiAnalysisServiceImpl aiAnalysisService;

    private Project project;
    private AiAnalysis existingAnalysis;
    private AiAnalysisRequest request;

    @BeforeEach
    void setUp() {
        project = new Project();
        project.setId(1L);
        project.setName("Test Project");
        project.setType("WEB");

        existingAnalysis = AiAnalysis.builder()
                .id(10L)
                .projectId(1L)
                .projectSummary("Summary")
                .tasks("[]")
                .sprints("[]")
                .risks("[]")
                .humanResources("[]")
                .materialResources("[]")
                .timeline("{}")
                .costEstimation("{}")
                .confidenceScore("HIGH")
                .documentQuality("HIGH")
                .build();

        request = new AiAnalysisRequest();
        request.setProjectSummary("New Summary");
        request.setConfidenceScore("MEDIUM");
        request.setDocumentQuality("MEDIUM");
        request.setTasks(Collections.emptyList());
        request.setSprints(Collections.emptyList());
        request.setRisks(Collections.emptyList());
        request.setHumanResources(Collections.emptyList());
        request.setMaterialResources(Collections.emptyList());
        request.setTimeline(null);
        request.setCostEstimation(null);
    }

    // ══════════════════════════════════════════════════════════════════
    //  saveAnalysis — creates new when none exists
    // ══════════════════════════════════════════════════════════════════

    @Test
    void saveAnalysis_createsNewWhenNoneExists() {
        when(aiAnalysisRepository.findByProjectId(1L)).thenReturn(Optional.empty());
        when(aiAnalysisRepository.save(any(AiAnalysis.class))).thenAnswer(inv -> {
            AiAnalysis a = inv.getArgument(0);
            a.setId(99L);
            return a;
        });

        AiAnalysisResponse response = aiAnalysisService.saveAnalysis(1L, request);

        assertThat(response).isNotNull();
        assertThat(response.getProjectSummary()).isEqualTo("New Summary");
        verify(aiAnalysisRepository).save(any(AiAnalysis.class));
    }

    @Test
    void saveAnalysis_updatesExistingWhenFound() {
        when(aiAnalysisRepository.findByProjectId(1L)).thenReturn(Optional.of(existingAnalysis));
        when(aiAnalysisRepository.save(any(AiAnalysis.class))).thenReturn(existingAnalysis);

        AiAnalysisResponse response = aiAnalysisService.saveAnalysis(1L, request);

        assertThat(response).isNotNull();
        // The existing entity is reused (same id=10)
        verify(aiAnalysisRepository, times(1)).save(existingAnalysis);
    }

    @Test
    void saveAnalysis_withNullObjects_doesNotThrow() {
        when(aiAnalysisRepository.findByProjectId(1L)).thenReturn(Optional.empty());
        when(aiAnalysisRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        AiAnalysisRequest emptyReq = new AiAnalysisRequest();
        // all fields null
        AiAnalysisResponse response = aiAnalysisService.saveAnalysis(1L, emptyReq);
        assertThat(response).isNotNull();
    }

    // ══════════════════════════════════════════════════════════════════
    //  getAnalysis
    // ══════════════════════════════════════════════════════════════════

    @Test
    void getAnalysis_returnsResponseWhenFound() {
        when(aiAnalysisRepository.findByProjectId(1L)).thenReturn(Optional.of(existingAnalysis));

        AiAnalysisResponse response = aiAnalysisService.getAnalysis(1L);

        assertThat(response).isNotNull();
        assertThat(response.getProjectId()).isEqualTo(1L);
        assertThat(response.getConfidenceScore()).isEqualTo("HIGH");
    }

    @Test
    void getAnalysis_throwsWhenNotFound() {
        when(aiAnalysisRepository.findByProjectId(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> aiAnalysisService.getAnalysis(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Aucune analyse");
    }

    // ══════════════════════════════════════════════════════════════════
    //  validateAndSave — happy path
    // ══════════════════════════════════════════════════════════════════

    @Test
    void validateAndSave_throwsWhenProjectNotFound() {
        when(projectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> aiAnalysisService.validateAndSave(99L, request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Projet introuvable");
    }

    @Test
    void validateAndSave_withNoSprintsOrTasks_savesSuccessfully() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(1L)).thenReturn(Collections.emptyList());
        when(aiAnalysisRepository.findByProjectId(1L)).thenReturn(Optional.empty());
        when(aiAnalysisRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(projectRepository.save(any())).thenReturn(project);

        ApiResponse result = aiAnalysisService.validateAndSave(1L, request);

        assertThat(result).isNotNull();
        assertThat(result.getMessage()).contains("succès");
    }

    @Test
    void validateAndSave_deletesExistingSprintsBeforeCreatingNew() {
        Sprint oldSprint = Sprint.builder()
                .id(5L).title("Old Sprint")
                .status(SprintStatus.PLANNED)
                .project(project)
                .build();

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(1L)).thenReturn(List.of(oldSprint));
        when(taskRepository.findBySprintId(5L)).thenReturn(Collections.emptyList());
        when(aiAnalysisRepository.findByProjectId(1L)).thenReturn(Optional.empty());
        when(aiAnalysisRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(projectRepository.save(any())).thenReturn(project);

        aiAnalysisService.validateAndSave(1L, request);

        verify(sprintRepo).deleteAll(List.of(oldSprint));
    }

    @Test
    void validateAndSave_withSprintDTO_createsSprint() {
        AiAnalysisRequest.AiSprintDTO sprintDTO = new AiAnalysisRequest.AiSprintDTO();
        sprintDTO.setName("Sprint 1");
        sprintDTO.setGoal("Build auth module");
        sprintDTO.setStartDate("2025-05-01");
        sprintDTO.setEndDate("2025-05-14");

        request.setSprints(List.of(sprintDTO));

        Sprint savedSprint = Sprint.builder()
                .id(1L).title("Sprint 1")
                .status(SprintStatus.PLANNED)
                .project(project)
                .startDate(LocalDate.of(2025, 5, 1))
                .endDate(LocalDate.of(2025, 5, 14))
                .build();

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(1L)).thenReturn(Collections.emptyList());
        when(sprintRepo.save(any())).thenReturn(savedSprint);
        when(aiAnalysisRepository.findByProjectId(1L)).thenReturn(Optional.empty());
        when(aiAnalysisRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(projectRepository.save(any())).thenReturn(project);

        ApiResponse result = aiAnalysisService.validateAndSave(1L, request);

        assertThat(result).isNotNull();
        verify(sprintRepo).save(any(Sprint.class));
    }

    @Test
    void validateAndSave_withTaskDTO_createsTask() {
        AiAnalysisRequest.AiTaskDTO taskDTO = new AiAnalysisRequest.AiTaskDTO();
        taskDTO.setTitle("Setup CI/CD");
        taskDTO.setDescription("Configure pipeline");
        taskDTO.setPriority("HIGH");
        taskDTO.setSprint("Sprint 1"); // sprint name not in map → sprintId = null

        request.setTasks(List.of(taskDTO));

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(1L)).thenReturn(Collections.emptyList());
        when(taskRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(aiAnalysisRepository.findByProjectId(1L)).thenReturn(Optional.empty());
        when(aiAnalysisRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(projectRepository.save(any())).thenReturn(project);

        aiAnalysisService.validateAndSave(1L, request);

        verify(taskRepository).save(argThat(t ->
                t.getTitle().equals("Setup CI/CD") &&
                        t.getPriority() == TaskPriority.HIGH &&
                        t.getStatus() == TaskStatus.TODO
        ));
    }

    @Test
    void validateAndSave_withLowPriorityTask_mapsCorrectly() {
        AiAnalysisRequest.AiTaskDTO taskDTO = new AiAnalysisRequest.AiTaskDTO();
        taskDTO.setTitle("Write docs");
        taskDTO.setPriority("LOW");
        taskDTO.setSprint(null);

        request.setTasks(List.of(taskDTO));

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(1L)).thenReturn(Collections.emptyList());
        when(taskRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(aiAnalysisRepository.findByProjectId(1L)).thenReturn(Optional.empty());
        when(aiAnalysisRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(projectRepository.save(any())).thenReturn(project);

        aiAnalysisService.validateAndSave(1L, request);

        verify(taskRepository).save(argThat(t -> t.getPriority() == TaskPriority.LOW));
    }

    @Test
    void validateAndSave_withNullPriorityTask_defaultsMedium() {
        AiAnalysisRequest.AiTaskDTO taskDTO = new AiAnalysisRequest.AiTaskDTO();
        taskDTO.setTitle("Unknown priority task");
        taskDTO.setPriority(null);
        taskDTO.setSprint(null);

        request.setTasks(List.of(taskDTO));

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(1L)).thenReturn(Collections.emptyList());
        when(taskRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(aiAnalysisRepository.findByProjectId(1L)).thenReturn(Optional.empty());
        when(aiAnalysisRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(projectRepository.save(any())).thenReturn(project);

        aiAnalysisService.validateAndSave(1L, request);

        verify(taskRepository).save(argThat(t -> t.getPriority() == TaskPriority.MEDIUM));
    }

    @Test
    void validateAndSave_withTimelineAndBudget_updatesProject() throws Exception {
        Map<String, Object> timeline = Map.of(
                "startDate", "2025-06-01",
                "endDate", "2025-08-01"
        );
        Map<String, Object> cost = Map.of(
                "estimatedTotalCost", 120000
        );
        request.setTimeline(timeline);
        request.setCostEstimation(cost);

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(1L)).thenReturn(Collections.emptyList());
        when(aiAnalysisRepository.findByProjectId(1L)).thenReturn(Optional.empty());
        when(aiAnalysisRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(projectRepository.save(any())).thenReturn(project);

        aiAnalysisService.validateAndSave(1L, request);

        // project.save() called twice: once in validateAndSave for dates/budget
        verify(projectRepository, atLeastOnce()).save(any(Project.class));
    }

    @Test
    void validateAndSave_withInvalidBudgetString_doesNotThrow() throws Exception {
        Map<String, Object> cost = Map.of("estimatedTotalCost", "not-a-number");
        request.setCostEstimation(cost);

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(1L)).thenReturn(Collections.emptyList());
        when(aiAnalysisRepository.findByProjectId(1L)).thenReturn(Optional.empty());
        when(aiAnalysisRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(projectRepository.save(any())).thenReturn(project);

        // should not throw; budget parse failure is logged and swallowed
        ApiResponse result = aiAnalysisService.validateAndSave(1L, request);
        assertThat(result).isNotNull();
    }

    @Test
    void validateAndSave_sprintWithNullDates_fallsBackToCurrentDate() {
        AiAnalysisRequest.AiSprintDTO sprintDTO = new AiAnalysisRequest.AiSprintDTO();
        sprintDTO.setName("Sprint X");
        sprintDTO.setGoal("Goal");
        sprintDTO.setStartDate(null); // null → should default
        sprintDTO.setEndDate(null);   // null → startDate + 2 weeks

        request.setSprints(List.of(sprintDTO));

        Sprint savedSprint = Sprint.builder()
                .id(2L).title("Sprint X")
                .status(SprintStatus.PLANNED)
                .project(project)
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusWeeks(2))
                .build();

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(1L)).thenReturn(Collections.emptyList());
        when(sprintRepo.save(any())).thenReturn(savedSprint);
        when(aiAnalysisRepository.findByProjectId(1L)).thenReturn(Optional.empty());
        when(aiAnalysisRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(projectRepository.save(any())).thenReturn(project);

        ApiResponse result = aiAnalysisService.validateAndSave(1L, request);

        assertThat(result).isNotNull();
        verify(sprintRepo).save(any(Sprint.class));
    }

    @Test
    void validateAndSave_taskLinkedToSprintByName() {
        AiAnalysisRequest.AiSprintDTO sprintDTO = new AiAnalysisRequest.AiSprintDTO();
        sprintDTO.setName("Sprint 1");
        sprintDTO.setGoal("Goal");
        sprintDTO.setStartDate("2025-05-01");
        sprintDTO.setEndDate("2025-05-14");

        AiAnalysisRequest.AiTaskDTO taskDTO = new AiAnalysisRequest.AiTaskDTO();
        taskDTO.setTitle("Implement login");
        taskDTO.setPriority("MEDIUM");
        taskDTO.setSprint("Sprint 1"); // should link to sprint id

        request.setSprints(List.of(sprintDTO));
        request.setTasks(List.of(taskDTO));

        Sprint savedSprint = Sprint.builder()
                .id(7L).title("Sprint 1")
                .status(SprintStatus.PLANNED)
                .project(project)
                .startDate(LocalDate.of(2025, 5, 1))
                .endDate(LocalDate.of(2025, 5, 14))
                .build();

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(1L)).thenReturn(Collections.emptyList());
        when(sprintRepo.save(any())).thenReturn(savedSprint);
        when(taskRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(aiAnalysisRepository.findByProjectId(1L)).thenReturn(Optional.empty());
        when(aiAnalysisRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(projectRepository.save(any())).thenReturn(project);

        aiAnalysisService.validateAndSave(1L, request);

        verify(taskRepository).save(argThat(t -> Long.valueOf(7L).equals(t.getSprintId())));
    }

    @Test
    void validateAndSave_existingSprintsWithTasks_unlinkTasksBeforeDelete() {
        Sprint oldSprint = Sprint.builder()
                .id(3L).title("Old").status(SprintStatus.PLANNED).project(project).build();

        Task linkedTask = new Task();
        linkedTask.setId(100L);
        linkedTask.setTitle("Old task");
        linkedTask.setSprintId(3L);
        linkedTask.setPriority(TaskPriority.LOW);
        linkedTask.setStatus(TaskStatus.TODO);
        linkedTask.setProjectId(1L);

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(1L)).thenReturn(List.of(oldSprint));
        when(taskRepository.findBySprintId(3L)).thenReturn(List.of(linkedTask));
        when(taskRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(aiAnalysisRepository.findByProjectId(1L)).thenReturn(Optional.empty());
        when(aiAnalysisRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(projectRepository.save(any())).thenReturn(project);

        aiAnalysisService.validateAndSave(1L, request);

        // The task's sprintId should be set to null before sprint is deleted
        verify(taskRepository).save(argThat(t -> t.getSprintId() == null));
        verify(sprintRepo).deleteAll(List.of(oldSprint));
    }
}