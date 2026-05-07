package emsi.SmartFlow.controller.dto;

import lombok.Data;

@Data
public class AiAnalysisRequest {
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
}