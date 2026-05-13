package emsi.SmartFlow.TestUnitaire.security;

import emsi.SmartFlow.security.JwtFilter;
import emsi.SmartFlow.security.LogoutService;
import emsi.SmartFlow.security.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
class SecurityConfigTest {

    @Mock
    private JwtFilter jwtFilter;

    @Mock
    private AuthenticationProvider authenticationProvider;

    @Mock
    private LogoutService logoutService;

    @InjectMocks
    private SecurityConfig securityConfig;

    // ─── CORS configuration ──────────────────────────────────────────────────

    @Test
    void corsConfig_allowsLocalhostOrigin() {
        CorsConfigurationSource source = securityConfig.corsConfigurationSource();
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/auth/login");

        CorsConfiguration config = source.getCorsConfiguration(request);

        assertNotNull(config);
        assertTrue(config.getAllowedOrigins().contains("http://localhost:3000"));
    }

    @Test
    void corsConfig_allowsRequiredHttpMethods() {
        CorsConfigurationSource source = securityConfig.corsConfigurationSource();
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/any");

        CorsConfiguration config = source.getCorsConfiguration(request);

        assertNotNull(config);
        assertTrue(config.getAllowedMethods().containsAll(
                java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
        ));
    }

    @Test
    void corsConfig_allowsCredentials() {
        CorsConfigurationSource source = securityConfig.corsConfigurationSource();
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/any");

        CorsConfiguration config = source.getCorsConfiguration(request);

        assertNotNull(config);
        assertTrue(Boolean.TRUE.equals(config.getAllowCredentials()));
    }

    @Test
    void corsConfig_allowsAllHeaders() {
        CorsConfigurationSource source = securityConfig.corsConfigurationSource();
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/any");

        CorsConfiguration config = source.getCorsConfiguration(request);

        assertNotNull(config);
        assertTrue(config.getAllowedHeaders().contains("*"));
    }
}