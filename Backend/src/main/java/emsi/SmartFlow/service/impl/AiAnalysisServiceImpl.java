package emsi.SmartFlow.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import emsi.SmartFlow.controller.dto.AiAnalysisRequest;
import emsi.SmartFlow.controller.dto.AiAnalysisResponse;
import emsi.SmartFlow.controller.dto.ApiResponse;
import emsi.SmartFlow.entity.*;
import emsi.SmartFlow.entity.enums.*;
import emsi.SmartFlow.repo.*;
import emsi.SmartFlow.service.facade.AiAnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiAnalysisServiceImpl implements AiAnalysisService {

    private final AiAnalysisRepository aiAnalysisRepository;
    private final ObjectMapper objectMapper;
    private final GeminiService geminiService;
    private final SprintRepo sprintRepo;
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    // ── analyzePdf ────────────────────────────────────────────────────

    @Override
    public AiAnalysisResponse analyzePdf(Long projectId, MultipartFile file) {
        try {
            String extractedText = extractText(file);
            log.info("[AI] Texte extrait ({} caractères)", extractedText.length());

            String cleanedText = cleanAndTruncate(extractedText);
            log.info("[AI] Texte nettoyé ({} caractères)", cleanedText.length());

            String geminiJson = geminiService.analyze(cleanedText);
            log.info("[AI] JSON Groq reçu");

            String cleanJson = geminiJson
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            var parsed = objectMapper.readTree(cleanJson);

            AiAnalysisRequest request = new AiAnalysisRequest();
            request.setProjectSummary(parsed.path("projectSummary").asText(null));
            request.setConfidenceScore(parsed.path("confidenceScore").asText(null));
            request.setDocumentQuality(parsed.path("documentQuality").asText(null));

            request.setTasks(objectMapper.treeToValue(parsed.path("tasks"),
                    objectMapper.getTypeFactory().constructCollectionType(
                            List.class, AiAnalysisRequest.AiTaskDTO.class)));

            request.setSprints(objectMapper.treeToValue(parsed.path("sprints"),
                    objectMapper.getTypeFactory().constructCollectionType(
                            List.class, AiAnalysisRequest.AiSprintDTO.class)));

            request.setRisks(objectMapper.treeToValue(parsed.path("risks"),
                    objectMapper.getTypeFactory().constructCollectionType(
                            List.class, AiAnalysisRequest.AiRiskDTO.class)));

            request.setHumanResources(objectMapper.treeToValue(parsed.path("humanResources"),
                    objectMapper.getTypeFactory().constructCollectionType(
                            List.class, AiAnalysisRequest.AiHumanResourceDTO.class)));

            request.setMaterialResources(objectMapper.treeToValue(parsed.path("materialResources"),
                    objectMapper.getTypeFactory().constructCollectionType(
                            List.class, AiAnalysisRequest.AiMaterialResourceDTO.class)));

            request.setTimeline(objectMapper.treeToValue(parsed.path("timeline"), Object.class));
            request.setCostEstimation(objectMapper.treeToValue(parsed.path("costEstimation"), Object.class));

            return saveAnalysis(projectId, request);

        } catch (Exception e) {
            log.error("[AI] Erreur analyse fichier", e);
            throw new RuntimeException("Erreur analyse fichier: " + e.getMessage(), e);
        }
    }

    // ── validateAndSave ───────────────────────────────────────────────

    @Override
    @Transactional
    public ApiResponse validateAndSave(Long projectId, AiAnalysisRequest request) {
        try {
            // 1. Vérifier que le projet existe
            Project project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new RuntimeException("Projet introuvable: " + projectId));

            // 2. Sauvegarder l'analyse IA complète
            saveAnalysis(projectId, request);

            // 3. Supprimer anciens sprints générés par IA
            List<Sprint> existingSprints = sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(projectId);
            if (!existingSprints.isEmpty()) {
                for (Sprint s : existingSprints) {
                    taskRepository.findBySprintId(s.getId()).forEach(t -> {
                        t.setSprintId(null);
                        taskRepository.save(t);
                    });
                }
                sprintRepo.deleteAll(existingSprints);
                log.info("[AI] Anciens sprints supprimés pour projectId={}", projectId);
            }

            // 4. Créer les nouveaux Sprints
            Map<String, Long> sprintNameToId = new LinkedHashMap<>();
            LocalDate currentDate = LocalDate.now();

            if (request.getSprints() != null) {
                for (AiAnalysisRequest.AiSprintDTO sprintDTO : request.getSprints()) {

                    LocalDate startDate = parseDate(sprintDTO.getStartDate());
                    LocalDate endDate = parseDate(sprintDTO.getEndDate());

                    if (startDate == null) startDate = currentDate;
                    if (endDate == null) endDate = startDate.plusWeeks(2);
                    currentDate = endDate.plusDays(1);

                    Sprint sprint = Sprint.builder()
                            .title(sprintDTO.getName() != null ? sprintDTO.getName() : "Sprint")
                            .goal(sprintDTO.getGoal())
                            .startDate(startDate)
                            .endDate(endDate)
                            .status(SprintStatus.PLANNED)
                            .project(project)
                            .build();

                    Sprint saved = sprintRepo.save(sprint);
                    sprintNameToId.put(sprintDTO.getName(), saved.getId());
                    log.info("[AI] Sprint créé: {} (id={})", saved.getTitle(), saved.getId());
                }
            }

            // 5. Créer les Tasks
            if (request.getTasks() != null) {
                for (AiAnalysisRequest.AiTaskDTO taskDTO : request.getTasks()) {
                    Long sprintId = sprintNameToId.get(taskDTO.getSprint());

                    Task task = Task.builder()
                            .title(taskDTO.getTitle() != null ? taskDTO.getTitle() : "Tâche")
                            .description(taskDTO.getDescription())
                            .priority(mapPriority(taskDTO.getPriority()))
                            .status(TaskStatus.TODO)
                            .projectId(projectId)
                            .sprintId(sprintId)
                            .build();

                    taskRepository.save(task);
                    log.info("[AI] Tâche créée: {} → Sprint: {}", task.getTitle(), taskDTO.getSprint());
                }
            }

            // 6. Mettre à jour les dates et budget du projet
            try {
                Object timelineObj = request.getTimeline();
                if (timelineObj != null) {
                    Map<String, Object> timelineMap = objectMapper.convertValue(timelineObj, Map.class);

                    String startDateStr = (String) timelineMap.get("startDate");
                    String endDateStr = (String) timelineMap.get("endDate");

                    if (startDateStr != null && !startDateStr.isBlank()) {
                        project.setEstimatedStartDate(
                                LocalDate.parse(startDateStr, DateTimeFormatter.ISO_LOCAL_DATE)
                                        .atStartOfDay()
                        );
                    }

                    if (endDateStr != null && !endDateStr.isBlank()) {
                        project.setEstimatedEndDate(
                                LocalDate.parse(endDateStr, DateTimeFormatter.ISO_LOCAL_DATE)
                                        .atStartOfDay()
                        );
                    }
                }

                Object costObj = request.getCostEstimation();
                if (costObj != null) {
                    Map<String, Object> costMap = objectMapper.convertValue(costObj, Map.class);
                    Object totalCost = costMap.get("estimatedTotalCost");
                    if (totalCost != null) {
                        try {
                            double budget = Double.parseDouble(
                                    totalCost.toString().replaceAll("[^0-9.]", "")
                            );
                            project.setEstimatedBudget(budget);
                        } catch (NumberFormatException e) {
                            log.warn("[AI] Budget non parseable: {}", totalCost);
                        }
                    }
                }

                projectRepository.save(project);
                log.info("[AI] Projet mis à jour: dates et budget pour projectId={}", projectId);

            } catch (Exception e) {
                log.warn("[AI] Impossible de mettre à jour le projet: {}", e.getMessage());
            }

            log.info("[AI] Validation complète pour projectId={}", projectId);
            return ApiResponse.builder()
                    .message("Analyse validée et sauvegardée avec succès")
                    .build();

        } catch (Exception e) {
            log.error("[AI] Erreur validation", e);
            throw new RuntimeException("Erreur validation: " + e.getMessage(), e);
        }
    }

    // ── saveAnalysis ──────────────────────────────────────────────────

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

    // ── getAnalysis ───────────────────────────────────────────────────

    @Override
    public AiAnalysisResponse getAnalysis(Long projectId) {
        AiAnalysis analysis = aiAnalysisRepository.findByProjectId(projectId)
                .orElseThrow(() -> new RuntimeException("Aucune analyse pour ce projet"));
        return toResponse(analysis);
    }

    // ── Extraction texte ──────────────────────────────────────────────

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

    private String cleanAndTruncate(String text) {
        if (text == null) return "";
        text = text.replaceAll("\\n{3,}", "\n\n");
        text = text.replaceAll("[ \\t]{2,}", " ");
        text = text.replaceAll("[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F]", "");
        int maxChars = 15000;
        if (text.length() > maxChars) {
            text = text.substring(0, maxChars);
            log.warn("[AI] Texte tronqué à {} caractères", maxChars);
        }
        return text.trim();
    }

    // ── Helpers ───────────────────────────────────────────────────────

    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return null;
        try {
            return LocalDate.parse(dateStr, DateTimeFormatter.ISO_LOCAL_DATE);
        } catch (DateTimeParseException e) {
            log.warn("[AI] Date invalide: {}", dateStr);
            return null;
        }
    }

    private TaskPriority mapPriority(String priority) {
        if (priority == null) return TaskPriority.MEDIUM;
        return switch (priority.toUpperCase()) {
            case "HIGH" -> TaskPriority.HIGH;
            case "LOW" -> TaskPriority.LOW;
            default -> TaskPriority.MEDIUM;
        };
    }

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