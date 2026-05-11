package emsi.SmartFlow.service.impl;

import emsi.SmartFlow.controller.dto.TaskRequest;
import emsi.SmartFlow.controller.dto.TaskResponse;
import emsi.SmartFlow.entity.Task;
import emsi.SmartFlow.entity.enums.ProjectTeamRole;
import emsi.SmartFlow.entity.enums.TaskStatus;
import emsi.SmartFlow.repo.ProjectTeamRepository;
import emsi.SmartFlow.repo.TaskRepository;
import emsi.SmartFlow.service.NotificationService;
import emsi.SmartFlow.service.facade.TaskService;
import emsi.SmartFlow.user.User;
import emsi.SmartFlow.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository        taskRepository;
    private final UserRepository        userRepository;
    private final ProjectTeamRepository projectTeamRepository;
    private final NotificationService   notificationService;

    // ════════════════════════════════════════════════════════════════
    //  HELPER
    // ════════════════════════════════════════════════════════════════

    private ProjectTeamRole resolveRole(Long projectId, User currentUser) {
        return projectTeamRepository
                .findRoleByProjectIdAndUserId(projectId, currentUser.getId())
                .orElseThrow(() -> new AccessDeniedException(
                        "You are not a member of project " + projectId));
    }

    private boolean isManager(Long projectId, User currentUser) {
        return resolveRole(projectId, currentUser) == ProjectTeamRole.MANAGER;
    }
    @Override
    public boolean isManagerOfProject(Long projectId, User currentUser) {
        return projectTeamRepository
                .findRoleByProjectIdAndUserId(projectId, currentUser.getId())
                .map(role -> role == ProjectTeamRole.MANAGER)
                .orElse(false);
    }
    // ════════════════════════════════════════════════════════════════
    //  LECTURE
    // ════════════════════════════════════════════════════════════════

    @Transactional(readOnly = true)
    @Override
    public List<TaskResponse> getAllTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<TaskResponse> getTasksByProjectForCurrentUser(Long projectId, User currentUser) {
        if (isManager(projectId, currentUser)) {
            return taskRepository.findByProjectId(projectId)
                    .stream().map(this::toResponse).collect(Collectors.toList()); // ← manquait cette ligne
        }
        return taskRepository.findByProjectIdAndAssignedUserId(projectId, currentUser.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public List<TaskResponse> getMyTasks(User currentUser) {
        return taskRepository.findByAssignedUserId(currentUser.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
        // ← supprime le doublon ".stream().map(this::toResponse).collect(Collectors.toList());"
    }

    @Override
    public List<TaskResponse> getTasksBySprintForCurrentUser(Long sprintId, User currentUser) {
        List<Task> tasks = taskRepository.findBySprintIdAndAssignedUserId(
                sprintId, currentUser.getId());
        if (tasks.isEmpty()) {
            tasks = taskRepository.findBySprintId(sprintId);
        }
        return tasks.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<TaskResponse> getTasksByProjectAndStatusForCurrentUser(
            Long projectId, TaskStatus status, User currentUser) {
        if (isManager(projectId, currentUser)) {
            return taskRepository.findByProjectIdAndStatus(projectId, status)
                    .stream().map(this::toResponse).collect(Collectors.toList());
        }
        return taskRepository.findByProjectIdAndStatusAndAssignedUserId(
                        projectId, status, currentUser.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public List<TaskResponse> getBacklogTasksForCurrentUser(Long projectId, User currentUser) {
        if (isManager(projectId, currentUser)) {
            return taskRepository.findByProjectIdAndSprintIdIsNull(projectId)
                    .stream().map(this::toResponse).collect(Collectors.toList());
        }
        return taskRepository.findByProjectIdAndAssignedUserId(projectId, currentUser.getId())
                .stream()
                .filter(t -> t.getSprintId() == null)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ════════════════════════════════════════════════════════════════
    //  CREATE
    // ════════════════════════════════════════════════════════════════

    @Override
    @Transactional
    public TaskResponse createTask(TaskRequest request, User currentUser) {
        if (!isManager(request.getProjectId(), currentUser)) {
            throw new AccessDeniedException("Only a MANAGER can create tasks.");
        }

        User assignedUser = null;
        if (request.getAssignedUserId() != null) {
            assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Assigned user not found: " + request.getAssignedUserId()));
            System.out.println("✅ Assigning task to user: " + assignedUser.getId() + " - " + assignedUser.getEmail());
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .status(request.getStatus())
                .estimatedStartDate(request.getEstimatedStartDate())
                .estimatedEndDate(request.getEstimatedEndDate())
                .realStartDate(request.getRealStartDate())
                .realEndDate(request.getRealEndDate())
                .estimatedCost(request.getEstimatedCost())
                .realCost(request.getRealCost())
                .assignedUser(assignedUser)
                .projectId(request.getProjectId())
                .sprintId(request.getSprintId())
                .build();

        Task saved = taskRepository.save(task);

        if (assignedUser != null) {
            notificationService.createNotification(
                    assignedUser.getId(),
                    "Une tâche vous a été assignée : " + saved.getTitle(),
                    "TASK_ASSIGNED",
                    saved.getId().toString()  // ✅
            );
        }

        return toResponse(saved);
    }

    // ════════════════════════════════════════════════════════════════
    //  UPDATE
    // ════════════════════════════════════════════════════════════════

    @Override
    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request, User currentUser) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found: " + id));

        boolean manager = isManager(task.getProjectId(), currentUser);

        if (manager) {
            task.setTitle(request.getTitle());
            task.setDescription(request.getDescription());
            task.setPriority(request.getPriority());
            task.setEstimatedStartDate(request.getEstimatedStartDate());
            task.setEstimatedEndDate(request.getEstimatedEndDate());
            task.setRealStartDate(request.getRealStartDate());
            task.setRealEndDate(request.getRealEndDate());
            task.setEstimatedCost(request.getEstimatedCost());
            task.setRealCost(request.getRealCost());
            task.setProjectId(request.getProjectId());
            task.setSprintId(request.getSprintId());

            if (request.getAssignedUserId() != null) {
                User assignedUser = userRepository.findById(request.getAssignedUserId())
                        .orElseThrow(() -> new EntityNotFoundException("Assigned user not found"));

                boolean isNewAssignment = task.getAssignedUser() == null ||
                        !task.getAssignedUser().getId().equals(assignedUser.getId());
                if (isNewAssignment) {
                    notificationService.createNotification(
                            assignedUser.getId(),
                            "Une tâche vous a été assignée : " + task.getTitle(),
                            "TASK_ASSIGNED",
                            task.getId().toString()  // ✅
                    );
                }
                task.setAssignedUser(assignedUser);
            } else {
                task.setAssignedUser(null);
            }
        } else {
            if (task.getAssignedUser() == null ||
                    !task.getAssignedUser().getId().equals(currentUser.getId())) {
                throw new AccessDeniedException("You can only update your own tasks.");
            }
            task.setRealStartDate(request.getRealStartDate());
            task.setRealEndDate(request.getRealEndDate());
            task.setRealCost(request.getRealCost());
        }

        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        return toResponse(taskRepository.save(task));
    }

    // ════════════════════════════════════════════════════════════════
    //  DELETE
    // ════════════════════════════════════════════════════════════════

    @Override
    @Transactional
    public void deleteTask(Long id, User currentUser) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found: " + id));

        if (!isManager(task.getProjectId(), currentUser)) {
            throw new AccessDeniedException("Only a MANAGER can delete tasks.");
        }

        taskRepository.delete(task);
    }

    // ════════════════════════════════════════════════════════════════
    //  ACTIONS SPÉCIALES
    // ════════════════════════════════════════════════════════════════

    @Override
    @Transactional
    public TaskResponse updateTaskStatus(Long id, TaskStatus newStatus, User currentUser) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found: " + id));

        if (!isManager(task.getProjectId(), currentUser)) {
            if (task.getAssignedUser() == null ||
                    !task.getAssignedUser().getId().equals(currentUser.getId())) {
                throw new AccessDeniedException("You can only update the status of your own tasks.");
            }
        }

        TaskStatus oldStatus = task.getStatus();
        task.setStatus(newStatus);
        Task saved = taskRepository.save(task);

        if (task.getAssignedUser() != null && oldStatus != newStatus) {
            notificationService.createNotification(
                    task.getAssignedUser().getId(),
                    "Statut de \"" + task.getTitle() + "\" changé : "
                            + oldStatus + " → " + newStatus,
                    "STATUS_CHANGED",
                    task.getId().toString()  // ✅
            );
        }

        return toResponse(saved);
    }

    @Override
    @Transactional
    public TaskResponse assignTask(Long taskId, Long userId, User currentUser) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found: " + taskId));

        if (!isManager(task.getProjectId(), currentUser)) {
            throw new AccessDeniedException("Only a MANAGER can assign tasks.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));

        task.setAssignedUser(user);
        Task saved = taskRepository.save(task);

        notificationService.createNotification(
                user.getId(),
                "Une tâche vous a été assignée : " + task.getTitle(),
                "TASK_ASSIGNED",
                task.getId().toString()  // ✅
        );

        return toResponse(saved);
    }

    @Override
    @Transactional
    public TaskResponse moveTaskToSprint(Long taskId, Long sprintId, User currentUser) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found: " + taskId));

        if (!isManager(task.getProjectId(), currentUser)) {
            throw new AccessDeniedException("Only a MANAGER can move tasks to a sprint.");
        }

        task.setSprintId(sprintId);
        return toResponse(taskRepository.save(task));
    }

    @Transactional(readOnly = true)
    @Override
    public TaskResponse getTaskById(Long id) {
        return toResponse(taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found: " + id)));
    }

    // ════════════════════════════════════════════════════════════════
    //  MAPPER
    // ════════════════════════════════════════════════════════════════

    private TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .status(task.getStatus())
                .estimatedStartDate(task.getEstimatedStartDate())
                .estimatedEndDate(task.getEstimatedEndDate())
                .realStartDate(task.getRealStartDate())
                .realEndDate(task.getRealEndDate())
                .estimatedCost(task.getEstimatedCost())
                .realCost(task.getRealCost())
                .assignedUserId(task.getAssignedUser() != null
                        ? task.getAssignedUser().getId() : null)
                .assignedUserFullName(task.getAssignedUser() != null
                        ? task.getAssignedUser().getFullName() : null)
                .projectId(task.getProjectId())
                .sprintId(task.getSprintId())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}