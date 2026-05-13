package emsi.SmartFlow.TestUnitaire.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import emsi.SmartFlow.service.impl.GeminiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for GeminiService (which internally calls Groq API).
 * Real HTTP calls are NOT made here. We test:
 * 1. The fallback method (circuit breaker open)
 * 2. That fallback returns valid JSON with correct structure
 */
@ExtendWith(MockitoExtension.class)
class GeminiServiceTest {

    @InjectMocks
    private GeminiService geminiService;

    private final ObjectMapper mapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        // Inject a dummy API key to avoid NullPointerException on @Value field
        ReflectionTestUtils.setField(geminiService, "apiKey", "test-api-key-unit");
    }

    @Test
    void fallbackAnalyze_shouldReturnValidJsonString() {
        String fallback = geminiService.fallbackAnalyze("doc text",
                new RuntimeException("Circuit open"));

        assertNotNull(fallback);
        // Must be parseable JSON
        assertDoesNotThrow(() -> mapper.readTree(fallback));
    }

    @Test
    void fallbackAnalyze_shouldReturnIsValidFalse() throws Exception {
        String fallback = geminiService.fallbackAnalyze("doc text",
                new RuntimeException("Timeout"));

        var json = mapper.readTree(fallback);
        assertFalse(json.path("isValid").asBoolean(true));
    }

    @Test
    void fallbackAnalyze_shouldReturnConfidenceScoreLow() throws Exception {
        String fallback = geminiService.fallbackAnalyze("doc text",
                new RuntimeException("Rate limit"));

        var json = mapper.readTree(fallback);
        assertEquals("LOW", json.path("confidenceScore").asText());
    }

    @Test
    void fallbackAnalyze_shouldReturnEmptyArraysForCollections() throws Exception {
        String fallback = geminiService.fallbackAnalyze("doc text",
                new RuntimeException("Service unavailable"));

        var json = mapper.readTree(fallback);
        assertTrue(json.path("tasks").isArray());
        assertEquals(0, json.path("tasks").size());

        assertTrue(json.path("sprints").isArray());
        assertEquals(0, json.path("sprints").size());

        assertTrue(json.path("risks").isArray());
        assertEquals(0, json.path("risks").size());

        assertTrue(json.path("humanResources").isArray());
        assertEquals(0, json.path("humanResources").size());

        assertTrue(json.path("materialResources").isArray());
        assertEquals(0, json.path("materialResources").size());
    }

    @Test
    void fallbackAnalyze_shouldContainNullFieldsForSummaryAndQuality() throws Exception {
        String fallback = geminiService.fallbackAnalyze("doc text",
                new RuntimeException("Network error"));

        var json = mapper.readTree(fallback);
        // documentQuality and projectSummary should be null
        assertTrue(json.path("documentQuality").isNull());
        assertTrue(json.path("projectSummary").isNull());
    }

    @Test
    void fallbackAnalyze_shouldContainTimelineAndCostWithNulls() throws Exception {
        String fallback = geminiService.fallbackAnalyze("doc text",
                new RuntimeException("Error"));

        var json = mapper.readTree(fallback);
        // timeline object should exist with null startDate/endDate
        assertFalse(json.path("timeline").isMissingNode());
        assertTrue(json.path("timeline").path("startDate").isNull());
        assertTrue(json.path("timeline").path("endDate").isNull());

        // costEstimation object should exist with null estimatedTotalCost
        assertFalse(json.path("costEstimation").isMissingNode());
        assertTrue(json.path("costEstimation").path("estimatedTotalCost").isNull());
    }
}