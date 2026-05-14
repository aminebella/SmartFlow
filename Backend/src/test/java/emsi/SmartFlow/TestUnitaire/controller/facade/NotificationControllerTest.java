//package emsi.SmartFlow.TestUnitaire.controller.facade;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import emsi.SmartFlow.controller.facade.NotificationController;
//import emsi.SmartFlow.entity.Notification;
//import emsi.SmartFlow.service.NotificationService;
//import emsi.SmartFlow.user.User;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.setup.MockMvcBuilders;
//
//import java.time.LocalDateTime;
//import java.util.Collections;
//import java.util.List;
//
//import static org.mockito.ArgumentMatchers.*;
//import static org.mockito.Mockito.*;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@ExtendWith(MockitoExtension.class)
//class NotificationControllerTest {
//
//    @Mock
//    private NotificationService notificationService;
//
//    @InjectMocks
//    private NotificationController notificationController;
//
//    private MockMvc mockMvc;
//    private User mockUser;
//
//    @BeforeEach
//    void setUp() {
//        mockMvc = MockMvcBuilders.standaloneSetup(notificationController).build();
//
//        mockUser = mock(User.class);
//        when(mockUser.getId()).thenReturn(1L);
//
//        SecurityContextHolder.getContext().setAuthentication(
//                new UsernamePasswordAuthenticationToken(mockUser, null, Collections.emptyList())
//        );
//    }
//
//    // ── GET /notifications ────────────────────────────────────────────
//
//    @Test
//    void getMyNotifications_returnsOkWithList() throws Exception {
//        Notification n = new Notification();
//        n.setId(1L);
//        n.setMessage("Task assigned to you");
//        n.setType("TASK_ASSIGNED");
//        n.setRead(false);
//        n.setCreatedAt(LocalDateTime.now());
//
//        when(notificationService.getNotifications(1L)).thenReturn(List.of(n));
//
//        mockMvc.perform(get("/notifications"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data").isArray())
//                .andExpect(jsonPath("$.status").value(200))
//                .andExpect(jsonPath("$.message").value("Notifications retrieved"));
//    }
//
//    @Test
//    void getMyNotifications_emptyList_returnsOk() throws Exception {
//        when(notificationService.getNotifications(1L)).thenReturn(Collections.emptyList());
//
//        mockMvc.perform(get("/notifications"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data").isEmpty());
//    }
//
//    // ── GET /notifications/unread-count ──────────────────────────────
//
//    @Test
//    void getUnreadCount_returnsCount() throws Exception {
//        when(notificationService.getUnreadCount(1L)).thenReturn(3L);
//
//        mockMvc.perform(get("/notifications/unread-count"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data.count").value(3))
//                .andExpect(jsonPath("$.message").value("Unread count"));
//    }
//
//    @Test
//    void getUnreadCount_zero_returnsZero() throws Exception {
//        when(notificationService.getUnreadCount(1L)).thenReturn(0L);
//
//        mockMvc.perform(get("/notifications/unread-count"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data.count").value(0));
//    }
//
//    // ── PUT /notifications/{id}/read ──────────────────────────────────
//
//    @Test
//    void markAsRead_returnsOk() throws Exception {
//        doNothing().when(notificationService).markAsRead(5L);
//
//        mockMvc.perform(put("/notifications/5/read"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.message").value("Marked as read"));
//
//        verify(notificationService).markAsRead(5L);
//    }
//
//    // ── PUT /notifications/read-all ───────────────────────────────────
//
//    @Test
//    void markAllAsRead_returnsOk() throws Exception {
//        doNothing().when(notificationService).markAllAsRead(1L);
//
//        mockMvc.perform(put("/notifications/read-all"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.message").value("All marked as read"));
//
//        verify(notificationService).markAllAsRead(1L);
//    }
//}