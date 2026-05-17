package emsi.SmartFlow.TestUnitaire.controller.facade;

import com.fasterxml.jackson.databind.ObjectMapper;
import emsi.SmartFlow.controller.dto.AiAnalysisRequest;
import emsi.SmartFlow.controller.dto.AiAnalysisResponse;
import emsi.SmartFlow.controller.dto.ApiResponse;
import emsi.SmartFlow.controller.facade.AiAnalysisController;
import emsi.SmartFlow.service.facade.AiAnalysisService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for AiAnalysisController.
 *
 * Covers all 4 endpoints:
 *  POST /projects/{projectId}/ai-analysis/validate
 *  POST /projects/{projectId}/ai-analysis/analyze   (multipart)
 *  POST /projects/{projectId}/ai-analysis           (save)
 *  GET  /projects/{projectId}/ai-analysis           (get)
 */
@ExtendWith(MockitoExtension.class)
class AiAnalysisControllerTest {

    @Mock
    private AiAnalysisService aiAnalysisService;

    @InjectMocks
    private AiAnalysisController aiAnalysisController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private AiAnalysisResponse sampleResponse;
    private AiAnalysisRequest  sampleRequest;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(aiAnalysisController).build();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());

        sampleResponse = AiAnalysisResponse.builder()
                .id(1L)
                .projectId(10L)
                .projectSummary("A sample project for testing AI analysis")
                .confidenceScore("HIGH")
                .documentQuality("HIGH")
                .tasks(Collections.emptyList())
                .sprints(Collections.emptyList())
                .risks(Collections.emptyList())
                .humanResources(Collections.emptyList())
                .materialResources(Collections.emptyList())
                .timeline(null)
                .costEstimation(null)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        sampleRequest = new AiAnalysisRequest();
        sampleRequest.setProjectSummary("Test summary");
        sampleRequest.setConfidenceScore("HIGH");
        sampleRequest.setDocumentQuality("HIGH");
        sampleRequest.setTasks(Collections.emptyList());
        sampleRequest.setSprints(Collections.emptyList());
        sampleRequest.setRisks(Collections.emptyList());
        sampleRequest.setHumanResources(Collections.emptyList());
        sampleRequest.setMaterialResources(Collections.emptyList());
    }

    // ════════════════════════════════════════════════════════════════════
    //  POST /projects/{projectId}/ai-analysis/validate
    // ════════════════════════════════════════════════════════════════════

    @Test
    void validateAndSave_returnsOk() throws Exception {
        ApiResponse<Void> apiResp = ApiResponse.<Void>builder()
                .status(200).message("Analyse validée et sauvegardée avec succès").build();

        when(aiAnalysisService.validateAndSave(eq(10L), any(AiAnalysisRequest.class)))
                .thenReturn(apiResp);

        mockMvc.perform(post("/projects/10/ai-analysis/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Analyse validée et sauvegardée avec succès"));

        verify(aiAnalysisService).validateAndSave(eq(10L), any(AiAnalysisRequest.class));
    }

    @Test
    void validateAndSave_callsServiceWithCorrectProjectId() throws Exception {
        ApiResponse<Void> apiResp = ApiResponse.<Void>builder()
                .status(200).message("ok").build();

        when(aiAnalysisService.validateAndSave(eq(99L), any())).thenReturn(apiResp);

        mockMvc.perform(post("/projects/99/ai-analysis/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isOk());

        verify(aiAnalysisService).validateAndSave(eq(99L), any());
    }

    @Test
    void validateAndSave_withEmptyRequest_returnsOk() throws Exception {
        AiAnalysisRequest empty = new AiAnalysisRequest();
        ApiResponse<Void> apiResp = ApiResponse.<Void>builder().status(200).message("ok").build();

        when(aiAnalysisService.validateAndSave(eq(10L), any())).thenReturn(apiResp);

        mockMvc.perform(post("/projects/10/ai-analysis/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(empty)))
                .andExpect(status().isOk());
    }

    // ════════════════════════════════════════════════════════════════════
    //  POST /projects/{projectId}/ai-analysis/analyze   (multipart PDF)
    // ════════════════════════════════════════════════════════════════════

    @Test
    void analyzePdf_withPdfFile_returnsOk() throws Exception {
        when(aiAnalysisService.analyzePdf(eq(10L), any())).thenReturn(sampleResponse);

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "project-spec.pdf",
                MediaType.APPLICATION_PDF_VALUE,
                "PDF content here".getBytes()
        );

        mockMvc.perform(multipart("/projects/10/ai-analysis/analyze").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.projectId").value(10))
                .andExpect(jsonPath("$.confidenceScore").value("HIGH"))
                .andExpect(jsonPath("$.projectSummary").value("A sample project for testing AI analysis"));

        verify(aiAnalysisService).analyzePdf(eq(10L), any());
    }

    @Test
    void analyzePdf_withTxtFile_returnsOk() throws Exception {
        when(aiAnalysisService.analyzePdf(eq(10L), any())).thenReturn(sampleResponse);

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "spec.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "Project specification text".getBytes()
        );

        mockMvc.perform(multipart("/projects/10/ai-analysis/analyze").file(file))
                .andExpect(status().isOk());
    }

    @Test
    void analyzePdf_callsServiceWithCorrectProjectId() throws Exception {
        when(aiAnalysisService.analyzePdf(eq(42L), any())).thenReturn(sampleResponse);

        MockMultipartFile file = new MockMultipartFile(
                "file", "doc.pdf", MediaType.APPLICATION_PDF_VALUE, "data".getBytes()
        );

        mockMvc.perform(multipart("/projects/42/ai-analysis/analyze").file(file))
                .andExpect(status().isOk());

        verify(aiAnalysisService).analyzePdf(eq(42L), any());
    }

    @Test
    void analyzePdf_responseContainsAllFields() throws Exception {
        when(aiAnalysisService.analyzePdf(eq(10L), any())).thenReturn(sampleResponse);

        MockMultipartFile file = new MockMultipartFile(
                "file", "doc.pdf", MediaType.APPLICATION_PDF_VALUE, "data".getBytes()
        );

        mockMvc.perform(multipart("/projects/10/ai-analysis/analyze").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.projectId").value(10))
                .andExpect(jsonPath("$.documentQuality").value("HIGH"));
    }

    // ════════════════════════════════════════════════════════════════════
    //  POST /projects/{projectId}/ai-analysis   (save)
    // ════════════════════════════════════════════════════════════════════

    @Test
    void saveAnalysis_returnsOk() throws Exception {
        when(aiAnalysisService.saveAnalysis(eq(10L), any(AiAnalysisRequest.class)))
                .thenReturn(sampleResponse);

        mockMvc.perform(post("/projects/10/ai-analysis")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.projectId").value(10))
                .andExpect(jsonPath("$.confidenceScore").value("HIGH"));

        verify(aiAnalysisService).saveAnalysis(eq(10L), any(AiAnalysisRequest.class));
    }

    @Test
    void saveAnalysis_withDifferentProjectId_callsServiceCorrectly() throws Exception {
        AiAnalysisResponse resp = AiAnalysisResponse.builder()
                .id(2L).projectId(55L).confidenceScore("MEDIUM").build();

        when(aiAnalysisService.saveAnalysis(eq(55L), any())).thenReturn(resp);

        mockMvc.perform(post("/projects/55/ai-analysis")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.projectId").value(55));
    }

    @Test
    void saveAnalysis_lowConfidence_returnsOk() throws Exception {
        AiAnalysisResponse lowConf = AiAnalysisResponse.builder()
                .id(3L).projectId(10L).confidenceScore("LOW").build();

        when(aiAnalysisService.saveAnalysis(eq(10L), any())).thenReturn(lowConf);

        sampleRequest.setConfidenceScore("LOW");

        mockMvc.perform(post("/projects/10/ai-analysis")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.confidenceScore").value("LOW"));
    }

    // ════════════════════════════════════════════════════════════════════
    //  GET /projects/{projectId}/ai-analysis
    // ════════════════════════════════════════════════════════════════════

    @Test
    void getAnalysis_returnsOkWithData() throws Exception {
        when(aiAnalysisService.getAnalysis(10L)).thenReturn(sampleResponse);

        mockMvc.perform(get("/projects/10/ai-analysis"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.projectId").value(10))
                .andExpect(jsonPath("$.projectSummary").value("A sample project for testing AI analysis"))
                .andExpect(jsonPath("$.confidenceScore").value("HIGH"));

        verify(aiAnalysisService).getAnalysis(10L);
    }

    @Test
    void getAnalysis_callsServiceWithCorrectProjectId() throws Exception {
        when(aiAnalysisService.getAnalysis(77L)).thenReturn(sampleResponse);

        mockMvc.perform(get("/projects/77/ai-analysis"))
                .andExpect(status().isOk());

        verify(aiAnalysisService).getAnalysis(77L);
    }


    @Test
    void getAnalysis_responseHasAllFields() throws Exception {
        when(aiAnalysisService.getAnalysis(10L)).thenReturn(sampleResponse);

        mockMvc.perform(get("/projects/10/ai-analysis"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.documentQuality").value("HIGH"))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.projectId").exists());
    }
}
