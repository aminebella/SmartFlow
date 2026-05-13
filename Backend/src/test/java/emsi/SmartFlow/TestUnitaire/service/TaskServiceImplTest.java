package emsi.SmartFlow.TestUnitaire.service;

import emsi.SmartFlow.controller.dto.TaskRequest;
import emsi.SmartFlow.controller.dto.TaskResponse;
import emsi.SmartFlow.entity.Task;
import emsi.SmartFlow.entity.enums.ProjectTeamRole;
import emsi.SmartFlow.entity.enums.TaskPriority;
import emsi.SmartFlow.entity.enums.TaskStatus;
import emsi.SmartFlow.repo.ProjectTeamRepository;
import emsi.SmartFlow.repo.TaskRepository;
import emsi.SmartFlow.service.NotificationService;
import emsi.SmartFlow.service.impl.TaskServiceImpl;
import emsi.SmartFlow.user.User;
import emsi.SmartFlow.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceImplTest {

    @Mock private TaskRepository        taskRepository;
    @Mock private UserRepository        userRepository;
    @Mock private ProjectTeamRepository projectTeamRepository;
    @Mock private NotificationService   notificationService;

    @InjectMocks
    private TaskServiceImpl taskService;

    private User manager;
    private User member;
    private Task task;
    private TaskRequest request;

    @BeforeEach
    void setUp() {
        manager = new User();
        manager.setId(1L);

        member = new User();
        member.setId(2L);

        task = Task.builder()
                .id(1L)
                .title("Task 1")
                .status(TaskStatus.TODO)
                .projectId(10L)
                .assignedUser(member)
                .build();

        request = TaskRequest.builder()
                .title("Task 1")
                .priority(TaskPriority.MEDIUM)
                .status(TaskStatus.TODO)
                .projectId(10L)
                .build();
    }

    // helper — mock current user as MANAGER
    private void mockAsManager(User user) {
        when(projectTeamRepository.findRoleByProjectIdAndUserId(any(), eq(user.getId())))
                .thenReturn(Optional.of(ProjectTeamRole.MANAGER));
    }

    // helper — mock current user as MEMBER
    private void mockAsMember(User user) {
        when(projectTeamRepository.findRoleByProjectIdAndUserId(any(), eq(user.getId())))
                .thenReturn(Optional.of(ProjectTeamRole.MEMBER));
    }

    // ═══════════════════════════════════════════════════════════
    //  isManagerOfProject
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("isManagerOfProject()")
    class IsManagerTests {

        @Test
        void returnsTrue_whenUserIsManager() {
            mockAsManager(manager);
            assertThat(taskService.isManagerOfProject(10L, manager)).isTrue();
        }

        @Test
        void returnsFalse_whenUserIsMember() {
            mockAsMember(member);
            assertThat(taskService.isManagerOfProject(10L, member)).isFalse();
        }

        @Test
        void returnsFalse_whenUserNotInProject() {
            when(projectTeamRepository.findRoleByProjectIdAndUserId(any(), any()))
                    .thenReturn(Optional.empty());
            assertThat(taskService.isManagerOfProject(10L, manager)).isFalse();
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  getAllTasksByProject
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("getAllTasksByProject()")
    class GetAllTasksByProjectTests {

        @Test
        void returnsAllTasks() {
            when(taskRepository.findByProjectId(10L)).thenReturn(List.of(task));
            List<TaskResponse> result = taskService.getAllTasksByProject(10L);
            assertThat(result).hasSize(1);
            assertThat(result.get(0).getTitle()).isEqualTo("Task 1");
        }

        @Test
        void returnsEmptyList_whenNoTasks() {
            when(taskRepository.findByProjectId(10L)).thenReturn(List.of());
            assertThat(taskService.getAllTasksByProject(10L)).isEmpty();
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  getTasksByProjectForCurrentUser
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("getTasksByProjectForCurrentUser()")
    class GetTasksByProjectForCurrentUserTests {

        @Test
        void manager_seesAllTasks() {
            mockAsManager(manager);
            when(taskRepository.findByProjectId(10L)).thenReturn(List.of(task));

            List<TaskResponse> result = taskService.getTasksByProjectForCurrentUser(10L, manager);

            assertThat(result).hasSize(1);
        }

        @Test
        void member_seesOnlyOwnTasks() {
            mockAsMember(member);
            when(taskRepository.findByProjectIdAndAssignedUserId(10L, member.getId()))
                    .thenReturn(List.of(task));

            List<TaskResponse> result = taskService.getTasksByProjectForCurrentUser(10L, member);

            assertThat(result).hasSize(1);
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  getMyTasks
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("getMyTasks()")
    class GetMyTasksTests {

        @Test
        void returnsTasksAssignedToCurrentUser() {
            when(taskRepository.findByAssignedUserId(member.getId())).thenReturn(List.of(task));
            List<TaskResponse> result = taskService.getMyTasks(member);
            assertThat(result).hasSize(1);
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  getTasksBySprintForCurrentUser
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("getTasksBySprintForCurrentUser()")
    class GetTasksBySprintTests {

        @Test
        void returnsUserSprintTasks_whenFound() {
            when(taskRepository.findBySprintIdAndAssignedUserId(5L, member.getId()))
                    .thenReturn(List.of(task));

            List<TaskResponse> result = taskService.getTasksBySprintForCurrentUser(5L, member);

            assertThat(result).hasSize(1);
        }

        @Test
        void fallsBackToAllSprintTasks_whenUserHasNone() {
            when(taskRepository.findBySprintIdAndAssignedUserId(5L, member.getId()))
                    .thenReturn(List.of());
            when(taskRepository.findBySprintId(5L)).thenReturn(List.of(task));

            List<TaskResponse> result = taskService.getTasksBySprintForCurrentUser(5L, member);

            assertThat(result).hasSize(1);
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  getTasksByProjectAndStatusForCurrentUser
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("getTasksByProjectAndStatusForCurrentUser()")
    class GetByStatusTests {

        @Test
        void manager_seesAllTasksByStatus() {
            mockAsManager(manager);
            when(taskRepository.findByProjectIdAndStatus(10L, TaskStatus.TODO))
                    .thenReturn(List.of(task));

            List<TaskResponse> result = taskService.getTasksByProjectAndStatusForCurrentUser(
                    10L, TaskStatus.TODO, manager);

            assertThat(result).hasSize(1);
        }

        @Test
        void member_seesOnlyOwnTasksByStatus() {
            mockAsMember(member);
            when(taskRepository.findByProjectIdAndStatusAndAssignedUserId(
                    10L, TaskStatus.TODO, member.getId()))
                    .thenReturn(List.of(task));

            List<TaskResponse> result = taskService.getTasksByProjectAndStatusForCurrentUser(
                    10L, TaskStatus.TODO, member);

            assertThat(result).hasSize(1);
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  getBacklogTasksForCurrentUser
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("getBacklogTasksForCurrentUser()")
    class GetBacklogTests {

        @Test
        void manager_seesAllBacklogTasks() {
            mockAsManager(manager);
            when(taskRepository.findByProjectIdAndSprintIdIsNull(10L))
                    .thenReturn(List.of(task));

            List<TaskResponse> result = taskService.getBacklogTasksForCurrentUser(10L, manager);

            assertThat(result).hasSize(1);
        }

        @Test
        void member_seesOnlyOwnBacklogTasks() {
            Task backlogTask = Task.builder()
                    .id(2L).title("Backlog").projectId(10L)
                    .sprintId(null).assignedUser(member).build();

            mockAsMember(member);
            when(taskRepository.findByProjectIdAndAssignedUserId(10L, member.getId()))
                    .thenReturn(List.of(backlogTask));

            List<TaskResponse> result = taskService.getBacklogTasksForCurrentUser(10L, member);

            assertThat(result).hasSize(1);
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  createTask
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("createTask()")
    class CreateTaskTests {

        @Test
        void manager_createsTaskWithoutAssignee() {
            mockAsManager(manager);
            when(taskRepository.save(any(Task.class))).thenReturn(task);

            TaskResponse result = taskService.createTask(request, manager);

            assertThat(result.getTitle()).isEqualTo("Task 1");
            verify(notificationService, never()).createNotification(any(), any(), any(), any());
        }

        @Test
        void manager_createsTaskWithAssignee_sendsNotification() {
            TaskRequest reqWithAssignee = TaskRequest.builder()
                    .title("Task Assigned").priority(TaskPriority.HIGH)
                    .status(TaskStatus.TODO).projectId(10L)
                    .assignedUserId(member.getId()).build();

            Task savedTask = Task.builder().id(1L).title("Task Assigned")
                    .assignedUser(member).projectId(10L).build();

            mockAsManager(manager);
            when(userRepository.findById(member.getId())).thenReturn(Optional.of(member));
            when(taskRepository.save(any(Task.class))).thenReturn(savedTask);

            taskService.createTask(reqWithAssignee, manager);

            verify(notificationService).createNotification(
                    eq(member.getId()), any(), eq("TASK_ASSIGNED"), any());
        }

        @Test
        void nonManager_throwsAccessDenied() {
            mockAsMember(member);

            assertThatThrownBy(() -> taskService.createTask(request, member))
                    .isInstanceOf(AccessDeniedException.class);

            verify(taskRepository, never()).save(any());
        }

        @Test
        void assignedUserNotFound_throwsEntityNotFound() {
            TaskRequest reqWithAssignee = TaskRequest.builder()
                    .title("T").priority(TaskPriority.LOW)
                    .status(TaskStatus.TODO).projectId(10L)
                    .assignedUserId(99L).build();

            mockAsManager(manager);
            when(userRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> taskService.createTask(reqWithAssignee, manager))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  updateTask
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("updateTask()")
    class UpdateTaskTests {

        @Test
        void manager_updatesAllFields() {
            mockAsManager(manager);
            when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
            when(taskRepository.save(any())).thenReturn(task);

            TaskResponse result = taskService.updateTask(1L, request, manager);

            assertThat(result).isNotNull();
            verify(taskRepository).save(task);
        }

        @Test
        void manager_assignsNewUser_sendsNotification() {
            TaskRequest reqWithAssignee = TaskRequest.builder()
                    .title("Updated").priority(TaskPriority.LOW)
                    .status(TaskStatus.TODO).projectId(10L)
                    .assignedUserId(99L).build();

            User newUser = new User(); newUser.setId(99L);
            // task currently assigned to member (id=2), new assignment to id=99
            mockAsManager(manager);
            when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
            when(userRepository.findById(99L)).thenReturn(Optional.of(newUser));
            when(taskRepository.save(any())).thenReturn(task);

            taskService.updateTask(1L, reqWithAssignee, manager);

            verify(notificationService).createNotification(
                    eq(99L), any(), eq("TASK_ASSIGNED"), any());
        }

        @Test
        void member_updatesOwnTask_onlyRealFields() {
            // member is the assigned user
            mockAsMember(member);
            when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
            when(taskRepository.save(any())).thenReturn(task);

            TaskResponse result = taskService.updateTask(1L, request, member);

            assertThat(result).isNotNull();
        }

        @Test
        void member_updatesOtherUserTask_throwsAccessDenied() {
            // task is assigned to member(id=2), but current user is manager(id=1) acting as member
            Task otherTask = Task.builder().id(1L).projectId(10L)
                    .assignedUser(manager).status(TaskStatus.TODO).build();

            mockAsMember(member);
            when(taskRepository.findById(1L)).thenReturn(Optional.of(otherTask));

            assertThatThrownBy(() -> taskService.updateTask(1L, request, member))
                    .isInstanceOf(AccessDeniedException.class);
        }

        @Test
        void taskNotFound_throwsEntityNotFound() {
            when(taskRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> taskService.updateTask(99L, request, manager))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  deleteTask
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("deleteTask()")
    class DeleteTaskTests {

        @Test
        void manager_deletesTask() {
            mockAsManager(manager);
            when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

            taskService.deleteTask(1L, manager);

            verify(taskRepository).delete(task);
        }

        @Test
        void nonManager_throwsAccessDenied() {
            mockAsMember(member);
            when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

            assertThatThrownBy(() -> taskService.deleteTask(1L, member))
                    .isInstanceOf(AccessDeniedException.class);
        }

        @Test
        void taskNotFound_throwsEntityNotFound() {
            when(taskRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> taskService.deleteTask(99L, manager))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  updateTaskStatus
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("updateTaskStatus()")
    class UpdateTaskStatusTests {

        @Test
        void manager_updatesAnyTaskStatus() {
            mockAsManager(manager);
            when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
            when(taskRepository.save(any())).thenReturn(task);

            TaskResponse result = taskService.updateTaskStatus(1L, TaskStatus.IN_PROGRESS, manager);

            assertThat(result).isNotNull();
            // notification sent because assignedUser != null and status changed
            verify(notificationService).createNotification(
                    eq(member.getId()), any(), eq("STATUS_CHANGED"), any());
        }

        @Test
        void assignedMember_updatesOwnTaskStatus() {
            mockAsMember(member);
            when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
            when(taskRepository.save(any())).thenReturn(task);

            taskService.updateTaskStatus(1L, TaskStatus.DONE, member);

            verify(taskRepository).save(task);
        }

        @Test
        void member_updatesOtherUserTaskStatus_throwsAccessDenied() {
            Task otherTask = Task.builder().id(1L).projectId(10L)
                    .assignedUser(manager).status(TaskStatus.TODO).build();

            mockAsMember(member);
            when(taskRepository.findById(1L)).thenReturn(Optional.of(otherTask));

            assertThatThrownBy(() -> taskService.updateTaskStatus(1L, TaskStatus.DONE, member))
                    .isInstanceOf(AccessDeniedException.class);
        }

        @Test
        void taskNotFound_throwsEntityNotFound() {
            when(taskRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> taskService.updateTaskStatus(99L, TaskStatus.DONE, manager))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  assignTask
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("assignTask()")
    class AssignTaskTests {

        @Test
        void manager_assignsTask_sendsNotification() {
            mockAsManager(manager);
            when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
            when(userRepository.findById(member.getId())).thenReturn(Optional.of(member));
            when(taskRepository.save(any())).thenReturn(task);

            taskService.assignTask(1L, member.getId(), manager);

            verify(notificationService).createNotification(
                    eq(member.getId()), any(), eq("TASK_ASSIGNED"), any());
        }

        @Test
        void nonManager_throwsAccessDenied() {
            mockAsMember(member);
            when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

            assertThatThrownBy(() -> taskService.assignTask(1L, member.getId(), member))
                    .isInstanceOf(AccessDeniedException.class);
        }

        @Test
        void userNotFound_throwsEntityNotFound() {
            mockAsManager(manager);
            when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
            when(userRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> taskService.assignTask(1L, 99L, manager))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  moveTaskToSprint
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("moveTaskToSprint()")
    class MoveTaskToSprintTests {

        @Test
        void manager_movesTaskToSprint() {
            mockAsManager(manager);
            when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
            when(taskRepository.save(any())).thenReturn(task);

            TaskResponse result = taskService.moveTaskToSprint(1L, 5L, manager);

            assertThat(result).isNotNull();
            assertThat(task.getSprintId()).isEqualTo(5L);
        }

        @Test
        void nonManager_throwsAccessDenied() {
            mockAsMember(member);
            when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

            assertThatThrownBy(() -> taskService.moveTaskToSprint(1L, 5L, member))
                    .isInstanceOf(AccessDeniedException.class);
        }

        @Test
        void taskNotFound_throwsEntityNotFound() {
            when(taskRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> taskService.moveTaskToSprint(99L, 5L, manager))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  getTaskById
    // ═══════════════════════════════════════════════════════════
    @Nested
    @DisplayName("getTaskById()")
    class GetTaskByIdTests {

        @Test
        void returnsTask_whenFound() {
            when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
            TaskResponse result = taskService.getTaskById(1L);
            assertThat(result.getId()).isEqualTo(1L);
        }

        @Test
        void throwsEntityNotFound_whenMissing() {
            when(taskRepository.findById(99L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> taskService.getTaskById(99L))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }
}