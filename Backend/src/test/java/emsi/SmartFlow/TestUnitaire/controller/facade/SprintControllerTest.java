package emsi.SmartFlow.TestUnitaire.controller.facade;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import emsi.SmartFlow.controller.dto.sprint.SprintRequest;
import emsi.SmartFlow.controller.dto.sprint.SprintResponse;
import emsi.SmartFlow.controller.facade.SprintController;
import emsi.SmartFlow.entity.enums.SprintStatus;
import emsi.SmartFlow.service.facade.SprintService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class SprintControllerTest {

    @Mock
    private SprintService sprintService;

    @InjectMocks
    private SprintController sprintController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private SprintResponse sprint1;
    private SprintResponse sprint2;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(sprintController).build();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        sprint1 = new SprintResponse(1L, 10L, "Sprint 1", "Build auth", LocalDate.of(2025,5,1), LocalDate.of(2025,5,14), SprintStatus.PLANNED);
        sprint2 = new SprintResponse(2L, 10L, "Sprint 2", "Build dashboard", LocalDate.of(2025,5,15), LocalDate.of(2025,5,28), SprintStatus.ACTIVE);
    }

    // ── GET /projects/{projectId}/sprints ──────────────────────────────

    @Test
    void listByProject_returnsOkWithSprints() throws Exception {
        when(sprintService.listByProject(10L)).thenReturn(List.of(sprint1, sprint2));

        mockMvc.perform(get("/projects/10/sprints"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].title").value("Sprint 1"))
                .andExpect(jsonPath("$.data[1].title").value("Sprint 2"))
                .andExpect(jsonPath("$.message").value("Sprints récupérés"));
    }

    @Test
    void listByProject_emptyList_returnsOk() throws Exception {
        when(sprintService.listByProject(10L)).thenReturn(List.of());

        mockMvc.perform(get("/projects/10/sprints"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isEmpty());
    }

    // ── GET /sprints/{id} ─────────────────────────────────────────────

    @Test
    void getById_returnsSprintData() throws Exception {
        when(sprintService.getById(1L)).thenReturn(sprint1);

        mockMvc.perform(get("/sprints/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.title").value("Sprint 1"))
                .andExpect(jsonPath("$.data.status").value("PLANNED"));
    }

    // ── POST /projects/{projectId}/sprints ────────────────────────────

    @Test
    void create_returnsCreatedStatus() throws Exception {
        SprintRequest req = new SprintRequest("Sprint 3", "Deploy", LocalDate.of(2025,6,1), LocalDate.of(2025,6,14), SprintStatus.PLANNED);
        SprintResponse created = new SprintResponse(3L, 10L, "Sprint 3", "Deploy", LocalDate.of(2025,6,1), LocalDate.of(2025,6,14), SprintStatus.PLANNED);

        when(sprintService.create(eq(10L), any(SprintRequest.class))).thenReturn(created);

        mockMvc.perform(post("/projects/10/sprints")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.title").value("Sprint 3"))
                .andExpect(jsonPath("$.message").value("Sprint créé"));
    }

//    @Test
//    void create_missingTitle_returnsBadRequest() throws Exception {
//        // title is @NotBlank — send empty title
//        SprintRequest bad = new SprintRequest("", "Goal", null, null, null);
//
//        mockMvc.perform(post("/projects/10/sprints")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(bad)))
//                .andExpect(status().isBadRequest());
//
//        verifyNoInteractions(sprintService);
//    }

    // ── PUT /sprints/{id} ─────────────────────────────────────────────

    @Test
    void update_returnsUpdatedSprint() throws Exception {
        SprintRequest req = new SprintRequest("Sprint 1 Updated", "New goal", null, null, SprintStatus.ACTIVE);
        SprintResponse updated = new SprintResponse(1L, 10L, "Sprint 1 Updated", "New goal", null, null, SprintStatus.ACTIVE);

        when(sprintService.update(eq(1L), any(SprintRequest.class))).thenReturn(updated);

        mockMvc.perform(put("/sprints/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("Sprint 1 Updated"))
                .andExpect(jsonPath("$.message").value("Sprint modifié"));
    }

    // ── DELETE /sprints/{id} ──────────────────────────────────────────

    @Test
    void delete_returnsOkWithMessage() throws Exception {
        doNothing().when(sprintService).delete(1L);

        mockMvc.perform(delete("/sprints/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Sprint supprimé"));

        verify(sprintService).delete(1L);
    }

    // ── POST /sprints/{id}/start ──────────────────────────────────────

    @Test
    void startSprint_returnsActiveStatus() throws Exception {
        SprintResponse active = new SprintResponse(1L, 10L, "Sprint 1", "Build auth", LocalDate.of(2025,5,1), LocalDate.of(2025,5,14), SprintStatus.ACTIVE);
        when(sprintService.startSprint(1L)).thenReturn(active);

        mockMvc.perform(post("/sprints/1/start"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("ACTIVE"))
                .andExpect(jsonPath("$.message").value("Sprint démarré"));
    }

    // ── POST /sprints/{id}/complete ───────────────────────────────────

    @Test
    void completeSprint_returnsCompletedStatus() throws Exception {
        SprintResponse completed = new SprintResponse(2L, 10L, "Sprint 2", "Build dashboard", LocalDate.of(2025,5,15), LocalDate.of(2025,5,28), SprintStatus.COMPLETED);
        when(sprintService.completeSprint(2L)).thenReturn(completed);

        mockMvc.perform(post("/sprints/2/complete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("COMPLETED"))
                .andExpect(jsonPath("$.message").value("Sprint terminé"));
    }
}