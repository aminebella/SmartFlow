package emsi.SmartFlow.controller.facade;

import emsi.SmartFlow.controller.dto.AiAnalysisRequest;
import emsi.SmartFlow.controller.dto.AiAnalysisResponse;
import emsi.SmartFlow.service.facade.AiAnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/projects/{projectId}/ai-analysis")
@RequiredArgsConstructor
public class AiAnalysisController {

    private final AiAnalysisService aiAnalysisService;

    // ── POST : Upload PDF → Gemini → retourner résultat ─────────────
    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AiAnalysisResponse> analyzePdf(
            @PathVariable Long projectId,
            @RequestParam("file") MultipartFile file) {

        log.info("[AI] Analyse PDF pour projectId={}", projectId);
        return ResponseEntity.ok(aiAnalysisService.analyzePdf(projectId, file));
    }

    // ── POST : Sauvegarder analyse (après validation manager) ────────
    @PostMapping
    public ResponseEntity<AiAnalysisResponse> saveAnalysis(
            @PathVariable Long projectId,
            @RequestBody AiAnalysisRequest request) {

        log.info("[AI] Sauvegarde analyse pour projectId={}", projectId);
        return ResponseEntity.ok(aiAnalysisService.saveAnalysis(projectId, request));
    }

    // ── GET : Récupérer analyse existante ────────────────────────────
    @GetMapping
    public ResponseEntity<AiAnalysisResponse> getAnalysis(
            @PathVariable Long projectId) {

        log.info("[AI] Récupération analyse pour projectId={}", projectId);
        return ResponseEntity.ok(aiAnalysisService.getAnalysis(projectId));
    }
}