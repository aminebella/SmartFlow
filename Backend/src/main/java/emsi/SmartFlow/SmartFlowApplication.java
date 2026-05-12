package emsi.SmartFlow;

import emsi.SmartFlow.entity.Admin;
import emsi.SmartFlow.role.Role;
import emsi.SmartFlow.role.RoleRepository;
import emsi.SmartFlow.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.FileWriter;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@EnableJpaAuditing
@SpringBootApplication
public class SmartFlowApplication {

    public static void main(String[] args) throws IOException {

        ApplicationContext context = SpringApplication.run(SmartFlowApplication.class, args);
        String[] beanNames = context.getBeanDefinitionNames();
        Arrays.sort(beanNames);

        // try-with-resources → automatically closes the writer even if an exception occurs
        try (FileWriter writer = new FileWriter("beans.txt")) {
            for (String beanName : beanNames) {
                Object bean = context.getBean(beanName);
                writer.write(beanName + " -> " + bean.getClass().getName() + "\n");
            }
        }

        System.out.println("Beans exportés dans beans.txt");
    }


    @Bean
    public CommandLineRunner initialization(
            RoleRepository roleRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {

            Role clientRole = roleRepository.findByName("CLIENT").orElse(null);
            if (clientRole == null) {
                clientRole = roleRepository.save(
                        Role.builder().name("CLIENT").build()
                );
            }

            Role adminRole = roleRepository.findByName("ADMIN").orElse(null);
            if (adminRole == null) {
                adminRole = roleRepository.save(
                        Role.builder().name("ADMIN").build()
                );
            }

            if (userRepository.findByEmail("adminSmartFlow@gmail.com").isEmpty()) {

                // Read password from environment variable instead of hardcoding
                String adminPassword = System.getenv("ADMIN_DEFAULT_PASSWORD");

                Admin admin = Admin.builder()
                        .firstname("Admin")
                        .lastname("SmartFlow")
                        .email("adminSmartFlow@gmail.com")
                        .password(passwordEncoder.encode(adminPassword))
                        .accountLocked(false)
                        .enabled(true)
                        .roles(List.of(adminRole))
                        .build();

                userRepository.save(admin);
            }
        };
    }
}