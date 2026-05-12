package emsi.SmartFlow.TestUnitaire.service;


import emsi.SmartFlow.controller.dto.TaskRequest;
import emsi.SmartFlow.controller.dto.TaskResponse;
import emsi.SmartFlow.entity.Task;
import emsi.SmartFlow.entity.enums.TaskPriority;
import emsi.SmartFlow.entity.enums.TaskStatus;
import jakarta.persistence.EntityNotFoundException;
import emsi.SmartFlow.repo.TaskRepository;
import emsi.SmartFlow.user.UserRepository;
import emsi.SmartFlow.repo.ProjectTeamRepository;
import emsi.SmartFlow.service.NotificationService;
import emsi.SmartFlow.service.impl.TaskServiceImpl;
import emsi.SmartFlow.user.User;
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
class TaskServiceImplTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProjectTeamRepository projectTeamRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private TaskServiceImpl taskService;

    private Task task;
    private TaskRequest request;
    private User user;

    @BeforeEach
    void setUp() {
        user = new User();

        task = Task.builder()
                .id(1L)
                .title("Task 1")
                .status(TaskStatus.TODO)
                .projectId(1L)
                .build();

        request = TaskRequest.builder()
                .title("Task 1")
                .priority(TaskPriority.MEDIUM)
                .status(TaskStatus.TODO)
                .projectId(1L)
                .build();
    }

    // ───────────── CREATE ─────────────
    @Test
    void create_shouldWork() {
        when(taskRepository.save(any(Task.class))).thenReturn(task);
        when(projectTeamRepository.findRoleByProjectIdAndUserId(any(), any()))
                .thenReturn(java.util.Optional.of(emsi.SmartFlow.entity.enums.ProjectTeamRole.MANAGER));

        TaskResponse res = taskService.createTask(request, user);

        assertThat(res.getTitle()).isEqualTo("Task 1");
    }

    // ───────────── GET OK ─────────────
    @Test
    void getById_shouldReturn() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        TaskResponse res = taskService.getTaskById(1L);

        assertThat(res.getId()).isEqualTo(1L);
    }

    // ───────────── GET NOT FOUND ─────────────
    @Test
    void getById_shouldThrow() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.getTaskById(99L))
                .isInstanceOf(EntityNotFoundException.class);
    }

    // ───────────── DELETE OK ─────────────
    @Test
    void delete_shouldWork() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(projectTeamRepository.findRoleByProjectIdAndUserId(any(), any()))
                .thenReturn(java.util.Optional.of(emsi.SmartFlow.entity.enums.ProjectTeamRole.MANAGER));

        taskService.deleteTask(1L, user);

        verify(taskRepository).delete(task);
    }

    // ───────────── DELETE NOT FOUND ─────────────
    @Test
    void delete_shouldThrow() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.deleteTask(99L, user))
                .isInstanceOf(EntityNotFoundException.class);
    }

    // ───────────── LIST ─────────────
    @Test
    void list_shouldReturn() {
        when(taskRepository.findByProjectId(1L)).thenReturn(List.of(task));

        List<TaskResponse> list = taskService.getAllTasksByProject(1L);

        assertThat(list).hasSize(1);
    }
}