package emsi.SmartFlow.controller.dto;

import java.time.YearMonth;
import java.util.List;
import java.util.Map;

public class AdminDashboardSummary {

    private long activeProjects;
    private long users;
    private long tasksDone;
    private double productivity; // percentage 0-100
    // activity: list of pairs [yearMonth, count] for projects and tasks
    private List<YearMonthPoint> projectsActivity;
    private List<YearMonthPoint> tasksActivity;
    // Daily activity points for the current month
    private List<DayPoint> projectsActivityDaily;
    private List<DayPoint> tasksActivityDaily;
    private Map<String, Long> projectsByStatus; // status name -> count

    public static class YearMonthPoint {
        private int year;
        private int month;
        private long count;

        public YearMonthPoint() {}

        public YearMonthPoint(int year, int month, long count) {
            this.year = year;
            this.month = month;
            this.count = count;
        }

        public int getYear() {
            return year;
        }

        public void setYear(int year) {
            this.year = year;
        }

        public int getMonth() {
            return month;
        }

        public void setMonth(int month) {
            this.month = month;
        }

        public long getCount() {
            return count;
        }

        public void setCount(long count) {
            this.count = count;
        }
    }

    public static class DayPoint {
        private int day;
        private long count;

        public DayPoint() {}

        public DayPoint(int day, long count) {
            this.day = day;
            this.count = count;
        }

        public int getDay() {
            return day;
        }

        public void setDay(int day) {
            this.day = day;
        }

        public long getCount() {
            return count;
        }

        public void setCount(long count) {
            this.count = count;
        }
    }

    public AdminDashboardSummary() {}

    public long getActiveProjects() {
        return activeProjects;
    }

    public void setActiveProjects(long activeProjects) {
        this.activeProjects = activeProjects;
    }

    public long getUsers() {
        return users;
    }

    public void setUsers(long users) {
        this.users = users;
    }

    public long getTasksDone() {
        return tasksDone;
    }

    public void setTasksDone(long tasksDone) {
        this.tasksDone = tasksDone;
    }

    public double getProductivity() {
        return productivity;
    }

    public void setProductivity(double productivity) {
        this.productivity = productivity;
    }

    public List<YearMonthPoint> getProjectsActivity() {
        return projectsActivity;
    }

    public void setProjectsActivity(List<YearMonthPoint> projectsActivity) {
        this.projectsActivity = projectsActivity;
    }

    public List<YearMonthPoint> getTasksActivity() {
        return tasksActivity;
    }

    public void setTasksActivity(List<YearMonthPoint> tasksActivity) {
        this.tasksActivity = tasksActivity;
    }

    public List<DayPoint> getProjectsActivityDaily() {
        return projectsActivityDaily;
    }

    public void setProjectsActivityDaily(List<DayPoint> projectsActivityDaily) {
        this.projectsActivityDaily = projectsActivityDaily;
    }

    public List<DayPoint> getTasksActivityDaily() {
        return tasksActivityDaily;
    }

    public void setTasksActivityDaily(List<DayPoint> tasksActivityDaily) {
        this.tasksActivityDaily = tasksActivityDaily;
    }

    public Map<String, Long> getProjectsByStatus() {
        return projectsByStatus;
    }

    public void setProjectsByStatus(Map<String, Long> projectsByStatus) {
        this.projectsByStatus = projectsByStatus;
    }
}
