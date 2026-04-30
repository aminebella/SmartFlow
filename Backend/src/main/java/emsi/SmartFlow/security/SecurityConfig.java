package emsi.SmartFlow.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity // → Activates Spring Security for the whole app
@RequiredArgsConstructor
@EnableMethodSecurity(securedEnabled = true) // → Allows using @Secured("ADMIN") on individual controller methods

public class SecurityConfig {

    private final JwtFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final LogoutService logoutService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.
                cors(Customizer.withDefaults()). // → Enable CORS (uses CorsConfig rules we defined)
                csrf(AbstractHttpConfigurer::disable). // → Disable CSRF protection — safe for REST APIs using JWT (no cookies) // → CSRF is only needed for browser form-based sessions
                authorizeHttpRequests(
                        req->
                                req.requestMatchers(// → These URLs don't need a token — anyone can access
                                                "/auth/**",
                                                "/v3/api-docs",
                                                "/v3/api-docs/**",
                                                "/v2/api-docs",
                                                "/swagger-resources",
                                                "/swagger-resources/**",
                                                "/configuration/ui",
                                                "/configuration/security",
                                                "/swagger-ui/**",
                                                "/swagger-ui.html",
                                                "/webjars/**"
                                        ).permitAll()
                                        .anyRequest().authenticated() // → Everything else requires a valid JWT

                ).sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // → STATELESS = don't create server-side sessions
                // → JWT carries all info, server remembers nothing between requests
                .authenticationProvider(authenticationProvider)// → Use our custom auth provider (from BeanConfig)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);// → Run our JwtFilter BEFORE Spring's default username/password filter

        return http.build();
    }
}
