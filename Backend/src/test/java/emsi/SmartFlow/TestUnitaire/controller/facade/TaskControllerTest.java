package emsi.SmartFlow.TestUnitaire.controller.facade;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import emsi.SmartFlow.controller.dto.TaskRequest;
import emsi.SmartFlow.controller.dto.TaskResponse;
import emsi.SmartFlow.controller.facade.TaskController;
import emsi.SmartFlow.entity.enums.TaskPriority;
import emsi.SmartFlow.entity.enums.TaskStatus;
import emsi.SmartFlow.service.facade.TaskService;
import emsi.SmartFlow.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class TaskControllerTest {

    @Mock
    private TaskService taskService;

    @InjectMocks
    private TaskController taskController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    // mockUser is passed directly as principal — NOT via SecurityContext
    private User mockUser;

    private TaskResponse task1;
    private TaskResponse task2;
    private TaskRequest validRequest;

    @BeforeEach
    void setUp() {
        // ✅ No stubbing of mockUser.getId() here — only stub in tests that need it
        mockUser = mock(User.class);

        // ✅ Register the controller with a custom argument resolver so
        //    @AuthenticationPrincipal resolves to mockUser
        mockMvc = MockMvcBuilders
                .standaloneSetup(taskController)
                .setCustomArgumentResolvers(
                        new org.springframework.security.web.method.annotation
                                .AuthenticationPrincipalArgumentResolver()
                )
                .build();

        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        task1 = TaskResponse.builder()
                .id(1L).title("Task 1").priority(TaskPriority.HIGH)
                .status(TaskStatus.TODO).projectId(10L).build();

        task2 = TaskResponse.builder()
                .id(2L).title("Task 2").priority(TaskPriority.LOW)
                .status(TaskStatus.DONE).projectId(10L).build();

        validRequest = TaskRequest.builder()
                .title("New Task")
                .priority(TaskPriority.MEDIUM)
                .status(TaskStatus.TODO)
                .projectId(10L)
                .build();
    }

    // ── Helper: set authenticated user in SecurityContext ─────────────
    private void setAuthUser(User user) {
        var auth = new org.springframework.security.authentication
                .UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
        org.springframework.security.core.context.SecurityContextHolder
                .getContext().setAuthentication(auth);
    }

    // ── GET /tasks/project/{projectId} ────────────────────────────────

    @Test
    void getByProject_returnsTaskList() throws Exception {
        when(taskService.getAllTasksByProject(10L)).thenReturn(List.of(task1, task2));

        mockMvc.perform(get("/tasks/project/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].title").value("Task 1"))
                .andExpect(jsonPath("$.data[1].title").value("Task 2"));
    }

    @Test
    void getByProject_emptyProject_returnsEmptyList() throws Exception {
        when(taskService.getAllTasksByProject(99L)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/tasks/project/99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isEmpty());
    }

    // ── GET /tasks/my-tasks ───────────────────────────────────────────
    // @AuthenticationPrincipal needs SecurityContext set

    @Test
    void getMyTasks_returnsCurrentUserTasks() throws Exception {
        setAuthUser(mockUser);
        when(taskService.getMyTasks(mockUser)).thenReturn(List.of(task1));

        mockMvc.perform(get("/tasks/my-tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value(1));
    }

    // ── GET /tasks/sprint/{sprintId} ──────────────────────────────────

    @Test
    void getBySprint_returnsSprintTasks() throws Exception {
        setAuthUser(mockUser);
        when(taskService.getTasksBySprintForCurrentUser(5L, mockUser)).thenReturn(List.of(task2));

        mockMvc.perform(get("/tasks/sprint/5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].status").value("DONE"));
    }

    // ── GET /tasks/project/{projectId}/status?status= ─────────────────

    @Test
    void getByStatus_filtersTasks() throws Exception {
        setAuthUser(mockUser);
        when(taskService.getTasksByProjectAndStatusForCurrentUser(10L, TaskStatus.TODO, mockUser))
                .thenReturn(List.of(task1));

        mockMvc.perform(get("/tasks/project/10/status").param("status", "TODO"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].status").value("TODO"));
    }

    // ── GET /tasks/project/{projectId}/backlog ─────────────────────────

    @Test
    void getBacklog_returnsBacklogTasks() throws Exception {
        setAuthUser(mockUser);
        when(taskService.getBacklogTasksForCurrentUser(10L, mockUser)).thenReturn(List.of(task1));

        mockMvc.perform(get("/tasks/project/10/backlog"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].title").value("Task 1"));
    }

    // ── GET /tasks/{id} ───────────────────────────────────────────────

    @Test
    void getTaskById_returnsTask() throws Exception {
        when(taskService.getTaskById(1L)).thenReturn(task1);

        mockMvc.perform(get("/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.title").value("Task 1"));
    }

    // ── GET /tasks/project/{projectId}/can-create ─────────────────────

    @Test
    void canCreateTask_returnsTrue_whenManager() throws Exception {
        setAuthUser(mockUser);
        when(taskService.isManagerOfProject(10L, mockUser)).thenReturn(true);

        mockMvc.perform(get("/tasks/project/10/can-create"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").value(true))
                .andExpect(jsonPath("$.message").value("User is manager"));
    }

    @Test
    void canCreateTask_returnsFalse_whenNotManager() throws Exception {
        setAuthUser(mockUser);
        when(taskService.isManagerOfProject(10L, mockUser)).thenReturn(false);

        mockMvc.perform(get("/tasks/project/10/can-create"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").value(false))
                .andExpect(jsonPath("$.message").value("User is not manager"));
    }

    // ── POST /tasks ───────────────────────────────────────────────────

    @Test
    void createTask_returnsCreated() throws Exception {
        setAuthUser(mockUser);
        when(taskService.createTask(any(TaskRequest.class), eq(mockUser))).thenReturn(task1);

        mockMvc.perform(post("/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.title").value("Task 1"))
                .andExpect(jsonPath("$.message").value("Task created successfully"));
    }

    // ── Note on @Valid + standaloneSetup ──────────────────────────────
    // standaloneSetup does NOT enable Bean Validation by default.
    // To test @Valid, we need to add a validator to the MockMvc setup.
    // The two tests below use a separate MockMvc with validation enabled.

    @Test
    void createTask_missingTitle_returnsBadRequest() throws Exception {
        MockMvc validatingMvc = MockMvcBuilders
                .standaloneSetup(taskController)
                .setValidator(new org.springframework.validation.beanvalidation.LocalValidatorFactoryBean())
                .setCustomArgumentResolvers(
                        new org.springframework.security.web.method.annotation
                                .AuthenticationPrincipalArgumentResolver()
                )
                .build();

        setAuthUser(mockUser);
        TaskRequest bad = TaskRequest.builder()
                .priority(TaskPriority.HIGH)
                .status(TaskStatus.TODO)
                .projectId(10L)
                .build();

        validatingMvc.perform(post("/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bad)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createTask_missingProjectId_returnsBadRequest() throws Exception {
        MockMvc validatingMvc = MockMvcBuilders
                .standaloneSetup(taskController)
                .setValidator(new org.springframework.validation.beanvalidation.LocalValidatorFactoryBean())
                .setCustomArgumentResolvers(
                        new org.springframework.security.web.method.annotation
                                .AuthenticationPrincipalArgumentResolver()
                )
                .build();

        setAuthUser(mockUser);
        TaskRequest bad = TaskRequest.builder()
                .title("Task")
                .priority(TaskPriority.HIGH)
                .status(TaskStatus.TODO)
                .build();

        validatingMvc.perform(post("/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bad)))
                .andExpect(status().isBadRequest());
    }

    // ── PUT /tasks/{id} ───────────────────────────────────────────────

    @Test
    void updateTask_returnsUpdated() throws Exception {
        setAuthUser(mockUser);
        TaskResponse updated = TaskResponse.builder()
                .id(1L).title("Updated").priority(TaskPriority.HIGH)
                .status(TaskStatus.IN_PROGRESS).projectId(10L).build();

        when(taskService.updateTask(eq(1L), any(TaskRequest.class), eq(mockUser))).thenReturn(updated);

        mockMvc.perform(put("/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("Updated"))
                .andExpect(jsonPath("$.message").value("Task updated successfully"));
    }

    // ── DELETE /tasks/{id} ────────────────────────────────────────────

    @Test
    void deleteTask_returnsOk() throws Exception {
        setAuthUser(mockUser);
        doNothing().when(taskService).deleteTask(eq(1L), eq(mockUser));

        mockMvc.perform(delete("/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Task deleted successfully"));

        verify(taskService).deleteTask(eq(1L), eq(mockUser));
    }

    // ── PATCH /tasks/{id}/status ──────────────────────────────────────

    @Test
    void updateStatus_updatesAndReturns() throws Exception {
        setAuthUser(mockUser);
        TaskResponse inProgress = TaskResponse.builder()
                .id(1L).title("Task 1").status(TaskStatus.IN_PROGRESS)
                .projectId(10L).priority(TaskPriority.HIGH).build();

        when(taskService.updateTaskStatus(eq(1L), eq(TaskStatus.IN_PROGRESS), eq(mockUser)))
                .thenReturn(inProgress);

        mockMvc.perform(patch("/tasks/1/status").param("status", "IN_PROGRESS"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("IN_PROGRESS"))
                .andExpect(jsonPath("$.message").value("Status updated"));
    }

    @Test
    void updateStatus_toDone() throws Exception {
        setAuthUser(mockUser);
        TaskResponse done = TaskResponse.builder()
                .id(2L).title("Task 2").status(TaskStatus.DONE)
                .projectId(10L).priority(TaskPriority.LOW).build();

        when(taskService.updateTaskStatus(eq(2L), eq(TaskStatus.DONE), eq(mockUser))).thenReturn(done);

        mockMvc.perform(patch("/tasks/2/status").param("status", "DONE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("DONE"));
    }

    // ── PATCH /tasks/{id}/assign ──────────────────────────────────────

    @Test
    void assignTask_assignsUser() throws Exception {
        setAuthUser(mockUser);
        TaskResponse assigned = TaskResponse.builder()
                .id(1L).title("Task 1").assignedUserId(5L).projectId(10L)
                .priority(TaskPriority.HIGH).status(TaskStatus.TODO).build();

        when(taskService.assignTask(eq(1L), eq(5L), eq(mockUser))).thenReturn(assigned);

        mockMvc.perform(patch("/tasks/1/assign").param("userId", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.assignedUserId").value(5))
                .andExpect(jsonPath("$.message").value("Task assigned"));
    }

    // ── PATCH /tasks/{id}/move-to-sprint ─────────────────────────────

    @Test
    void moveToSprint_movesTask() throws Exception {
        setAuthUser(mockUser);
        TaskResponse moved = TaskResponse.builder()
                .id(1L).title("Task 1").sprintId(7L).projectId(10L)
                .priority(TaskPriority.HIGH).status(TaskStatus.TODO).build();

        when(taskService.moveTaskToSprint(eq(1L), eq(7L), eq(mockUser))).thenReturn(moved);

        mockMvc.perform(patch("/tasks/1/move-to-sprint").param("sprintId", "7"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.sprintId").value(7))
                .andExpect(jsonPath("$.message").value("Task moved to sprint"));
    }

    @Test
    void moveToSprint_withNullSprintId_movesToBacklog() throws Exception {
        setAuthUser(mockUser);
        TaskResponse backlog = TaskResponse.builder()
                .id(1L).title("Task 1").sprintId(null).projectId(10L)
                .priority(TaskPriority.HIGH).status(TaskStatus.TODO).build();

        when(taskService.moveTaskToSprint(eq(1L), isNull(), eq(mockUser))).thenReturn(backlog);

        mockMvc.perform(patch("/tasks/1/move-to-sprint"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Task moved to sprint"));
    }
}