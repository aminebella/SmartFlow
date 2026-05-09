package emsi.SmartFlow.rmi;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

@Slf4j
@Configuration
public class RmiServerConfig {

    @Bean(name = "rmiRegistry")
    public Registry rmiRegistry(TaskRemoteServiceImpl taskRemoteService) throws Exception {
        log.info("[RMI] Démarrage du RMI Registry sur le port 1099...");
        Registry registry = LocateRegistry.createRegistry(1099);
        registry.rebind("TaskService", taskRemoteService);
        log.info("[RMI] TaskService exposé sur rmi://localhost:1099/TaskService");
        return registry;
    }
}