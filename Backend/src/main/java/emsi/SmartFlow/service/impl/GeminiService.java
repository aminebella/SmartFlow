package emsi.SmartFlow.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class GeminiService {

    @Value("${groq.api.key}")
    private String apiKey;

    private static final String GROQ_URL =
            "https://api.groq.com/openai/v1/chat/completions";

    private final ObjectMapper objectMapper = new ObjectMapper();

    private String buildPrompt(String documentText) {
        String today = LocalDate.now().toString();
        return "You are a world-class senior software architect, certified PMP project manager, and expert cost estimator with 15+ years of experience.\n" +
                "Today's date is: " + today + "\n\n" +

                "LANGUAGE: The document may be in French, Arabic, or English. Analyze in the document's language context but respond in French.\n\n" +

                "YOUR MISSION:\n" +
                "Analyze this software project specification document and produce a COMPLETE, PROFESSIONAL, and REALISTIC project plan.\n" +
                "Think deeply about the project scope, complexity, and real-world constraints before generating your response.\n\n" +

                "CRITICAL OUTPUT REQUIREMENTS:\n" +
                "- Return ONLY valid JSON — no markdown, no code blocks, no explanations\n" +
                "- Start with { and end with }\n" +
                "- Every field must be filled with meaningful, professional content\n\n" +

                "PROFESSIONAL ANALYSIS RULES:\n\n" +

                "1. TASKS — Be exhaustive and realistic:\n" +
                "   - Generate ALL tasks needed to complete the project (minimum 15, ideally 25-40 for complex projects)\n" +
                "   - Each task must be specific, actionable, and professionally described\n" +
                "   - Cover ALL project phases: Setup, Design, Development, Testing, Deployment, Documentation\n" +
                "   - Every task MUST be assigned to a sprint\n" +
                "   - Prioritize based on dependencies and business value\n\n" +

                "2. SPRINTS — Plan realistically:\n" +
                "   - Each sprint = 2 weeks\n" +
                "   - Generate enough sprints to cover the full project (minimum 6, scale with complexity)\n" +
                "   - Sprint 1 always = Project Setup, Architecture, Environment\n" +
                "   - Last sprint always = Final Testing, Bug Fixes, Deployment, Documentation\n" +
                "   - Each sprint must have 3-6 tasks and a clear, specific goal\n" +
                "   - Balance workload across sprints\n\n" +

                "3. TIMELINE — Be precise:\n" +
                "   - startDate = " + today + "\n" +
                "   - endDate = startDate + (number of sprints × 2 weeks)\n" +
                "   - Each phase must have exact start and end dates\n" +
                "   - No gaps or overlaps between phases\n" +
                "   - Phases must correspond to sprint groups (e.g., Sprint 1-2 = Foundation phase)\n\n" +

                "4. COST ESTIMATION — Use Moroccan market rates:\n" +
                "   - Junior Developer: 8,000 MAD/month\n" +
                "   - Mid-level Developer: 12,000 MAD/month\n" +
                "   - Senior Developer: 18,000 MAD/month\n" +
                "   - UI/UX Designer: 10,000 MAD/month\n" +
                "   - Project Manager: 15,000 MAD/month\n" +
                "   - QA Engineer: 9,000 MAD/month\n" +
                "   - DevOps Engineer: 14,000 MAD/month\n" +
                "   - Calculate: total months × team size × respective salaries\n" +
                "   - Add infrastructure costs (servers, licenses, tools): 10-15% of labor cost\n" +
                "   - Breakdown must be per development area (Frontend, Backend, Design, Testing, DevOps, Infrastructure)\n" +
                "   - estimatedTotalCost must be a NUMBER only (e.g., 240000)\n\n" +

                "5. HUMAN RESOURCES — Scale to project size:\n" +
                "   - Suggest realistic team composition based on project complexity\n" +
                "   - Include all necessary roles\n\n" +

                "6. RISKS — Be specific and professional:\n" +
                "   - Identify at least 5 realistic risks specific to THIS project\n" +
                "   - Each risk must have a specific, actionable mitigation strategy\n\n" +

                "7. CONFIDENCE SCORE:\n" +
                "   - HIGH: document has detailed functional requirements, clear scope\n" +
                "   - MEDIUM: document has general requirements but lacks detail\n" +
                "   - LOW: document is vague, incomplete, or too short\n\n" +

                "EXACT JSON STRUCTURE TO RETURN:\n" +
                "{\n" +
                "  \"isValid\": true,\n" +
                "  \"reason\": null,\n" +
                "  \"documentQuality\": \"HIGH\",\n" +
                "  \"projectSummary\": \"Professional 3-5 sentence summary of the project goals, scope, and key features\",\n" +
                "  \"tasks\": [\n" +
                "    {\n" +
                "      \"title\": \"Specific task title\",\n" +
                "      \"description\": \"Detailed description of what needs to be done and why\",\n" +
                "      \"priority\": \"HIGH\",\n" +
                "      \"estimatedComplexity\": \"MEDIUM\",\n" +
                "      \"sprint\": \"Sprint 1\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"sprints\": [\n" +
                "    {\n" +
                "      \"name\": \"Sprint 1\",\n" +
                "      \"goal\": \"Specific, measurable sprint goal\",\n" +
                "      \"duration\": \"2 weeks\",\n" +
                "      \"tasks\": [\"Task title 1\", \"Task title 2\", \"Task title 3\"]\n" +
                "    }\n" +
                "  ],\n" +
                "  \"risks\": [\n" +
                "    {\n" +
                "      \"description\": \"Specific risk description relevant to this project\",\n" +
                "      \"probability\": \"35%\",\n" +
                "      \"impact\": \"HIGH\",\n" +
                "      \"mitigation\": \"Specific, actionable mitigation strategy\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"humanResources\": [\n" +
                "    {\"role\": \"Senior Backend Developer\", \"count\": 2},\n" +
                "    {\"role\": \"Frontend Developer\", \"count\": 2},\n" +
                "    {\"role\": \"UI/UX Designer\", \"count\": 1},\n" +
                "    {\"role\": \"Project Manager\", \"count\": 1},\n" +
                "    {\"role\": \"QA Engineer\", \"count\": 1},\n" +
                "    {\"role\": \"DevOps Engineer\", \"count\": 1}\n" +
                "  ],\n" +
                "  \"materialResources\": [\n" +
                "    {\"name\": \"Cloud Infrastructure (AWS/GCP)\", \"type\": \"Infrastructure\", \"quantity\": 1},\n" +
                "    {\"name\": \"Development Workstations\", \"type\": \"Hardware\", \"quantity\": 8},\n" +
                "    {\"name\": \"Project Management Tool (Jira)\", \"type\": \"Software\", \"quantity\": 1}\n" +
                "  ],\n" +
                "  \"timeline\": {\n" +
                "    \"startDate\": \"" + today + "\",\n" +
                "    \"endDate\": \"CALCULATE_BASED_ON_SPRINTS\",\n" +
                "    \"phases\": [\n" +
                "      {\n" +
                "        \"name\": \"Phase name\",\n" +
                "        \"start\": \"YYYY-MM-DD\",\n" +
                "        \"end\": \"YYYY-MM-DD\"\n" +
                "      }\n" +
                "    ],\n" +
                "    \"justification\": \"Explain why this timeline is realistic for this specific project\"\n" +
                "  },\n" +
                "  \"costEstimation\": {\n" +
                "    \"estimatedTotalCost\": 240000,\n" +
                "    \"currency\": \"MAD\",\n" +
                "    \"breakdown\": [\n" +
                "      {\"task\": \"Backend Development\", \"type\": \"Backend\", \"cost\": \"80000 MAD\"},\n" +
                "      {\"task\": \"Frontend Development\", \"type\": \"Frontend\", \"cost\": \"60000 MAD\"},\n" +
                "      {\"task\": \"UI/UX Design\", \"type\": \"Design\", \"cost\": \"30000 MAD\"},\n" +
                "      {\"task\": \"Quality Assurance & Testing\", \"type\": \"Testing\", \"cost\": \"25000 MAD\"},\n" +
                "      {\"task\": \"DevOps & Infrastructure\", \"type\": \"DevOps\", \"cost\": \"30000 MAD\"},\n" +
                "      {\"task\": \"Project Management\", \"type\": \"Management\", \"cost\": \"15000 MAD\"}\n" +
                "    ],\n" +
                "    \"assumptions\": \"Based on Moroccan market rates, X-month timeline, team of Y people\"\n" +
                "  },\n" +
                "  \"confidenceScore\": \"HIGH\"\n" +
                "}\n\n" +
                "DOCUMENT TO ANALYZE:\n" +
                "\"\"\"\n" +
                documentText +
                "\n\"\"\"";
    }

    // ── ✅ Circuit Breaker + Retry avec Resilience4J ──────────────────
    @CircuitBreaker(name = "geminiService", fallbackMethod = "fallbackAnalyze")
    @Retry(name = "geminiService")
    public String analyze(String documentText) {
        int maxRetries = 3;
        int retryDelay = 3000;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                String prompt = buildPrompt(documentText);

                Map<String, Object> body = Map.of(
                        "model", "llama-3.3-70b-versatile",
                        "messages", List.of(
                                Map.of("role", "user", "content", prompt)
                        ),
                        "max_tokens", 4096,
                        "temperature", 0.1
                );

                String requestBody = objectMapper.writeValueAsString(body);

                HttpClient client = HttpClient.newHttpClient();
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(GROQ_URL))
                        .header("Authorization", "Bearer " + apiKey)
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                        .build();

                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
                log.info("[Groq] Status: {} (attempt {})", response.statusCode(), attempt);

                if (response.statusCode() == 429) {
                    log.warn("[Groq] Rate limit, retry {}/{}", attempt, maxRetries);
                    if (attempt < maxRetries) {
                        Thread.sleep((long) retryDelay * attempt);
                        continue;
                    }
                    throw new RuntimeException("Rate limit Groq");
                }

                if (response.statusCode() != 200) {
                    throw new RuntimeException("Groq API error: " + response.statusCode() + " - " + response.body());
                }

                return extractText(response.body());

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Interrupted", e);
            } catch (RuntimeException e) {
                if (attempt == maxRetries) throw new RuntimeException("Erreur Groq: " + e.getMessage(), e);
                log.warn("[Groq] Erreur attempt {}/{}: {}", attempt, maxRetries, e.getMessage());
            } catch (Exception e) {
                if (attempt == maxRetries) throw new RuntimeException("Erreur Groq: " + e.getMessage(), e);
                log.warn("[Groq] Erreur attempt {}/{}: {}", attempt, maxRetries, e.getMessage());
            }
        }
        throw new RuntimeException("Groq indisponible après " + maxRetries + " tentatives");
    }

    // ── ✅ Fallback — Circuit Breaker ouvert ──────────────────────────
    public String fallbackAnalyze(String documentText, Throwable throwable) {
        log.error("[Groq] Circuit Breaker ouvert ! Fallback activé. Cause: {}", throwable.getMessage());
        return "{" +
                "\"isValid\": false," +
                "\"reason\": \"Le service AI est temporairement indisponible. Veuillez réessayer dans quelques minutes.\"," +
                "\"documentQuality\": null," +
                "\"projectSummary\": null," +
                "\"tasks\": []," +
                "\"sprints\": []," +
                "\"risks\": []," +
                "\"humanResources\": []," +
                "\"materialResources\": []," +
                "\"timeline\": {\"startDate\": null, \"endDate\": null, \"phases\": [], \"justification\": null}," +
                "\"costEstimation\": {\"estimatedTotalCost\": null, \"currency\": null, \"breakdown\": [], \"assumptions\": null}," +
                "\"confidenceScore\": \"LOW\"" +
                "}";
    }

    private String extractText(String rawResponse) {
        try {
            var root = objectMapper.readTree(rawResponse);
            return root
                    .path("choices").get(0)
                    .path("message")
                    .path("content")
                    .asText();
        } catch (Exception e) {
            log.error("[Groq] Erreur parsing réponse", e);
            throw new RuntimeException("Erreur parsing réponse Groq");
        }
    }
}