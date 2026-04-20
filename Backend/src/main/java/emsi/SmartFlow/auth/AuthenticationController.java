package emsi.SmartFlow.auth;

import emsi.SmartFlow.user.User;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
    @RequestMapping("auth")
    @RequiredArgsConstructor
    @Tag(name = "Authentication")
    public class AuthenticationController {
        private final AuthenticateService authenticateService;

        @PostMapping(path = "/register" )
        @ResponseStatus(HttpStatus.ACCEPTED)
        public ResponseEntity<?> register(
               @RequestBody @Valid RegistrationRequest request
        ) throws MessagingException {
            return authenticateService.register(request);
        }

        @DeleteMapping("/")
        public void deleteAllUsers(){
            authenticateService.deleteAllUsers();
        }

        // AuthenticationController.java
        @PostMapping("/login")
        public ResponseEntity<?> authenticate(
                @RequestBody @Valid AuthenticateRequest request,
                HttpServletResponse response
        ) {
            authenticateService.authenticate(request, response);
            return ResponseEntity.ok(Map.of("message", "Login successful"));
        }

        @GetMapping("/activate-account")
        public void confirm(
                @RequestParam String token
        ) throws MessagingException {
            authenticateService.activateAccount(token);
        }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok(authenticateService.getCurrentUser(authentication));
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        return authenticateService.logout(request, response);
    }
    }
