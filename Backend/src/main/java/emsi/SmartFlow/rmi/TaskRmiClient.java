package emsi.SmartFlow.rmi;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

import java.rmi.Naming;

@Slf4j
@Configuration
public class TaskRmiClient {

    @Bean
    @DependsOn("rmiRegistry") // ✅ Attend que le serveur RMI soit démarré
    public ITaskRemoteService taskRmiService() throws Exception {
        log.info("[RMI Client] Connexion au RMI Server rmi://localhost:1099/TaskService");
        return (ITaskRemoteService) Naming.lookup("rmi://localhost:1099/TaskService");
    }
}