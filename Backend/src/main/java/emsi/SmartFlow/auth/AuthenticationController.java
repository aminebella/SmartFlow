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

    @RestController// → This class handles HTTP requests, returns JSON
    @RequestMapping("auth") // → All routes here start with /api/v1/auth/
    @RequiredArgsConstructor
    @Tag(name = "Authentication")
    public class AuthenticationController {
        private final AuthenticateService authenticateService;

        @PostMapping(path = "/register" )
        @ResponseStatus(HttpStatus.ACCEPTED)
        public ResponseEntity<?> register(@RequestBody @Valid RegistrationRequest request) throws MessagingException {
            // → POST /api/v1/auth/register
            // → @RequestBody = read JSON from request body
            // → @Valid = run the validation annotations in RegistrationRequest
            return authenticateService.register(request);
        }


        @DeleteMapping("/")
        public void deleteAllUsers(){
            authenticateService.deleteAllUsers();
        }


        @PostMapping("/login")
        public ResponseEntity<?> authenticate(@RequestBody @Valid AuthenticateRequest request, HttpServletResponse response){
            // → POST /api/v1/auth/authenticate = login endpoint
            authenticateService.authenticate(request, response);
            return ResponseEntity.ok(Map.of("message", "Login successful"));
        }


        @GetMapping("/activate-account")
        public void confirm(@RequestParam String token) throws MessagingException {
            // → GET /api/v1/auth/activate-account?token=123456
            // → Called when user clicks email activation link
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
