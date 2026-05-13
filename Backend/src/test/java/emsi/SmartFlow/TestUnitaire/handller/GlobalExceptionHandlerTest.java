package emsi.SmartFlow.TestUnitaire.handller;

import emsi.SmartFlow.exception.ResourceNotFoundException;
import emsi.SmartFlow.handller.ExceptionResponse;
import emsi.SmartFlow.handller.GlobalExceptionHandler;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    // ─── LockedException ─────────────────────────────────────────────────────

    @Test
    void handleLockedException_returns401WithBusinessCode() {
        LockedException ex = new LockedException("Account locked");
        ResponseEntity<ExceptionResponse> response = handler.handleException(ex);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getBusinessErrorCode());
    }

    // ─── DisabledException ───────────────────────────────────────────────────

    @Test
    void handleDisabledException_returns401WithBusinessCode() {
        DisabledException ex = new DisabledException("Account disabled");
        ResponseEntity<ExceptionResponse> response = handler.handleException(ex);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody().getBusinessErrorCode());
    }

    // ─── BadCredentialsException ─────────────────────────────────────────────

    @Test
    void handleBadCredentials_returns401WithBusinessCode() {
        BadCredentialsException ex = new BadCredentialsException("Bad credentials");
        ResponseEntity<ExceptionResponse> response = handler.handleException(ex);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody().getBusinessErrorCode());
    }

    // ─── MessagingException ──────────────────────────────────────────────────

    @Test
    void handleMessagingException_returns500WithErrorMessage() throws MessagingException {
        MessagingException ex = new MessagingException("Mail failed");
        ResponseEntity<ExceptionResponse> response = handler.handleException(ex);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Mail failed", response.getBody().getError());
    }

    // ─── MethodArgumentNotValidException ─────────────────────────────────────

    @Test
    void handleValidationException_returns400WithValidationErrors() {
        BindingResult bindingResult = mock(BindingResult.class);
        when(bindingResult.getAllErrors()).thenReturn(List.of(
                new ObjectError("field1", "must not be blank"),
                new ObjectError("field2", "invalid email")
        ));
        MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
        when(ex.getBindingResult()).thenReturn(bindingResult);

        ResponseEntity<ExceptionResponse> response = handler.handleException(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody().getValidationErrors());
        assertEquals(2, response.getBody().getValidationErrors().size());
        assertTrue(response.getBody().getValidationErrors().contains("must not be blank"));
    }

    // ─── Generic Exception ───────────────────────────────────────────────────

    @Test
    void handleGenericException_returns500WithAdminMessage() {
        Exception ex = new RuntimeException("Something broke");
        ResponseEntity<ExceptionResponse> response = handler.handleException(ex);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Internal error ,contact the admin ", response.getBody().getBusinessErrorDescription());
        assertEquals("Something broke", response.getBody().getError());
    }

    // ─── ResourceNotFoundException ───────────────────────────────────────────

    @Test
    void handleResourceNotFoundException_returns404() {
        ResourceNotFoundException ex = new ResourceNotFoundException("Resource not found");
        ResponseEntity<ExceptionResponse> response = handler.handleException(ex);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Not found", response.getBody().getBusinessErrorDescription());
        assertEquals("Resource not found", response.getBody().getError());
    }
}