package emsi.SmartFlow.TestUnitaire.controller.facade;

import emsi.SmartFlow.controller.facade.NotificationController;
import emsi.SmartFlow.entity.Notification;
import emsi.SmartFlow.service.NotificationService;
import emsi.SmartFlow.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class NotificationControllerTest {

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private NotificationController notificationController;

    private MockMvc mockMvc;
    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = mock(User.class);
        when(mockUser.getId()).thenReturn(1L);

        // standaloneSetup does NOT run Spring Security filters, so @AuthenticationPrincipal
        // resolves to null unless we register a custom resolver that injects our mock user.
        mockMvc = MockMvcBuilders
                .standaloneSetup(notificationController)
                .setCustomArgumentResolvers(new HandlerMethodArgumentResolver() {
                    @Override
                    public boolean supportsParameter(MethodParameter parameter) {
                        return User.class.isAssignableFrom(parameter.getParameterType());
                    }
                    @Override
                    public Object resolveArgument(MethodParameter parameter,
                                                  ModelAndViewContainer mavContainer,
                                                  NativeWebRequest webRequest,
                                                  WebDataBinderFactory binderFactory) {
                        return mockUser;
                    }
                })
                .build();
    }

    // ── GET /notifications ────────────────────────────────────────────

    @Test
    void getMyNotifications_returnsOkWithList() throws Exception {
        Notification n = new Notification();
        n.setId(1L);
        n.setMessage("Task assigned to you");
        n.setType("TASK_ASSIGNED");
        n.setRead(false);
        n.setCreatedAt(LocalDateTime.now());

        when(notificationService.getNotifications(1L)).thenReturn(List.of(n));

        mockMvc.perform(get("/notifications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.message").value("Notifications retrieved"))
                .andExpect(jsonPath("$.data").isArray());

        verify(notificationService).getNotifications(1L);
    }

    @Test
    void getMyNotifications_emptyList_returnsOk() throws Exception {
        when(notificationService.getNotifications(1L)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/notifications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isEmpty());
    }

    @Test
    void getMyNotifications_multipleNotifications() throws Exception {
        Notification n1 = new Notification();
        n1.setId(1L); n1.setMessage("Msg1"); n1.setType("TASK_ASSIGNED");
        n1.setRead(false); n1.setCreatedAt(LocalDateTime.now());

        Notification n2 = new Notification();
        n2.setId(2L); n2.setMessage("Msg2"); n2.setType("STATUS_CHANGED");
        n2.setRead(true); n2.setCreatedAt(LocalDateTime.now());

        when(notificationService.getNotifications(1L)).thenReturn(List.of(n1, n2));

        mockMvc.perform(get("/notifications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value(1))
                .andExpect(jsonPath("$.data[1].id").value(2));
    }

    // ── GET /notifications/unread-count ──────────────────────────────

    @Test
    void getUnreadCount_returnsCount() throws Exception {
        when(notificationService.getUnreadCount(1L)).thenReturn(3L);

        mockMvc.perform(get("/notifications/unread-count"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.count").value(3))
                .andExpect(jsonPath("$.message").value("Unread count"));
    }

    @Test
    void getUnreadCount_returnsZero() throws Exception {
        when(notificationService.getUnreadCount(1L)).thenReturn(0L);

        mockMvc.perform(get("/notifications/unread-count"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.count").value(0));
    }

    // ── PUT /notifications/{id}/read ──────────────────────────────────

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

//    @Test
//    void markAsRead_differentId() throws Exception {
//        doNothing().when(notificationService).markAsRead(42L);
//
//        mockMvc.perform(put("/notifications/42/read"))
//                .andExpect(status().isOk());
//
//        verify(notificationService).markAsRead(42L);
//    }

    // ── PUT /notifications/read-all ───────────────────────────────────

    @Test
    void markAllAsRead_returnsOk() throws Exception {
        doNothing().when(notificationService).markAllAsRead(1L);

        mockMvc.perform(put("/notifications/read-all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("All marked as read"));

        verify(notificationService).markAllAsRead(1L);
    }

    @Test
    void markAllAsRead_callsServiceWithCurrentUserId() throws Exception {
        doNothing().when(notificationService).markAllAsRead(1L);

        mockMvc.perform(put("/notifications/read-all"))
                .andExpect(status().isOk());

        verify(notificationService, times(1)).markAllAsRead(1L);
    }
}