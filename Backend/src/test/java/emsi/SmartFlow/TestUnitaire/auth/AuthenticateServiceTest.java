package emsi.SmartFlow.TestUnitaire.auth;

import static org.junit.jupiter.api.Assertions.*;

import emsi.SmartFlow.auth.AuthenticateRequest;
import emsi.SmartFlow.auth.AuthenticateService;
import emsi.SmartFlow.auth.RegistrationRequest;
import emsi.SmartFlow.auth.UserResponse;
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
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
        import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.Authentication;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
        import static org.mockito.ArgumentMatchers.*;
        import static org.mockito.Mockito.*;

/**
 * Tests unitaires pour AuthenticateService.
 *
 * STRATÉGIE POUR LES CONTRAINTES JAKARTA :
 * ─────────────────────────────────────────
 * Les annotations @Email, @NotEmpty, @NotNull, @Size sur AuthenticateRequest
 * et RegistrationRequest ne sont activées que par le validateur Bean Validation
 * (déclenché par Spring MVC via @Valid dans le contrôleur).
 *
 * Dans les tests unitaires du SERVICE, on instancie les objets directement
 * via leur Builder Lombok → les contraintes Jakarta ne sont PAS évaluées.
 * Cela permet de tester la logique métier indépendamment de la validation HTTP.
 *
 * Pour tester la validation elle-même, il faudrait des tests d'intégration
 * (MockMvc + @WebMvcTest) ou utiliser le ValidatorFactory manuellement.
 */
@ExtendWith(MockitoExtension.class)
class AuthenticateServiceTest {

    // ── Mocks ────────────────────────────────────────────────────────────────
    @Mock private RoleRepository      roleRepository;
    @Mock private UserRepository      userRepository;
    @Mock private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    @Mock private TokenRepository     tokenRepository;
    @Mock private EmailService        emailService;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtService          jwtService;

    @InjectMocks
    private AuthenticateService authenticateService;

    // ── Helpers ──────────────────────────────────────────────────────────────

    /**
     * Crée un AuthenticateRequest VALIDE via le Builder.
     * Les contraintes Jakarta (@Email, @NotEmpty…) ne sont PAS déclenchées ici :
     * elles s'appliquent uniquement lors du parsing HTTP (@Valid dans le contrôleur).
     */
    private AuthenticateRequest validAuthRequest() {
        return AuthenticateRequest.builder()
                .email("user@example.com")
                .password("SecurePass1!")
                .build();
    }

    /**
     * Crée un RegistrationRequest pour un CLIENT valide via le Builder.
     */
    private RegistrationRequest clientRegistrationRequest() {
        return RegistrationRequest.builder()
                .firstname("Alice")
                .lastname("Dupont")
                .email("alice@example.com")
                .password("SecurePass1!")
                .postTitle("Développeuse")
                .isAdmin(false)
                .isClient(true)
                .build();
    }

    /**
     * Crée un RegistrationRequest pour un ADMIN valide via le Builder.
     */
    private RegistrationRequest adminRegistrationRequest() {
        return RegistrationRequest.builder()
                .firstname("Bob")
                .lastname("Admin")
                .email("bob@example.com")
                .password("SecurePass1!")
                .isAdmin(true)
                .isClient(false)
                .build();
    }

    // ═════════════════════════════════════════════════════════════════════════
    // register()
    // ═════════════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("register()")
    class RegisterTests {

        @Test
        @DisplayName("Email déjà existant → 409 CONFLICT avec message d'erreur")
        void register_duplicateEmail_returns409() throws MessagingException {
            RegistrationRequest req = clientRegistrationRequest();
            when(userRepository.findByEmail(req.getEmail()))
                    .thenReturn(Optional.of(mock(User.class)));

            ResponseEntity<?> response = authenticateService.register(req);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
            assertThat(response.getBody()).isInstanceOf(Map.class);
            assertThat(((Map<?, ?>) response.getBody()).get("error"))
                    .isEqualTo("Email already exists");
        }

        @Test
        @DisplayName("Inscription CLIENT réussie → 202 ACCEPTED + rôle CLIENT")
        void register_newClient_returns202() throws MessagingException {
            RegistrationRequest req = clientRegistrationRequest();
            when(userRepository.findByEmail(req.getEmail())).thenReturn(Optional.empty());
            when(passwordEncoder.encode(req.getPassword())).thenReturn("encodedPwd");

            Role clientRole = new Role();
            clientRole.setName("CLIENT");
            when(roleRepository.findByName("CLIENT")).thenReturn(Optional.of(clientRole));

            ResponseEntity<?> response = authenticateService.register(req);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.ACCEPTED);
            verify(userRepository).save(any(Client.class));
            verify(emailService).sendValidationEmail(any(Client.class));
        }

        @Test
        @DisplayName("Inscription ADMIN réussie → 202 ACCEPTED + rôle ADMIN")
        void register_newAdmin_returns202() throws MessagingException {
            RegistrationRequest req = adminRegistrationRequest();
            when(userRepository.findByEmail(req.getEmail())).thenReturn(Optional.empty());
            when(passwordEncoder.encode(req.getPassword())).thenReturn("encodedPwd");

            Role adminRole = new Role();
            adminRole.setName("ADMIN");
            when(roleRepository.findByName("ADMIN")).thenReturn(Optional.of(adminRole));

            ResponseEntity<?> response = authenticateService.register(req);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.ACCEPTED);
            verify(userRepository).save(any(Admin.class));
            verify(emailService).sendValidationEmail(any(Admin.class));
        }

        @Test
        @DisplayName("Rôle ADMIN introuvable en BDD → IllegalStateException")
        void register_adminRoleMissing_throwsIllegalState() {
            RegistrationRequest req = adminRegistrationRequest();
            when(userRepository.findByEmail(req.getEmail())).thenReturn(Optional.empty());
            when(passwordEncoder.encode(any())).thenReturn("encoded");
            when(roleRepository.findByName("ADMIN")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> authenticateService.register(req))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("ADMIN role not found");
        }

        @Test
        @DisplayName("Rôle CLIENT introuvable en BDD → IllegalStateException")
        void register_clientRoleMissing_throwsIllegalState() {
            RegistrationRequest req = clientRegistrationRequest();
            when(userRepository.findByEmail(req.getEmail())).thenReturn(Optional.empty());
            when(passwordEncoder.encode(any())).thenReturn("encoded");
            when(roleRepository.findByName("CLIENT")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> authenticateService.register(req))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("CLIENT role not found");
        }

        @Test
        @DisplayName("Le mot de passe est bien encodé avant la persistance")
        void register_passwordIsEncoded() throws MessagingException {
            RegistrationRequest req = clientRegistrationRequest();
            when(userRepository.findByEmail(req.getEmail())).thenReturn(Optional.empty());
            when(passwordEncoder.encode("SecurePass1!")).thenReturn("$2a$HASHED");
            Role role = new Role(); role.setName("CLIENT");
            when(roleRepository.findByName("CLIENT")).thenReturn(Optional.of(role));

            authenticateService.register(req);

            ArgumentCaptor<Client> captor = ArgumentCaptor.forClass(Client.class);
            verify(userRepository).save(captor.capture());
            assertThat(captor.getValue().getPassword()).isEqualTo("$2a$HASHED");
        }

        @Test
        @DisplayName("Le compte est désactivé (enabled=false) à la création")
        void register_accountStartsDisabled() throws MessagingException {
            RegistrationRequest req = clientRegistrationRequest();
            when(userRepository.findByEmail(req.getEmail())).thenReturn(Optional.empty());
            when(passwordEncoder.encode(any())).thenReturn("encoded");
            Role role = new Role(); role.setName("CLIENT");
            when(roleRepository.findByName("CLIENT")).thenReturn(Optional.of(role));

            authenticateService.register(req);

            ArgumentCaptor<Client> captor = ArgumentCaptor.forClass(Client.class);
            verify(userRepository).save(captor.capture());
            assertThat(captor.getValue().isEnabled()).isFalse();
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // authenticate()
    // ═════════════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("authenticate()")
    class AuthenticateTests {

        @Mock private HttpServletResponse httpResponse;

        @Test
        @DisplayName("Credentials valides → JWT généré, cookie positionné, token sauvegardé")
        void authenticate_validCredentials_savesTokenAndSetsCookie() {
            AuthenticateRequest req = validAuthRequest();

            User mockUser = mock(User.class);
            when(mockUser.getFullName()).thenReturn("Alice Dupont");
            when(mockUser.getId()).thenReturn(1L);

            Authentication auth = mock(Authentication.class);
            when(auth.getPrincipal()).thenReturn(mockUser);
            when(authenticationManager.authenticate(any())).thenReturn(auth);
            when(jwtService.generateToken(any(), eq(mockUser))).thenReturn("jwt-token-xyz");
            when(tokenRepository.findAllValidTokenByUser(1L)).thenReturn(Collections.emptyList());

            authenticateService.authenticate(req, httpResponse);

            verify(tokenRepository).save(argThat(t ->
                    "jwt-token-xyz".equals(t.getToken()) && !t.isExpired() && !t.isRevoked()
            ));
            verify(httpResponse).addHeader(eq("Set-Cookie"), contains("jwt=jwt-token-xyz"));
        }

        @Test
        @DisplayName("Mauvais mot de passe → BadCredentialsException propagée")
        void authenticate_badPassword_throwsBadCredentials() {
            AuthenticateRequest req = validAuthRequest();
            when(authenticationManager.authenticate(any()))
                    .thenThrow(new BadCredentialsException("Bad credentials"));

            assertThatThrownBy(() -> authenticateService.authenticate(req, httpResponse))
                    .isInstanceOf(BadCredentialsException.class);
        }

        @Test
        @DisplayName("Compte désactivé → DisabledException propagée")
        void authenticate_disabledAccount_throwsDisabledException() {
            AuthenticateRequest req = validAuthRequest();
            when(authenticationManager.authenticate(any()))
                    .thenThrow(new DisabledException("Account disabled"));

            assertThatThrownBy(() -> authenticateService.authenticate(req, httpResponse))
                    .isInstanceOf(DisabledException.class);
        }

        @Test
        @DisplayName("Les anciens tokens valides sont révoqués avant d'en créer un nouveau")
        void authenticate_revokesOldTokensBeforeSavingNew() {
            AuthenticateRequest req = validAuthRequest();

            User mockUser = mock(User.class);
            when(mockUser.getId()).thenReturn(42L);
            when(mockUser.getFullName()).thenReturn("Bob");

            Token oldToken = Token.builder().token("old-jwt").expired(false).revoked(false).build();
            Authentication auth = mock(Authentication.class);
            when(auth.getPrincipal()).thenReturn(mockUser);
            when(authenticationManager.authenticate(any())).thenReturn(auth);
            when(jwtService.generateToken(any(), any())).thenReturn("new-jwt");
            when(tokenRepository.findAllValidTokenByUser(42L)).thenReturn(List.of(oldToken));

            authenticateService.authenticate(req, httpResponse);

            assertThat(oldToken.isExpired()).isTrue();
            assertThat(oldToken.isRevoked()).isTrue();
            verify(tokenRepository).saveAll(List.of(oldToken));
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // activateAccount()
    // ═════════════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("activateAccount()")
    class ActivateAccountTests {

        @Test
        @DisplayName("Token valide → compte activé, token marqué validé")
        void activateAccount_validToken_enablesUser() throws MessagingException {
            User user = mock(User.class);
            when(user.getId()).thenReturn(10L);

            Token token = Token.builder()
                    .token("123456")
                    .user(user)
                    .expiredAt(LocalDateTime.now().plusMinutes(10))
                    .build();

            when(tokenRepository.findByToken("123456")).thenReturn(Optional.of(token));
            when(userRepository.findById(10L)).thenReturn(Optional.of(user));

            authenticateService.activateAccount("123456");

            verify(user).setEnabled(true);
            verify(userRepository).save(user);
            assertThat(token.getValidateAt()).isNotNull();
        }

        @Test
        @DisplayName("Token expiré → RuntimeException + renvoi d'email")
        void activateAccount_expiredToken_throwsAndResendEmail() throws MessagingException {
            User user = mock(User.class);
            Token token = Token.builder()
                    .token("expired")
                    .user(user)
                    .expiredAt(LocalDateTime.now().minusMinutes(30))
                    .build();

            when(tokenRepository.findByToken("expired")).thenReturn(Optional.of(token));

            assertThatThrownBy(() -> authenticateService.activateAccount("expired"))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("expired");

            verify(emailService).sendValidationEmail(user);
        }

        @Test
        @DisplayName("Token inconnu → RuntimeException 'invalid token'")
        void activateAccount_unknownToken_throwsRuntimeException() {
            when(tokenRepository.findByToken("unknown")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> authenticateService.activateAccount("unknown"))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessage("invalid token");
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // logout()
    // ═════════════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("logout()")
    class LogoutTests {

        @Mock private HttpServletRequest  httpRequest;
        @Mock private HttpServletResponse httpResponse;

        @Test
        @DisplayName("Cookie JWT présent → token révoqué, cookie supprimé")
        void logout_withJwtCookie_revokesTokenAndDeletesCookie() {
            Cookie jwtCookie = new Cookie("jwt", "my-jwt-token");
            when(httpRequest.getCookies()).thenReturn(new Cookie[]{jwtCookie});

            Token token = Token.builder().token("my-jwt-token").expired(false).revoked(false).build();
            when(tokenRepository.findByToken("my-jwt-token")).thenReturn(Optional.of(token));

            ResponseEntity<?> response = authenticateService.logout(httpRequest, httpResponse);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(token.isExpired()).isTrue();
            assertThat(token.isRevoked()).isTrue();
            verify(tokenRepository).save(token);
            verify(httpResponse).addHeader(eq("Set-Cookie"), contains("jwt=;"));
        }

        @Test
        @DisplayName("Aucun cookie → pas d'erreur, cookie de suppression quand même positionné")
        void logout_noCookies_stillDeletesCookie() {
            when(httpRequest.getCookies()).thenReturn(null);

            ResponseEntity<?> response = authenticateService.logout(httpRequest, httpResponse);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            verify(tokenRepository, never()).save(any());
            verify(httpResponse).addHeader(eq("Set-Cookie"), contains("Max-Age=0"));
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // getCurrentUser()
    // ═════════════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("getCurrentUser()")
    class GetCurrentUserTests {

        @Test
        @DisplayName("Utilisateur Client → UserResponse avec profilePicture")
        void getCurrentUser_client_includesProfilePicture() {
            Role role = new Role(); role.setName("CLIENT");
            Client client = mock(Client.class);
            when(client.getId()).thenReturn(5L);
            when(client.getEmail()).thenReturn("c@test.com");
            when(client.getFullName()).thenReturn("Client Name");
            when(client.getRoles()).thenReturn(List.of(role));
            when(client.getProfilePicture()).thenReturn("pic.jpg");

            Authentication auth = mock(Authentication.class);
            when(auth.getPrincipal()).thenReturn(client);

            UserResponse result = authenticateService.getCurrentUser(auth);

            assertThat(result.getId()).isEqualTo(5L);
            assertThat(result.getRoles()).containsExactly("CLIENT");
            assertThat(result.getProfilePicture()).isEqualTo("pic.jpg");
        }

        @Test
        @DisplayName("Utilisateur Admin → profilePicture est null")
        void getCurrentUser_admin_profilePictureIsNull() {
            Role role = new Role(); role.setName("ADMIN");
            Admin admin = mock(Admin.class);
            when(admin.getId()).thenReturn(2L);
            when(admin.getEmail()).thenReturn("a@test.com");
            when(admin.getFullName()).thenReturn("Admin Name");
            when(admin.getRoles()).thenReturn(List.of(role));

            Authentication auth = mock(Authentication.class);
            when(auth.getPrincipal()).thenReturn(admin);

            UserResponse result = authenticateService.getCurrentUser(auth);

            assertThat(result.getProfilePicture()).isNull();
            assertThat(result.getRoles()).containsExactly("ADMIN");
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // deleteAllUsers()
    // ═════════════════════════════════════════════════════════════════════════
    @Nested
    @DisplayName("deleteAllUsers()")
    class DeleteAllUsersTests {

        @Test
        @DisplayName("Supprime d'abord les tokens puis les utilisateurs")
        void deleteAllUsers_deletesTokensThenUsers() {
            InOrder order = inOrder(tokenRepository, userRepository);

            authenticateService.deleteAllUsers();

            order.verify(tokenRepository).deleteAll();
            order.verify(userRepository).deleteAll();
        }
    }
}