package emsi.SmartFlow.repo;

import emsi.SmartFlow.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author HP
 **/
public interface AdminRepo extends JpaRepository<Admin,Long> {
    // → JpaRepository gives you FREE: findById, findAll, save, delete, count...
    // → Like Eloquent::find(), ::all(), ::save()
    // → You can add custom methods if needed

}
