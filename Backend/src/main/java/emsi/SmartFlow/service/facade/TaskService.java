package emsi.SmartFlow.service.facade;

import emsi.SmartFlow.controller.dto.TaskRequest;
import emsi.SmartFlow.controller.dto.TaskResponse;
import emsi.SmartFlow.entity.enums.TaskStatus;
import java.util.List;

public interface TaskService {

    TaskResponse createTask(TaskRequest request);
    TaskResponse getTaskById(String id);
    TaskResponse updateTask(String id, TaskRequest request);
    void deleteTask(String id);

    List<TaskResponse> getTasksByProject(String projectId);
    List<TaskResponse> getTasksBySprint(String sprintId);
    List<TaskResponse> getTasksByProjectAndStatus(String projectId, TaskStatus status);
    List<TaskResponse> getBacklogTasks(String projectId);

    TaskResponse updateTaskStatus(String id, TaskStatus newStatus);   // MEMBER peut faire ça
    TaskResponse assignTask(String taskId, String userId);            // PROJECT_MANAGER
    TaskResponse moveTaskToSprint(String taskId, String sprintId);    // PROJECT_MANAGER
}