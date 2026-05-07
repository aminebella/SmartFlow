package emsi.SmartFlow.controller.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AiAnalysisResponse {
    private Long id;
    private Long projectId;
    private String projectSummary;
    private Object tasks;
    private Object sprints;
    private Object risks;
    private Object humanResources;
    private Object materialResources;
    private Object timeline;
    private Object costEstimation;
    private String confidenceScore;
    private String documentQuality;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}