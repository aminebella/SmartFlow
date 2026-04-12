git statuspackage emsi.SmartFlow;

import emsi.SmartFlow.role.Role;
import emsi.SmartFlow.role.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SmartFlowApplication {

	public static void main(String[] args) {

		SpringApplication.run(SmartFlowApplication.class, args);

	}

	@Bean
	public CommandLineRunner initialization(RoleRepository roleRepository) {
		return (args -> {
			if (roleRepository.findByName("CLIENT").isEmpty()) {
				roleRepository.save(Role.builder().name("CLIENT").build());
			}
			if (roleRepository.findByName("ADMIN").isEmpty()) {
				roleRepository.save(Role.builder().name("ADMIN").build());
			}
		});

	}
}
