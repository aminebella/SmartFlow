package emsi.SmartFlow.TestUnitaire.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import emsi.SmartFlow.controller.dto.AiAnalysisRequest;
import emsi.SmartFlow.controller.dto.AiAnalysisResponse;
import emsi.SmartFlow.controller.dto.ApiResponse;
import emsi.SmartFlow.entity.AiAnalysis;
import emsi.SmartFlow.entity.Project;
import emsi.SmartFlow.entity.Sprint;
import emsi.SmartFlow.entity.Task;
import emsi.SmartFlow.entity.enums.TaskPriority;
import emsi.SmartFlow.entity.enums.TaskStatus;
import emsi.SmartFlow.repo.*;
import emsi.SmartFlow.service.impl.AiAnalysisServiceImpl;
import emsi.SmartFlow.service.impl.GeminiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AiAnalysisServiceImplTest {

    @Mock
    private AiAnalysisRepository aiAnalysisRepository;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private GeminiService geminiService;

    @Mock
    private SprintRepo sprintRepo;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private AiAnalysisServiceImpl aiAnalysisService;

    private Project project;
    private AiAnalysis savedAnalysis;
    private AiAnalysisRequest request;

    @BeforeEach
    void setUp() {
        project = new Project();
        project.setId(1L);
        project.setName("TestProject");

        // AiAnalysis uses @Builder
        savedAnalysis = AiAnalysis.builder()
                .id(10L)
                .projectId(1L)
                .projectSummary("Test summary")
                .confidenceScore("HIGH")
                .documentQuality("HIGH")
                .build();

        // AiAnalysisRequest uses @Data (standard setters)
        request = new AiAnalysisRequest();
        request.setProjectSummary("Test summary");
        request.setConfidenceScore("HIGH");
        request.setDocumentQuality("HIGH");
        request.setTasks(List.of());
        request.setSprints(List.of());
        request.setRisks(List.of());
        request.setHumanResources(List.of());
        request.setMaterialResources(List.of());
    }

    // ── getAnalysis ───────────────────────────────────────────────────

//    @Test
//    void getAnalysis_shouldReturnResponseWhenAnalysisExists() throws Exception {
//        when(aiAnalysisRepository.findByProjectId(1L)).thenReturn(Optional.of(savedAnalysis));
//        // fromJson(null) is called for null JSON fields
//        when(objectMapper.readValue((String) isNull(), eq(Object.class))).thenReturn(null);
//
//        AiAnalysisResponse result = aiAnalysisService.getAnalysis(1L);
//
//        assertNotNull(result);
//        assertEquals(10L, result.getId());
//        assertEquals(1L, result.getProjectId());
//        assertEquals("HIGH", result.getConfidenceScore());
//        assertEquals("Test summary", result.getProjectSummary());
//    }

    @Test
    void getAnalysis_shouldThrowRuntimeExceptionWhenNotFound() {
        when(aiAnalysisRepository.findByProjectId(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> aiAnalysisService.getAnalysis(99L));

        assertTrue(ex.getMessage().contains("Aucune analyse pour ce projet"));
    }

    // ── saveAnalysis ──────────────────────────────────────────────────

//    @Test
//    void saveAnalysis_shouldCreateNewAnalysisWhenNoneExists() throws Exception {
//        when(aiAnalysisRepository.findByProjectId(1L)).thenReturn(Optional.empty());
//        when(objectMapper.writeValueAsString(any())).thenReturn("[]");
//        when(aiAnalysisRepository.save(any(AiAnalysis.class))).thenReturn(savedAnalysis);
//        when(objectMapper.readValue((String) isNull(), eq(Object.class))).thenReturn(null);
//
//        AiAnalysisResponse result = aiAnalysisService.saveAnalysis(1L, request);
//
//        assertNotNull(result);
//        // Capture the argument saved to verify a NEW analysis was created
//        ArgumentCaptor<AiAnalysis> captor = ArgumentCaptor.forClass(AiAnalysis.class);
//        verify(aiAnalysisRepository).save(captor.capture());
//        assertEquals(1L, captor.getValue().getProjectId());
//        assertEquals("Test summary", captor.getValue().getProjectSummary());
//    }

    @Test
    void saveAnalysis_shouldUpdateExistingAnalysisWhenOneExists() throws Exception {
        when(aiAnalysisRepository.findByProjectId(1L)).thenReturn(Optional.of(savedAnalysis));
        when(objectMapper.writeValueAsString(any())).thenReturn("[]");
        when(aiAnalysisRepository.save(savedAnalysis)).thenReturn(savedAnalysis);
        when(objectMapper.readValue((String) isNull(), eq(Object.class))).thenReturn(null);

        aiAnalysisService.saveAnalysis(1L, request);

        // Should save the SAME existing object (not a new one)
        verify(aiAnalysisRepository).save(savedAnalysis);
        assertEquals("Test summary", savedAnalysis.getProjectSummary());
        assertEquals("HIGH", savedAnalysis.getConfidenceScore());
    }

    // ── validateAndSave ───────────────────────────────────────────────

    @Test
    void validateAndSave_shouldThrowWhenProjectNotFound() {
        when(projectRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> aiAnalysisService.validateAndSave(99L, request));

        assertTrue(ex.getMessage().contains("99"));
    }

//    @Test
//    void validateAndSave_shouldDeleteExistingSprintsBeforeCreating() throws Exception {
//        Sprint oldSprint = new Sprint();
//        oldSprint.setId(50L);
//
//        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
//        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(1L)).thenReturn(List.of(oldSprint));
//        when(taskRepository.findBySprintId(50L)).thenReturn(List.of());
//        stubSaveAnalysis();
//        when(projectRepository.save(any())).thenReturn(project);
//
//        aiAnalysisService.validateAndSave(1L, request);
//
//        verify(sprintRepo).deleteAll(List.of(oldSprint));
//    }

//    @Test
//    void validateAndSave_shouldUnlinkTasksFromSprintBeforeDeleting() throws Exception {
//        Sprint oldSprint = new Sprint();
//        oldSprint.setId(50L);
//
//        Task linkedTask = new Task();
//        linkedTask.setId(200L);
//        linkedTask.setSprintId(50L);
//        linkedTask.setTitle("Linked task");
//        linkedTask.setStatus(TaskStatus.TODO);
//        linkedTask.setPriority(TaskPriority.MEDIUM);
//        linkedTask.setProjectId(1L);
//
//        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
//        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(1L)).thenReturn(List.of(oldSprint));
//        when(taskRepository.findBySprintId(50L)).thenReturn(List.of(linkedTask));
//        when(taskRepository.save(linkedTask)).thenReturn(linkedTask);
//        stubSaveAnalysis();
//        when(projectRepository.save(any())).thenReturn(project);
//
//        aiAnalysisService.validateAndSave(1L, request);
//
//        // Task sprintId should be set to null before sprint deletion
//        assertNull(linkedTask.getSprintId());
//        verify(taskRepository).save(linkedTask);
//    }

//    @Test
//    void validateAndSave_shouldCreateSprintsFromRequest() throws Exception {
//        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
//        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(1L)).thenReturn(List.of());
//
//        AiAnalysisRequest.AiSprintDTO sprintDTO = new AiAnalysisRequest.AiSprintDTO();
//        sprintDTO.setName("Sprint 1");
//        sprintDTO.setGoal("Set up the project");
//        sprintDTO.setStartDate(LocalDate.now().toString());
//        sprintDTO.setEndDate(LocalDate.now().plusWeeks(2).toString());
//        request.setSprints(List.of(sprintDTO));
//
//        Sprint savedSprint = new Sprint();
//        savedSprint.setId(100L);
//        savedSprint.setTitle("Sprint 1");
//        when(sprintRepo.save(any(Sprint.class))).thenReturn(savedSprint);
//
//        stubSaveAnalysis();
//        when(projectRepository.save(any())).thenReturn(project);
//
//        aiAnalysisService.validateAndSave(1L, request);
//
//        ArgumentCaptor<Sprint> sprintCaptor = ArgumentCaptor.forClass(Sprint.class);
//        verify(sprintRepo).save(sprintCaptor.capture());
//        assertEquals("Sprint 1", sprintCaptor.getValue().getTitle());
//        assertEquals("Set up the project", sprintCaptor.getValue().getGoal());
//    }

//    @Test
//    void validateAndSave_shouldCreateTasksFromRequest() throws Exception {
//        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
//        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(1L)).thenReturn(List.of());
//
//        AiAnalysisRequest.AiTaskDTO taskDTO = new AiAnalysisRequest.AiTaskDTO();
//        taskDTO.setTitle("Setup environment");
//        taskDTO.setDescription("Install and configure all tools");
//        taskDTO.setPriority("HIGH");
//        taskDTO.setSprint("Sprint 1"); // no matching sprint → sprintId will be null
//        request.setTasks(List.of(taskDTO));
//
//        when(taskRepository.save(any(Task.class))).thenReturn(new Task());
//        stubSaveAnalysis();
//        when(projectRepository.save(any())).thenReturn(project);
//
//        aiAnalysisService.validateAndSave(1L, request);
//
//        ArgumentCaptor<Task> taskCaptor = ArgumentCaptor.forClass(Task.class);
//        verify(taskRepository).save(taskCaptor.capture());
//        assertEquals("Setup environment", taskCaptor.getValue().getTitle());
//        assertEquals(TaskPriority.HIGH, taskCaptor.getValue().getPriority());
//        assertEquals(TaskStatus.TODO, taskCaptor.getValue().getStatus());
//        assertEquals(1L, taskCaptor.getValue().getProjectId());
//    }

//    @Test
//    void validateAndSave_shouldMapNullPriorityToMedium() throws Exception {
//        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
//        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(1L)).thenReturn(List.of());
//
//        AiAnalysisRequest.AiTaskDTO taskDTO = new AiAnalysisRequest.AiTaskDTO();
//        taskDTO.setTitle("Task with no priority");
//        taskDTO.setPriority(null); // should default to MEDIUM
//        request.setTasks(List.of(taskDTO));
//
//        when(taskRepository.save(any(Task.class))).thenReturn(new Task());
//        stubSaveAnalysis();
//        when(projectRepository.save(any())).thenReturn(project);
//
//        aiAnalysisService.validateAndSave(1L, request);
//
//        ArgumentCaptor<Task> captor = ArgumentCaptor.forClass(Task.class);
//        verify(taskRepository).save(captor.capture());
//        assertEquals(TaskPriority.MEDIUM, captor.getValue().getPriority());
//    }

//    @Test
//    void validateAndSave_shouldMapLowPriorityCorrectly() throws Exception {
//        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
//        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(1L)).thenReturn(List.of());
//
//        AiAnalysisRequest.AiTaskDTO taskDTO = new AiAnalysisRequest.AiTaskDTO();
//        taskDTO.setTitle("Low priority task");
//        taskDTO.setPriority("LOW");
//        request.setTasks(List.of(taskDTO));
//
//        when(taskRepository.save(any(Task.class))).thenReturn(new Task());
//        stubSaveAnalysis();
//        when(projectRepository.save(any())).thenReturn(project);
//
//        aiAnalysisService.validateAndSave(1L, request);
//
//        ArgumentCaptor<Task> captor = ArgumentCaptor.forClass(Task.class);
//        verify(taskRepository).save(captor.capture());
//        assertEquals(TaskPriority.LOW, captor.getValue().getPriority());
//    }

//    @Test
//    void validateAndSave_shouldReturnSuccessApiResponse() throws Exception {
//        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
//        when(sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(1L)).thenReturn(List.of());
//        stubSaveAnalysis();
//        when(projectRepository.save(any())).thenReturn(project);
//
//        // ApiResponse uses @Builder
//        ApiResponse<?> result = aiAnalysisService.validateAndSave(1L, request);
//
//        assertNotNull(result);
//        assertNotNull(result.getMessage());
//        assertTrue(result.getMessage().contains("succès"));
//    }

    // ── Helper ────────────────────────────────────────────────────────

    /**
     * Stubs the internal saveAnalysis call that validateAndSave always makes.
     * objectMapper.writeValueAsString() is called per field.
     */
    private void stubSaveAnalysis() throws Exception {
        when(aiAnalysisRepository.findByProjectId(1L)).thenReturn(Optional.empty());
        when(objectMapper.writeValueAsString(any())).thenReturn("[]");
        when(aiAnalysisRepository.save(any(AiAnalysis.class))).thenReturn(savedAnalysis);
        when(objectMapper.readValue((String) isNull(), eq(Object.class))).thenReturn(null);
    }
}