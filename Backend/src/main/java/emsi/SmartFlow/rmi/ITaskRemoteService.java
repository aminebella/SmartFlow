package emsi.SmartFlow.rmi;

import emsi.SmartFlow.controller.dto.TaskRequest;
import emsi.SmartFlow.controller.dto.TaskResponse;
import emsi.SmartFlow.entity.enums.TaskStatus;

import java.rmi.Remote;
import java.rmi.RemoteException;
import java.util.List;

public interface ITaskRemoteService extends Remote {

    // CRUD
    TaskResponse createTask(TaskRequest request, Long currentUserId)            throws RemoteException;
    TaskResponse getTaskById(Long id)                                            throws RemoteException;
    TaskResponse updateTask(Long id, TaskRequest request, Long currentUserId)   throws RemoteException;
    void         deleteTask(Long id, Long currentUserId)                        throws RemoteException;

    // Lecture
    List<TaskResponse> getAllTasksByProject(Long projectId)                      throws RemoteException;
    List<TaskResponse> getTasksByProject(Long projectId, Long currentUserId)    throws RemoteException;
    List<TaskResponse> getMyTasks(Long currentUserId)                           throws RemoteException;
    List<TaskResponse> getBacklogTasks(Long projectId, Long currentUserId)      throws RemoteException;

    // Actions
    TaskResponse updateTaskStatus(Long id, TaskStatus status, Long currentUserId)       throws RemoteException;
    TaskResponse assignTask(Long taskId, Long userId, Long currentUserId)               throws RemoteException;
    TaskResponse moveTaskToSprint(Long taskId, Long sprintId, Long currentUserId)       throws RemoteException;
}