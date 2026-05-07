package emsi.SmartFlow.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByEmail(String email);
    void deleteAll();

    // Count users that do NOT have the ADMIN role
    @Query("SELECT COUNT(u) FROM User u JOIN u.roles r WHERE r.name <> 'ADMIN'")
    long countNonAdminUsers();
}
