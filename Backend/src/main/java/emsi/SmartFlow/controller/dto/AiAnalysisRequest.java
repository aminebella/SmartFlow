package emsi.SmartFlow.controller.dto;

import lombok.Data;
import java.util.List;

@Data
public class AiAnalysisRequest {
    private String projectSummary;
    private List<AiTaskDTO> tasks;
    private List<AiSprintDTO> sprints;
    private List<AiRiskDTO> risks;
    private List<AiHumanResourceDTO> humanResources;
    private List<AiMaterialResourceDTO> materialResources;
    private Object timeline;
    private Object costEstimation;
    private String confidenceScore;
    private String documentQuality;

    // ── DTOs internes ──────────────────────────────

    @Data
    public static class AiTaskDTO {
        private String title;
        private String description;
        private String priority;
        private String estimatedComplexity;
        private String sprint;
    }

    @Data
    public static class AiSprintDTO {
        private String name;
        private String goal;
        private String duration;
        private List<String> tasks;
        private String startDate;
        private String endDate;
    }

    @Data
    public static class AiRiskDTO {
        private String description;
        private String probability;
        private String impact;
        private String mitigation;
    }

    @Data
    public static class AiHumanResourceDTO {
        private String role;
        private Integer count;
    }

    @Data
    public static class AiMaterialResourceDTO {
        private String name;
        private String type;
        private Integer quantity;
    }
}