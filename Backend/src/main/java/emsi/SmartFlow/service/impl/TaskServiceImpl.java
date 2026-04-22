package emsi.SmartFlow.service.impl;

import emsi.SmartFlow.controller.dto.TaskRequest;
import emsi.SmartFlow.controller.dto.TaskResponse;
import emsi.SmartFlow.entity.Task;
import emsi.SmartFlow.repo.TaskRepository;
import emsi.SmartFlow.entity.enums.TaskStatus;
import emsi.SmartFlow.service.facade.TaskService;
import emsi.SmartFlow.user.User;
import emsi.SmartFlow.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public TaskResponse createTask(TaskRequest request) {

        User assignedUser = null;
        if (request.getAssignedUserId() != null) {
            assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));
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

        return toResponse(taskRepository.save(task));
    }

    @Override
    public TaskResponse getTaskById(String id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));
        return toResponse(task);
    }

    @Override
    @Transactional
    public TaskResponse updateTask(String id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus());
        task.setEstimatedStartDate(request.getEstimatedStartDate());
        task.setEstimatedEndDate(request.getEstimatedEndDate());
        task.setRealStartDate(request.getRealStartDate());
        task.setRealEndDate(request.getRealEndDate());
        task.setEstimatedCost(request.getEstimatedCost());
        task.setRealCost(request.getRealCost());
        task.setProjectId(request.getProjectId());
        task.setSprintId(request.getSprintId());

        if (request.getAssignedUserId() != null) {
            User user = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));
            task.setAssignedUser(user);
        } else {
            task.setAssignedUser(null);
        }

        return toResponse(taskRepository.save(task));
    }

    @Override
    @Transactional
    public void deleteTask(String id) {
        if (!taskRepository.existsById(id))
            throw new EntityNotFoundException("Task not found");
        taskRepository.deleteById(id);
    }

    @Override
    public List<TaskResponse> getTasksByProject(String projectId) {
        return taskRepository.findByProjectId(projectId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<TaskResponse> getTasksBySprint(String sprintId) {
        return taskRepository.findBySprintId(sprintId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<TaskResponse> getTasksByProjectAndStatus(String projectId, TaskStatus status) {
        return taskRepository.findByProjectIdAndStatus(projectId, status)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<TaskResponse> getBacklogTasks(String projectId) {
        return taskRepository.findByProjectIdAndSprintIdIsNull(projectId)  // ← correction ici
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TaskResponse updateTaskStatus(String id, TaskStatus newStatus) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));
        task.setStatus(newStatus);
        return toResponse(taskRepository.save(task));
    }

    @Override
    @Transactional
    public TaskResponse assignTask(String taskId, String userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));
        User user = userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        task.setAssignedUser(user);
        return toResponse(taskRepository.save(task));
    }

    @Override
    @Transactional
    public TaskResponse moveTaskToSprint(String taskId, String sprintId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));
        task.setSprintId(sprintId);
        return toResponse(taskRepository.save(task));
    }

    // ── Mapper ──────────────────────────────────────────────────────────────
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
                .assignedUserId(task.getAssignedUser() != null ? task.getAssignedUser().getId() : null)
                .assignedUserFullName(task.getAssignedUser() != null ? task.getAssignedUser().getFullName() : null)
                .projectId(task.getProjectId())
                .sprintId(task.getSprintId())
                .build();
    }
}