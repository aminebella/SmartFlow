package emsi.SmartFlow;

import emsi.SmartFlow.role.Role;
import emsi.SmartFlow.role.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
// This IS the app. Tells Spring: "scan everything in this package and start up"
public class SmartFlowApplication {

	public static void main(String[] args) {
		// Launches the whole Spring app (starts server, loads configs, connects DB)
		SpringApplication.run(SmartFlowApplication.class, args);
	}

	@Bean
	public CommandLineRunner initialization(RoleRepository roleRepository) {
		// @Bean = Spring manages this object
        // CommandLineRunner = code that runs ONCE right after app starts
		return (args -> {
			if (roleRepository.findByName("CLIENT").isEmpty()) {
				roleRepository.save(Role.builder().name("CLIENT").build());
			}
			if (roleRepository.findByName("ADMIN").isEmpty()) {
				roleRepository.save(Role.builder().name("ADMIN").build());
			}
			// guarantees roles always exist even on fresh DB
		});

	}
}
