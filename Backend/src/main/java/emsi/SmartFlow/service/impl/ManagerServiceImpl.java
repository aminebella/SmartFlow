package emsi.SmartFlow.service.impl;

import emsi.SmartFlow.controller.converter.MemberConverter;
import emsi.SmartFlow.controller.dto.teams.MemeberSummaryResponse;
import emsi.SmartFlow.repo.ClientRepo;
import emsi.SmartFlow.service.facade.IManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ManagerServiceImpl implements IManagerService {

    private final ClientRepo clientRepo;
    private final MemberConverter memberConverter;

    @Override
    public List<MemeberSummaryResponse> searchClientsByEmail(String email, Long managerId) {
        return clientRepo.findByEmailContainingIgnoreCase(email)
                .stream()
                .filter(client -> !client.getId().equals(managerId)) // ← exclure le manager
                .map(memberConverter::toMemeberSummaryResponse)
                .collect(Collectors.toList());
    }
}