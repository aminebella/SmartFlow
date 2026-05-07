package emsi.SmartFlow.controller.dto;

import java.util.List;

public class ClientDashboardSummary {

    private long totalProjects;        // All projects where client is member/manager
    private long activeProjects;       // Projects with ACTIVE status
    private long finishedProjects;     // Projects with FINISHED status
    private long tasksDone;            // Tasks with DONE status assigned to client
    private long tasksTodo;            // Tasks with TODO status assigned to client
    private double productivity;       // (tasksDone / (tasksDone + tasksTodo)) * 100
    private List<TaskSummary> recentTasks; // Last 5 tasks assigned to client

    public static class TaskSummary {
        private String title;
        private String projectName;
        private String projectId;
        private String status;
        private String dueDate;

        public TaskSummary() {}

        public TaskSummary(String title, String projectName, String projectId, String status, String dueDate) {
            this.title = title;
            this.projectName = projectName;
            this.projectId = projectId;
            this.status = status;
            this.dueDate = dueDate;
        }

        // Getters and setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getProjectName() { return projectName; }
        public void setProjectName(String projectName) { this.projectName = projectName; }
        public String getProjectId() { return projectId; }
        public void setProjectId(String projectId) { this.projectId = projectId; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getDueDate() { return dueDate; }
        public void setDueDate(String dueDate) { this.dueDate = dueDate; }
    }

    public ClientDashboardSummary() {}

    // Getters and setters
    public long getTotalProjects() { return totalProjects; }
    public void setTotalProjects(long totalProjects) { this.totalProjects = totalProjects; }

    public long getActiveProjects() { return activeProjects; }
    public void setActiveProjects(long activeProjects) { this.activeProjects = activeProjects; }

    public long getFinishedProjects() { return finishedProjects; }
    public void setFinishedProjects(long finishedProjects) { this.finishedProjects = finishedProjects; }

    public long getTasksDone() { return tasksDone; }
    public void setTasksDone(long tasksDone) { this.tasksDone = tasksDone; }

    public long getTasksTodo() { return tasksTodo; }
    public void setTasksTodo(long tasksTodo) { this.tasksTodo = tasksTodo; }

    public double getProductivity() { return productivity; }
    public void setProductivity(double productivity) { this.productivity = productivity; }

    public List<TaskSummary> getRecentTasks() { return recentTasks; }
    public void setRecentTasks(List<TaskSummary> recentTasks) { this.recentTasks = recentTasks; }
}
