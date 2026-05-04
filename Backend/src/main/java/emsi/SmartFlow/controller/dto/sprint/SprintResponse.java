package emsi.SmartFlow.controller.dto.sprint;

import emsi.SmartFlow.entity.enums.SprintStatus;

import java.time.LocalDate;

public record SprintResponse(
        Long id,
        Long projectId,
        String title,
        String goal,
        LocalDate startDate,
        LocalDate endDate,
        SprintStatus status
) {
}

