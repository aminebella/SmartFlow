package emsi.SmartFlow.controller.dto.sprint;

import emsi.SmartFlow.entity.enums.SprintStatus;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record SprintRequest(
        @NotBlank(message = "Le titre du sprint est obligatoire")
        String title,
        String goal,
        LocalDate startDate,
        LocalDate endDate,
        SprintStatus status
) {
}

