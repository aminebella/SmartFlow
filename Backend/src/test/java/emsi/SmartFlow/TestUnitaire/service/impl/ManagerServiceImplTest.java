package emsi.SmartFlow.TestUnitaire.service.impl;

import emsi.SmartFlow.controller.converter.MemberConverter;
import emsi.SmartFlow.controller.dto.teams.MemeberSummaryResponse;
import emsi.SmartFlow.entity.Client;
import emsi.SmartFlow.repo.ClientRepo;
import emsi.SmartFlow.service.impl.ManagerServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ManagerServiceImplTest {

    @Mock
    private ClientRepo clientRepo;

    @Mock
    private MemberConverter memberConverter;

    @InjectMocks
    private ManagerServiceImpl managerService;

    private Client client1;
    private Client client2;

    @BeforeEach
    void setUp() {
        client1 = new Client();
        client1.setId(1L);
        client1.setEmail("alice@test.com");
        client1.setFirstname("Alice");
        client1.setLastname("Smith");

        client2 = new Client();
        client2.setId(2L);
        client2.setEmail("alice.bob@test.com");
        client2.setFirstname("Bob");
        client2.setLastname("Jones");
    }

    @Test
    void searchClientsByEmail_shouldReturnMatchingClients() {
        Long managerId = 99L;

        // MemeberSummaryResponse uses @Builder
        MemeberSummaryResponse response1 = MemeberSummaryResponse.builder()
                .id(1L).email("alice@test.com").fullName("Alice Smith").build();
        MemeberSummaryResponse response2 = MemeberSummaryResponse.builder()
                .id(2L).email("alice.bob@test.com").fullName("Bob Jones").build();

        // ClientRepo.findByEmailContainingIgnoreCase is the actual method name
        when(clientRepo.findByEmailContainingIgnoreCase("alice"))
                .thenReturn(List.of(client1, client2));
        when(memberConverter.toMemeberSummaryResponse(client1)).thenReturn(response1);
        when(memberConverter.toMemeberSummaryResponse(client2)).thenReturn(response2);

        List<MemeberSummaryResponse> result = managerService.searchClientsByEmail("alice", managerId);

        assertEquals(2, result.size());
        verify(clientRepo).findByEmailContainingIgnoreCase("alice");
    }

    @Test
    void searchClientsByEmail_shouldExcludeManagerFromResults() {
        Long managerId = 1L; // Same as client1's id

        MemeberSummaryResponse response2 = MemeberSummaryResponse.builder()
                .id(2L).email("alice.bob@test.com").fullName("Bob Jones").build();

        when(clientRepo.findByEmailContainingIgnoreCase("alice"))
                .thenReturn(List.of(client1, client2));
        // client1 is excluded (manager), only client2 is mapped
        when(memberConverter.toMemeberSummaryResponse(client2)).thenReturn(response2);

        List<MemeberSummaryResponse> result = managerService.searchClientsByEmail("alice", managerId);

        assertEquals(1, result.size());
        assertEquals(2L, result.get(0).getId());
        // client1 should never be converted since it's excluded
        verify(memberConverter, never()).toMemeberSummaryResponse(client1);
    }

    @Test
    void searchClientsByEmail_shouldReturnEmptyListWhenNoMatch() {
        Long managerId = 99L;
        when(clientRepo.findByEmailContainingIgnoreCase("xyz")).thenReturn(List.of());

        List<MemeberSummaryResponse> result = managerService.searchClientsByEmail("xyz", managerId);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verifyNoInteractions(memberConverter);
    }

    @Test
    void searchClientsByEmail_shouldReturnEmptyWhenAllResultsAreManager() {
        Long managerId = 1L; // Same id as client1
        when(clientRepo.findByEmailContainingIgnoreCase("alice"))
                .thenReturn(List.of(client1)); // Only the manager in results

        List<MemeberSummaryResponse> result = managerService.searchClientsByEmail("alice", managerId);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verifyNoInteractions(memberConverter);
    }

    @Test
    void searchClientsByEmail_caseInsensitiveQueryIsPassedThrough() {
        Long managerId = 99L;
        when(clientRepo.findByEmailContainingIgnoreCase("ALICE")).thenReturn(List.of());

        List<MemeberSummaryResponse> result = managerService.searchClientsByEmail("ALICE", managerId);

        assertTrue(result.isEmpty());
        // Verify the exact query is passed to repo (case insensitivity is handled by the repo method)
        verify(clientRepo).findByEmailContainingIgnoreCase("ALICE");
    }
}