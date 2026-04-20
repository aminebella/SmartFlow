package emsi.SmartFlow.auth;

import emsi.SmartFlow.email.EmailService;
import emsi.SmartFlow.entity.Admin;
import emsi.SmartFlow.entity.Client;
import emsi.SmartFlow.role.Role;
import emsi.SmartFlow.role.RoleRepository;
import emsi.SmartFlow.security.JwtService;
import emsi.SmartFlow.user.Token;
import emsi.SmartFlow.user.TokenRepository;
import emsi.SmartFlow.user.User;
import emsi.SmartFlow.user.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthenticateService {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenRepository tokenRepository;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;


    public ResponseEntity<?> register(RegistrationRequest request) throws MessagingException {
        request.validateRoleSpecificFields();


        if (request.isAdmin()) {
            Admin admin = Admin.builder()
                    .firstname(request.getFirstname())
                    .lastname(request.getLastname())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .accountLocked(false)
                    .enabled(false)
                    .build();

            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseThrow(() -> new IllegalStateException("ADMIN role not found"));
            admin.setRoles(List.of(adminRole));
            userRepository.save(admin);
            emailService.sendValidationEmail(admin);
        } else {
            Client client = Client.builder()
                    .firstname(request.getFirstname())
                    .lastname(request.getLastname())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .accountLocked(false)
                    .enabled(false)
                    .bio(request.getBio())
                    .build();

            Role clientRole = roleRepository.findByName("CLIENT")
                    .orElseThrow(() -> new IllegalStateException("CLIENT role not found"));
            client.setRoles(List.of(clientRole));
            userRepository.save(client);
            emailService.sendValidationEmail(client);
        }

        Map<String,String> responseMessage = new HashMap<>();
        String role = request.isAdmin() ? "ADMIN " : "CLIENT";
        responseMessage.put("message", STR."Registration successful with role :  \{role} ! ");
        return ResponseEntity.accepted().body(responseMessage);
    }


    @Transactional
    public void deleteAllUsers(){
        tokenRepository.deleteAll();
        userRepository.deleteAll();
    }



    public void authenticate(AuthenticateRequest request, HttpServletResponse response) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var claims = new HashMap<String, Object>();
        var user = (User) auth.getPrincipal();
        claims.put("fullName", user.getFullName());

        var jwtToken = jwtService.generateToken(claims, user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);

        ResponseCookie cookie = ResponseCookie.from("jwt", jwtToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Duration.ofDays(1))
                .sameSite("Strict")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
    private void saveUserToken(User user, String jwtToken) {
        Token token = Token.builder()
                .user(user)
                .token(jwtToken)
                .expired(false)
                .revoked(false)
                .build();

        tokenRepository.save(token);
    }
    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }


    @Transactional
    public void activateAccount(String token) throws MessagingException {
    Token savedToken = tokenRepository.findByToken(token)
            .orElseThrow(() -> new RuntimeException(("invalid token")));
    if (LocalDateTime.now().isAfter(savedToken.getExpiredAt())){
        emailService.sendValidationEmail(savedToken.getUser());
        throw new RuntimeException("Activation token has expired. A new token has been send !");
    }
    var user = userRepository.findById(savedToken.getUser().getId())
            .orElseThrow(()->new UsernameNotFoundException("user not found"));
    user.setEnabled(true);
    userRepository.save(user);
    savedToken.setValidateAt(LocalDateTime.now());
    tokenRepository.save(savedToken);
    }
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        // Find the JWT from the cookie
        String jwt = extractJwtFromCookies(request);

        if (jwt != null) {
            tokenRepository.findByToken(jwt).ifPresent(token -> {
                token.setExpired(true);
                token.setRevoked(true);
                tokenRepository.save(token);
            });
        }

        // Overwrite the cookie with an empty value and maxAge=0 to delete it
        ResponseCookie deleteCookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false)           // Match your login cookie settings
                .path("/")
                .maxAge(0)               // Immediately expires the cookie
                .sameSite("Strict")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());
        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }

    private String extractJwtFromCookies(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> "jwt".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
    public UserResponse getCurrentUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        List<String> roles = user.getRoles()
                .stream()
                .map(role -> role.getName())
                .toList();

        return UserResponse.builder()
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(roles)
                .build();
    }

}
