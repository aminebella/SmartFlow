package emsi.SmartFlow.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import emsi.SmartFlow.controller.dto.AiAnalysisRequest;
import emsi.SmartFlow.controller.dto.AiAnalysisResponse;
import emsi.SmartFlow.entity.AiAnalysis;
import emsi.SmartFlow.repo.AiAnalysisRepository;
import emsi.SmartFlow.service.facade.AiAnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiAnalysisServiceImpl implements AiAnalysisService {

    private final AiAnalysisRepository aiAnalysisRepository;
    private final ObjectMapper objectMapper;
    private final GeminiService geminiService;

    @Override
    public AiAnalysisResponse analyzePdf(Long projectId, MultipartFile file) {
        try {
            // 1. Extraire texte selon le format
            String extractedText = extractText(file);
            log.info("[AI] Texte extrait ({} caractères)", extractedText.length());

            // 2. ✅ Nettoyer et tronquer le texte
            String cleanedText = cleanAndTruncate(extractedText);
            log.info("[AI] Texte nettoyé ({} caractères)", cleanedText.length());

            // 3. Appeler Gemini
            String geminiJson = geminiService.analyze(cleanedText);
            log.info("[AI] JSON Gemini reçu");

            // 4. Parser le JSON retourné
            String cleanJson = geminiJson
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            var parsed = objectMapper.readTree(cleanJson);

            // 5. Construire la request et sauvegarder
            AiAnalysisRequest request = new AiAnalysisRequest();
            request.setProjectSummary(parsed.path("projectSummary").asText(null));
            request.setConfidenceScore(parsed.path("confidenceScore").asText(null));
            request.setDocumentQuality(parsed.path("documentQuality").asText(null));
            request.setTasks(objectMapper.treeToValue(parsed.path("tasks"), Object.class));
            request.setSprints(objectMapper.treeToValue(parsed.path("sprints"), Object.class));
            request.setRisks(objectMapper.treeToValue(parsed.path("risks"), Object.class));
            request.setHumanResources(objectMapper.treeToValue(parsed.path("humanResources"), Object.class));
            request.setMaterialResources(objectMapper.treeToValue(parsed.path("materialResources"), Object.class));
            request.setTimeline(objectMapper.treeToValue(parsed.path("timeline"), Object.class));
            request.setCostEstimation(objectMapper.treeToValue(parsed.path("costEstimation"), Object.class));

            return saveAnalysis(projectId, request);

        } catch (Exception e) {
            log.error("[AI] Erreur analyse fichier", e);
            throw new RuntimeException("Erreur analyse fichier: " + e.getMessage(), e);
        }
    }

    // ✅ Nouvelle méthode — nettoie et tronque le texte
    private String cleanAndTruncate(String text) {
        if (text == null) return "";

        // Supprimer les lignes vides multiples
        text = text.replaceAll("\\n{3,}", "\n\n");

        // Supprimer les espaces multiples
        text = text.replaceAll("[ \\t]{2,}", " ");

        // Supprimer les caractères spéciaux inutiles
        text = text.replaceAll("[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F]", "");

        // ✅ Tronquer à 8000 caractères max pour éviter dépassement quota
        int maxChars = 15000;
        if (text.length() > maxChars) {
            text = text.substring(0, maxChars);
            log.warn("[AI] Texte tronqué à {} caractères", maxChars);
        }

        return text.trim();
    }

    // ── Extraction texte selon format ─────────────────────────────────

    private String extractText(MultipartFile file) throws Exception {
        String filename = file.getOriginalFilename();
        if (filename == null) throw new RuntimeException("Fichier invalide");

        String ext = filename.toLowerCase();

        if (ext.endsWith(".pdf")) {
            try (var document = Loader.loadPDF(file.getBytes())) {
                PDFTextStripper stripper = new PDFTextStripper();
                return stripper.getText(document);
            }

        } else if (ext.endsWith(".docx")) {
            try (XWPFDocument doc = new XWPFDocument(file.getInputStream())) {
                XWPFWordExtractor extractor = new XWPFWordExtractor(doc);
                return extractor.getText();
            }

        } else if (ext.endsWith(".txt")) {
            return new String(file.getBytes(), StandardCharsets.UTF_8);

        } else {
            throw new RuntimeException("Format non supporté. Utilisez PDF, DOCX ou TXT.");
        }
    }

    @Override
    public AiAnalysisResponse saveAnalysis(Long projectId, AiAnalysisRequest request) {
        try {
            AiAnalysis analysis;
            Optional<AiAnalysis> existing = aiAnalysisRepository.findByProjectId(projectId);
            if (existing.isPresent()) {
                analysis = existing.get();
            } else {
                analysis = AiAnalysis.builder().projectId(projectId).build();
            }

            analysis.setProjectSummary(request.getProjectSummary());
            analysis.setTasks(toJson(request.getTasks()));
            analysis.setSprints(toJson(request.getSprints()));
            analysis.setRisks(toJson(request.getRisks()));
            analysis.setHumanResources(toJson(request.getHumanResources()));
            analysis.setMaterialResources(toJson(request.getMaterialResources()));
            analysis.setTimeline(toJson(request.getTimeline()));
            analysis.setCostEstimation(toJson(request.getCostEstimation()));
            analysis.setConfidenceScore(request.getConfidenceScore());
            analysis.setDocumentQuality(request.getDocumentQuality());

            AiAnalysis saved = aiAnalysisRepository.save(analysis);
            log.info("[AI] Analyse sauvegardée pour projectId={}", projectId);

            return toResponse(saved);

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la sauvegarde: " + e.getMessage(), e);
        }
    }

    @Override
    public AiAnalysisResponse getAnalysis(Long projectId) {
        AiAnalysis analysis = aiAnalysisRepository.findByProjectId(projectId)
                .orElseThrow(() -> new RuntimeException("Aucune analyse pour ce projet"));
        return toResponse(analysis);
    }

    // ── Helpers JSON ──────────────────────────────────────────────────

    private String toJson(Object obj) {
        if (obj == null) return null;
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return obj.toString();
        }
    }

    private Object fromJson(String json) {
        if (json == null) return null;
        try {
            return objectMapper.readValue(json, Object.class);
        } catch (Exception e) {
            return json;
        }
    }

    private AiAnalysisResponse toResponse(AiAnalysis a) {
        return AiAnalysisResponse.builder()
                .id(a.getId())
                .projectId(a.getProjectId())
                .projectSummary(a.getProjectSummary())
                .tasks(fromJson(a.getTasks()))
                .sprints(fromJson(a.getSprints()))
                .risks(fromJson(a.getRisks()))
                .humanResources(fromJson(a.getHumanResources()))
                .materialResources(fromJson(a.getMaterialResources()))
                .timeline(fromJson(a.getTimeline()))
                .costEstimation(fromJson(a.getCostEstimation()))
                .confidenceScore(a.getConfidenceScore())
                .documentQuality(a.getDocumentQuality())
                .createdAt(a.getCreatedAt())
                .updatedAt(a.getUpdatedAt())
                .build();
    }
}