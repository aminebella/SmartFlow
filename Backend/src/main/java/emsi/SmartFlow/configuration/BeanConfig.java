package emsi.SmartFlow.configuration;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration // → Tells Spring: "this class contains setup/config code, not business logic"
@RequiredArgsConstructor
public class BeanConfig {
    // → This is actually UserDetailsServiceImpl (Spring auto-injects it)
    private final UserDetailsService userDetailsService;

    @Bean
    public AuthenticationProvider authenticationProvider(){
        // → "DAO" = database-based authentication (vs LDAP, OAuth, etc.)
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        // → "When someone tries to login, use THIS service to find the user by email"
        authProvider.setUserDetailsService(userDetailsService);

        // → "Use BCrypt to check if the password matches the hashed one in DB"
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        // → The AuthenticationManager is what actually RUNS the login check
        // → AuthenticateService calls this when someone logs in
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        // → BCrypt = secure password hashing (like bcrypt() in Laravel)
        return new BCryptPasswordEncoder();
    }
}
