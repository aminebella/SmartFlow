package emsi.SmartFlow.Utils;
import emsi.SmartFlow.user.User;
import org.springframework.security.access.AccessDeniedException;
public class SecurityUtils {

    // ─── Extraire le rôle du user ─────────────────────────
    public static String getRole(User user) {
        return user.getAuthorities().iterator().next().getAuthority();
    }

    // ─── Vérifier si ADMIN ────────────────────────────────
    public static void requireAdmin(User user) {
        if (!getRole(user).equals("ADMIN")) {
            throw new AccessDeniedException("Access denied: ADMIN role required");
        }
    }

    // ─── Vérifier si CLIENT ───────────────────────────────
    public static void requireClient(User user) {
        if (!getRole(user).equals("CLIENT")) {
            throw new AccessDeniedException("Access denied: CLIENT role required");
        }
    }

    // ─── Vérifier si c'est le bon user ───────────────────
    public static void requireSameUser(User currentUser, Long targetId) {
        if (!currentUser.getId().equals(targetId)) {
            throw new AccessDeniedException("Access denied: you can only access your own data");
        }
    }
}