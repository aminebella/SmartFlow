package emsi.SmartFlow.TestUnitaire.email;

import emsi.SmartFlow.email.EmailService;
import emsi.SmartFlow.email.EmailTemplateName;
import emsi.SmartFlow.user.Token;
import emsi.SmartFlow.user.TokenRepository;
import emsi.SmartFlow.user.User;
import emsi.SmartFlow.user.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private SpringTemplateEngine templateEngine;

    @Mock
    private TokenRepository tokenRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        // inject the @Value field since we are not loading Spring context
        ReflectionTestUtils.setField(emailService, "activationUrl", "http://localhost:4200/activate");
    }

    // ─── generateActiveCode (covered via sendValidationEmail) ────────────────

    @Test
    void generateActiveCode_tokenSavedWith6DigitCode() throws MessagingException {
        User user = buildUser();
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(anyString(), any(Context.class))).thenReturn("<html>test</html>");

        emailService.sendValidationEmail(user);

        // capture the token saved to repository
        ArgumentCaptor<Token> tokenCaptor = ArgumentCaptor.forClass(Token.class);
        verify(tokenRepository).save(tokenCaptor.capture());

        String savedCode = tokenCaptor.getValue().getToken();
        assertNotNull(savedCode);
        assertEquals(6, savedCode.length());
        assertTrue(savedCode.matches("[0-9]{6}"), "Code must be digits only");
    }

    // ─── sendValidationEmail ─────────────────────────────────────────────────

    @Test
    void sendValidationEmail_success_savesTokenAndSendsEmail() throws MessagingException {
        User user = buildUser();
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(anyString(), any(Context.class))).thenReturn("<html>test</html>");

        emailService.sendValidationEmail(user);

        verify(tokenRepository, times(1)).save(any(Token.class));
        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }

    @Test
    void sendValidationEmail_whenMailFails_deletesTokenAndUserThenRethrows() throws MessagingException {
        User user = buildUser();
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(anyString(), any(Context.class))).thenReturn("<html>test</html>");

        // simulate mail failure
        doThrow(new MailSendException("SMTP down")).when(mailSender).send(any(MimeMessage.class));

        assertThrows(MessagingException.class, () -> emailService.sendValidationEmail(user));

        verify(tokenRepository).deleteByUserId(user.getId());
        verify(userRepository).deleteById(user.getId());
    }

    // ─── sendEmail ───────────────────────────────────────────────────────────

    @Test
    void sendEmail_nullTemplate_usesDefaultTemplateName() throws MessagingException {
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(eq("confirm-email"), any(Context.class)))
                .thenReturn("<html>confirm</html>");

        emailService.sendEmail(
                "test@test.com",
                "TestUser",
                null,                        // null → should fallback to "confirm-email"
                "http://confirm.url",
                "123456",
                "Confirm your email"
        );

        verify(templateEngine).process(eq("confirm-email"), any(Context.class));
    }

    @Test
    void sendEmail_withTemplate_usesEnumName() throws MessagingException {
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(eq("ACTIVATE_ACCOUNT"), any(Context.class)))
                .thenReturn("<html>activate</html>");

        emailService.sendEmail(
                "test@test.com",
                "TestUser",
                EmailTemplateName.ACTIVATE_ACCOUNT,
                "http://activate.url",
                "654321",
                "Activate your account"
        );

        verify(templateEngine).process(eq("ACTIVATE_ACCOUNT"), any(Context.class));
    }

    @Test
    void sendEmail_whenMailSenderThrows_wrapsInMessagingException() throws MessagingException {
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(anyString(), any(Context.class))).thenReturn("<html/>");
        doThrow(new MailSendException("SMTP error")).when(mailSender).send(any(MimeMessage.class));

        MessagingException ex = assertThrows(MessagingException.class, () ->
                emailService.sendEmail(
                        "fail@test.com", "User",
                        EmailTemplateName.ACTIVATE_ACCOUNT,
                        "http://url", "000000", "Subject"
                )
        );

        assertTrue(ex.getMessage().contains("Failed to send email"));
    }

    // ─── helper ──────────────────────────────────────────────────────────────

    private User buildUser() {
        User user = new User();
        user.setId(1L);
        user.setEmail("user@test.com");
        // use whatever your User getter is — getFullName() or getFirstname() + getLastname()
        user.setFirstname("Test");
        user.setLastname("User");
        return user;
    }
}