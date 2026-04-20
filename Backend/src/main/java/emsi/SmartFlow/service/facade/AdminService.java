package emsi.SmartFlow.service.facade;

import emsi.SmartFlow.entity.Admin;

/**
 * @author HP
 **/

// the "contract"
public interface AdminService {

     Admin getAdminById(Long id); // → "I promise there will be this method"
}
