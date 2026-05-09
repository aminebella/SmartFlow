package emsi.SmartFlow.service.facade;

import emsi.SmartFlow.controller.dto.AiAnalysisRequest;
import emsi.SmartFlow.controller.dto.AiAnalysisResponse;
import emsi.SmartFlow.controller.dto.ApiResponse;
import org.springframework.web.multipart.MultipartFile;

public interface AiAnalysisService {
    AiAnalysisResponse analyzePdf(Long projectId, MultipartFile file);
    AiAnalysisResponse saveAnalysis(Long projectId, AiAnalysisRequest request);
    AiAnalysisResponse getAnalysis(Long projectId);
    ApiResponse validateAndSave(Long projectId, AiAnalysisRequest request);
}