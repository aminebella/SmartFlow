package emsi.SmartFlow.rmi;

import emsi.SmartFlow.controller.dto.TaskRequest;
import emsi.SmartFlow.controller.dto.TaskResponse;
import emsi.SmartFlow.entity.enums.TaskStatus;
import emsi.SmartFlow.service.facade.TaskService;
import emsi.SmartFlow.user.User;
import emsi.SmartFlow.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.List;

@Slf4j
@Component
public class TaskRemoteServiceImpl extends UnicastRemoteObject implements ITaskRemoteService {

    private final TaskService    taskService;
    private final UserRepository userRepository;

    public TaskRemoteServiceImpl(TaskService taskService,
                                 UserRepository userRepository) throws RemoteException {
        super();
        this.taskService    = taskService;
        this.userRepository = userRepository;
    }

    private User resolveUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));
    }

    // ── CRUD ─────────────────────────────────────────────────────────────

    @Override
    public TaskResponse createTask(TaskRequest request, Long currentUserId) throws RemoteException {
        log.info("[RMI] createTask appelé par userId={}", currentUserId);
        try {
            return taskService.createTask(request, resolveUser(currentUserId));
        } catch (Exception e) {
            throw new RemoteException("Erreur createTask: " + e.getMessage(), e);
        }
    }

    @Override
    public TaskResponse getTaskById(Long id) throws RemoteException {
        log.info("[RMI] getTaskById id={}", id);
        try {
            return taskService.getTaskById(id);
        } catch (Exception e) {
            throw new RemoteException("Erreur getTaskById: " + e.getMessage(), e);
        }
    }

    @Override
    public TaskResponse updateTask(Long id, TaskRequest request,
                                   Long currentUserId) throws RemoteException {
        log.info("[RMI] updateTask id={} userId={}", id, currentUserId);
        try {
            return taskService.updateTask(id, request, resolveUser(currentUserId));
        } catch (Exception e) {
            throw new RemoteException("Erreur updateTask: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteTask(Long id, Long currentUserId) throws RemoteException {
        log.info("[RMI] deleteTask id={} userId={}", id, currentUserId);
        try {
            taskService.deleteTask(id, resolveUser(currentUserId));
        } catch (Exception e) {
            throw new RemoteException("Erreur deleteTask: " + e.getMessage(), e);
        }
    }

    // ── Lecture ───────────────────────────────────────────────────────────

    @Override
    public List<TaskResponse> getAllTasksByProject(Long projectId) throws RemoteException {
        log.info("[RMI] getAllTasksByProject projectId={}", projectId);
        try {
            return taskService.getAllTasksByProject(projectId);
        } catch (Exception e) {
            throw new RemoteException("Erreur getAllTasksByProject: " + e.getMessage(), e);
        }
    }

    @Override
    public List<TaskResponse> getTasksByProject(Long projectId,
                                                Long currentUserId) throws RemoteException {
        log.info("[RMI] getTasksByProject projectId={} userId={}", projectId, currentUserId);
        try {
            return taskService.getTasksByProjectForCurrentUser(projectId, resolveUser(currentUserId));
        } catch (Exception e) {
            throw new RemoteException("Erreur getTasksByProject: " + e.getMessage(), e);
        }
    }

    @Override
    public List<TaskResponse> getMyTasks(Long currentUserId) throws RemoteException {
        log.info("[RMI] getMyTasks userId={}", currentUserId);
        try {
            return taskService.getMyTasks(resolveUser(currentUserId));
        } catch (Exception e) {
            throw new RemoteException("Erreur getMyTasks: " + e.getMessage(), e);
        }
    }

    @Override
    public List<TaskResponse> getBacklogTasks(Long projectId,
                                              Long currentUserId) throws RemoteException {
        log.info("[RMI] getBacklogTasks projectId={} userId={}", projectId, currentUserId);
        try {
            return taskService.getBacklogTasksForCurrentUser(projectId, resolveUser(currentUserId));
        } catch (Exception e) {
            throw new RemoteException("Erreur getBacklogTasks: " + e.getMessage(), e);
        }
    }

    // ── Actions ───────────────────────────────────────────────────────────

    @Override
    public TaskResponse updateTaskStatus(Long id, TaskStatus status,
                                         Long currentUserId) throws RemoteException {
        log.info("[RMI] updateTaskStatus id={} status={} userId={}", id, status, currentUserId);
        try {
            return taskService.updateTaskStatus(id, status, resolveUser(currentUserId));
        } catch (Exception e) {
            throw new RemoteException("Erreur updateTaskStatus: " + e.getMessage(), e);
        }
    }

    @Override
    public TaskResponse assignTask(Long taskId, Long userId,
                                   Long currentUserId) throws RemoteException {
        log.info("[RMI] assignTask taskId={} userId={}", taskId, userId);
        try {
            return taskService.assignTask(taskId, userId, resolveUser(currentUserId));
        } catch (Exception e) {
            throw new RemoteException("Erreur assignTask: " + e.getMessage(), e);
        }
    }

    @Override
    public TaskResponse moveTaskToSprint(Long taskId, Long sprintId,
                                         Long currentUserId) throws RemoteException {
        log.info("[RMI] moveTaskToSprint taskId={} sprintId={}", taskId, sprintId);
        try {
            return taskService.moveTaskToSprint(taskId, sprintId, resolveUser(currentUserId));
        } catch (Exception e) {
            throw new RemoteException("Erreur moveTaskToSprint: " + e.getMessage(), e);
        }
    }
}