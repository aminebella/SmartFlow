package emsi.SmartFlow;

import emsi.SmartFlow.entity.Admin;
import emsi.SmartFlow.role.Role;
import emsi.SmartFlow.role.RoleRepository;
import emsi.SmartFlow.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@EnableJpaAuditing
@SpringBootApplication
public class SmartFlowApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartFlowApplication.class, args);
    }

    @Bean
    public CommandLineRunner initialization(
            RoleRepository roleRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return (args -> {
            Role clientRole = roleRepository.findByName("CLIENT")
                    .orElseGet(() -> roleRepository.save(
                            Role.builder().name("CLIENT").build()));

            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseGet(() -> roleRepository.save(
                            Role.builder().name("ADMIN").build()));

            if (userRepository.findByEmail("adminSmartFlow@gmail.com").isEmpty()) {
                Admin admin = Admin.builder()
                        .firstname("Admin")
                        .lastname("SmartFlow")
                        .email("adminSmartFlow@gmail.com")
                        .password(passwordEncoder.encode("adminSmartFlow1"))
                        .accountLocked(false)
                        .enabled(true)   // ← pas besoin de vérifier l'email
                        .roles(List.of(adminRole))
                        .build();
                userRepository.save(admin);
            }
        });
    }
}