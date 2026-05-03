package emsi.SmartFlow.service.impl;

import emsi.SmartFlow.controller.dto.SprintRequest;
import emsi.SmartFlow.controller.dto.SprintResponse;
import emsi.SmartFlow.entity.Sprint;
import emsi.SmartFlow.entity.enums.SprintStatus;
import emsi.SmartFlow.exception.ResourceNotFoundException;
import emsi.SmartFlow.repo.ProjectRepo;
import emsi.SmartFlow.repo.SprintRepo;
import emsi.SmartFlow.service.facade.SprintService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SprintServiceImpl implements SprintService {

    private final SprintRepo sprintRepo;
    private final ProjectRepo projectRepo;

    @Override
    @Transactional(readOnly = true)
    public List<SprintResponse> listByProject(Long projectId) {
        // validate project exists (better error than empty list if projectId is wrong)
        if (!projectRepo.existsById(projectId)) {
            throw new ResourceNotFoundException("Projet introuvable (id=" + projectId + ")");
        }
        return sprintRepo.findByProjectIdOrderByStartDateAscIdAsc(projectId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SprintResponse getById(Long sprintId) {
        return sprintRepo.findById(sprintId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint introuvable (id=" + sprintId + ")"));
    }

    @Override
    public SprintResponse create(Long projectId, SprintRequest request) {
        var project = projectRepo.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Projet introuvable (id=" + projectId + ")"));

        var sprint = Sprint.builder()
                .project(project)
                .title(request.title())
                .goal(request.goal())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .status(request.status() != null ? request.status() : SprintStatus.PLANNED)
                .build();

        return toResponse(sprintRepo.save(sprint));
    }

    @Override
    public SprintResponse update(Long sprintId, SprintRequest request) {
        var sprint = sprintRepo.findById(sprintId)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint introuvable (id=" + sprintId + ")"));

        sprint.setTitle(request.title());
        sprint.setGoal(request.goal());
        sprint.setStartDate(request.startDate());
        sprint.setEndDate(request.endDate());
        if (request.status() != null) {
            sprint.setStatus(request.status());
        }

        return toResponse(sprintRepo.save(sprint));
    }

    @Override
    public void delete(Long sprintId) {
        if (!sprintRepo.existsById(sprintId)) {
            throw new ResourceNotFoundException("Sprint introuvable (id=" + sprintId + ")");
        }
        sprintRepo.deleteById(sprintId);
    }

    private SprintResponse toResponse(Sprint sprint) {
        return new SprintResponse(
                sprint.getId(),
                sprint.getProject() != null ? sprint.getProject().getId() : null,
                sprint.getTitle(),
                sprint.getGoal(),
                sprint.getStartDate(),
                sprint.getEndDate(),
                sprint.getStatus()
        );
    }
}

