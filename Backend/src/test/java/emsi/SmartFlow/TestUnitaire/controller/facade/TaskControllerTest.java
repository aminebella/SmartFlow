//package emsi.SmartFlow.TestUnitaire.controller.facade;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
//import emsi.SmartFlow.controller.dto.TaskRequest;
//import emsi.SmartFlow.controller.dto.TaskResponse;
//import emsi.SmartFlow.controller.facade.TaskController;
//import emsi.SmartFlow.entity.enums.TaskPriority;
//import emsi.SmartFlow.entity.enums.TaskStatus;
//import emsi.SmartFlow.service.facade.TaskService;
//import emsi.SmartFlow.user.User;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.http.MediaType;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.setup.MockMvcBuilders;
//
//import java.math.BigDecimal;
//import java.util.Collections;
//import java.util.List;
//
//import static org.mockito.ArgumentMatchers.*;
//import static org.mockito.Mockito.*;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@ExtendWith(MockitoExtension.class)
//class TaskControllerTest {
//
//    @Mock
//    private TaskService taskService;
//
//    @InjectMocks
//    private TaskController taskController;
//
//    private MockMvc mockMvc;
//    private ObjectMapper objectMapper;
//    private User mockUser;
//
//    private TaskResponse task1;
//    private TaskResponse task2;
//    private TaskRequest validRequest;
//
//    @BeforeEach
//    void setUp() {
//        mockMvc = MockMvcBuilders.standaloneSetup(taskController).build();
//        objectMapper = new ObjectMapper();
//        objectMapper.registerModule(new JavaTimeModule());
//
//        // Build a stub user
//        mockUser = mock(User.class);
//        when(mockUser.getId()).thenReturn(1L);
//
//        // Put it into SecurityContext so @AuthenticationPrincipal works
//        SecurityContextHolder.getContext().setAuthentication(
//                new UsernamePasswordAuthenticationToken(mockUser, null, Collections.emptyList())
//        );
//
//        task1 = TaskResponse.builder()
//                .id(1L).title("Task 1").priority(TaskPriority.HIGH)
//                .status(TaskStatus.TODO).projectId(10L).build();
//
//        task2 = TaskResponse.builder()
//                .id(2L).title("Task 2").priority(TaskPriority.LOW)
//                .status(TaskStatus.DONE).projectId(10L).build();
//
//        validRequest = TaskRequest.builder()
//                .title("New Task")
//                .priority(TaskPriority.MEDIUM)
//                .status(TaskStatus.TODO)
//                .projectId(10L)
//                .build();
//    }
//
//    // ── GET /tasks/project/{projectId} ───────────────────────────────
//
//    @Test
//    void getByProject_returnsTaskList() throws Exception {
//        when(taskService.getAllTasksByProject(10L)).thenReturn(List.of(task1, task2));
//
//        mockMvc.perform(get("/tasks/project/10"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data").isArray())
//                .andExpect(jsonPath("$.data[0].title").value("Task 1"))
//                .andExpect(jsonPath("$.data[1].title").value("Task 2"));
//    }
//
//    @Test
//    void getByProject_emptyProject_returnsEmptyList() throws Exception {
//        when(taskService.getAllTasksByProject(99L)).thenReturn(Collections.emptyList());
//
//        mockMvc.perform(get("/tasks/project/99"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data").isEmpty());
//    }
//
//    // ── GET /tasks/my-tasks ───────────────────────────────────────────
//
//    @Test
//    void getMyTasks_returnsCurrentUserTasks() throws Exception {
//        when(taskService.getMyTasks(any(User.class))).thenReturn(List.of(task1));
//
//        mockMvc.perform(get("/tasks/my-tasks"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data[0].id").value(1));
//    }
//
//    // ── GET /tasks/sprint/{sprintId} ──────────────────────────────────
//
//    @Test
//    void getBySprint_returnsSprintTasks() throws Exception {
//        when(taskService.getTasksBySprintForCurrentUser(eq(5L), any(User.class)))
//                .thenReturn(List.of(task2));
//
//        mockMvc.perform(get("/tasks/sprint/5"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data[0].status").value("DONE"));
//    }
//
//    // ── GET /tasks/project/{projectId}/status?status= ─────────────────
//
//    @Test
//    void getByStatus_filtersTasks() throws Exception {
//        when(taskService.getTasksByProjectAndStatusForCurrentUser(eq(10L), eq(TaskStatus.TODO), any(User.class)))
//                .thenReturn(List.of(task1));
//
//        mockMvc.perform(get("/tasks/project/10/status")
//                        .param("status", "TODO"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data[0].status").value("TODO"));
//    }
//
//    // ── GET /tasks/project/{projectId}/backlog ─────────────────────────
//
//    @Test
//    void getBacklog_returnsBacklogTasks() throws Exception {
//        when(taskService.getBacklogTasksForCurrentUser(eq(10L), any(User.class)))
//                .thenReturn(List.of(task1));
//
//        mockMvc.perform(get("/tasks/project/10/backlog"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data[0].title").value("Task 1"));
//    }
//
//    // ── GET /tasks/{id} ───────────────────────────────────────────────
//
//    @Test
//    void getTaskById_returnsTask() throws Exception {
//        when(taskService.getTaskById(1L)).thenReturn(task1);
//
//        mockMvc.perform(get("/tasks/1"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data.id").value(1))
//                .andExpect(jsonPath("$.data.title").value("Task 1"));
//    }
//
//    // ── GET /tasks/project/{projectId}/can-create ─────────────────────
//
//    @Test
//    void canCreateTask_returnsTrue_whenManager() throws Exception {
//        when(taskService.isManagerOfProject(eq(10L), any(User.class))).thenReturn(true);
//
//        mockMvc.perform(get("/tasks/project/10/can-create"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data").value(true))
//                .andExpect(jsonPath("$.message").value("User is manager"));
//    }
//
//    @Test
//    void canCreateTask_returnsFalse_whenNotManager() throws Exception {
//        when(taskService.isManagerOfProject(eq(10L), any(User.class))).thenReturn(false);
//
//        mockMvc.perform(get("/tasks/project/10/can-create"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data").value(false))
//                .andExpect(jsonPath("$.message").value("User is not manager"));
//    }
//
//    // ── POST /tasks ───────────────────────────────────────────────────
//
//    @Test
//    void createTask_returnsCreated() throws Exception {
//        when(taskService.createTask(any(TaskRequest.class), any(User.class))).thenReturn(task1);
//
//        mockMvc.perform(post("/tasks")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(validRequest)))
//                .andExpect(status().isCreated())
//                .andExpect(jsonPath("$.data.title").value("Task 1"))
//                .andExpect(jsonPath("$.message").value("Task created successfully"));
//    }
//
//    @Test
//    void createTask_missingTitle_returnsBadRequest() throws Exception {
//        TaskRequest bad = TaskRequest.builder()
//                .priority(TaskPriority.HIGH)
//                .status(TaskStatus.TODO)
//                .projectId(10L)
//                .build(); // title = null
//
//        mockMvc.perform(post("/tasks")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(bad)))
//                .andExpect(status().isBadRequest());
//
//        verifyNoInteractions(taskService);
//    }
//
//    @Test
//    void createTask_missingProjectId_returnsBadRequest() throws Exception {
//        TaskRequest bad = TaskRequest.builder()
//                .title("Task")
//                .priority(TaskPriority.HIGH)
//                .status(TaskStatus.TODO)
//                // projectId = null
//                .build();
//
//        mockMvc.perform(post("/tasks")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(bad)))
//                .andExpect(status().isBadRequest());
//    }
//
//    // ── PUT /tasks/{id} ───────────────────────────────────────────────
//
//    @Test
//    void updateTask_returnsUpdated() throws Exception {
//        TaskResponse updated = TaskResponse.builder()
//                .id(1L).title("Updated").priority(TaskPriority.HIGH)
//                .status(TaskStatus.IN_PROGRESS).projectId(10L).build();
//
//        when(taskService.updateTask(eq(1L), any(TaskRequest.class), any(User.class))).thenReturn(updated);
//
//        mockMvc.perform(put("/tasks/1")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(validRequest)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data.title").value("Updated"))
//                .andExpect(jsonPath("$.message").value("Task updated successfully"));
//    }
//
//    // ── DELETE /tasks/{id} ────────────────────────────────────────────
//
//    @Test
//    void deleteTask_returnsOk() throws Exception {
//        doNothing().when(taskService).deleteTask(eq(1L), any(User.class));
//
//        mockMvc.perform(delete("/tasks/1"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.message").value("Task deleted successfully"));
//
//        verify(taskService).deleteTask(eq(1L), any(User.class));
//    }
//
//    // ── PATCH /tasks/{id}/status ──────────────────────────────────────
//
//    @Test
//    void updateStatus_updatesAndReturns() throws Exception {
//        TaskResponse inProgress = TaskResponse.builder()
//                .id(1L).title("Task 1").status(TaskStatus.IN_PROGRESS).projectId(10L)
//                .priority(TaskPriority.HIGH).build();
//
//        when(taskService.updateTaskStatus(eq(1L), eq(TaskStatus.IN_PROGRESS), any(User.class)))
//                .thenReturn(inProgress);
//
//        mockMvc.perform(patch("/tasks/1/status")
//                        .param("status", "IN_PROGRESS"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data.status").value("IN_PROGRESS"))
//                .andExpect(jsonPath("$.message").value("Status updated"));
//    }
//
//    @Test
//    void updateStatus_toDone() throws Exception {
//        TaskResponse done = TaskResponse.builder()
//                .id(2L).title("Task 2").status(TaskStatus.DONE).projectId(10L)
//                .priority(TaskPriority.LOW).build();
//
//        when(taskService.updateTaskStatus(eq(2L), eq(TaskStatus.DONE), any(User.class))).thenReturn(done);
//
//        mockMvc.perform(patch("/tasks/2/status").param("status", "DONE"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data.status").value("DONE"));
//    }
//
//    // ── PATCH /tasks/{id}/assign ──────────────────────────────────────
//
//    @Test
//    void assignTask_assignsUser() throws Exception {
//        TaskResponse assigned = TaskResponse.builder()
//                .id(1L).title("Task 1").assignedUserId(5L).projectId(10L)
//                .priority(TaskPriority.HIGH).status(TaskStatus.TODO).build();
//
//        when(taskService.assignTask(eq(1L), eq(5L), any(User.class))).thenReturn(assigned);
//
//        mockMvc.perform(patch("/tasks/1/assign").param("userId", "5"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data.assignedUserId").value(5))
//                .andExpect(jsonPath("$.message").value("Task assigned"));
//    }
//
//    // ── PATCH /tasks/{id}/move-to-sprint ─────────────────────────────
//
//    @Test
//    void moveToSprint_movesTask() throws Exception {
//        TaskResponse moved = TaskResponse.builder()
//                .id(1L).title("Task 1").sprintId(7L).projectId(10L)
//                .priority(TaskPriority.HIGH).status(TaskStatus.TODO).build();
//
//        when(taskService.moveTaskToSprint(eq(1L), eq(7L), any(User.class))).thenReturn(moved);
//
//        mockMvc.perform(patch("/tasks/1/move-to-sprint").param("sprintId", "7"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data.sprintId").value(7))
//                .andExpect(jsonPath("$.message").value("Task moved to sprint"));
//    }
//
//    @Test
//    void moveToSprint_withNullSprintId_movesToBacklog() throws Exception {
//        TaskResponse backlog = TaskResponse.builder()
//                .id(1L).title("Task 1").sprintId(null).projectId(10L)
//                .priority(TaskPriority.HIGH).status(TaskStatus.TODO).build();
//
//        when(taskService.moveTaskToSprint(eq(1L), isNull(), any(User.class))).thenReturn(backlog);
//
//        // sprintId is optional (required=false)
//        mockMvc.perform(patch("/tasks/1/move-to-sprint"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.message").value("Task moved to sprint"));
//    }
//}