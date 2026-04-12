package emsi.SmartFlow.service.impl;

import emsi.SmartFlow.entity.Admin;
import emsi.SmartFlow.repo.AdminRepo;
import emsi.SmartFlow.service.facade.AdminService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

/**
 * @author HP
 **/
@Service
public class AdminServiceImpl implements AdminService {
    private final AdminRepo adminRepo;

    public AdminServiceImpl(AdminRepo adminRepo) {
        this.adminRepo = adminRepo;
    }

    @Override
    public Admin getAdminById(Long id) {
        var admin = adminRepo.findById(id).orElseThrow(()-> new EntityNotFoundException("Admin not found with id: "+id));
        return admin;
    }
}
