package com.learningweb.learning_platform.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class PersonalGoalsResponse {
    private List<GoalDto> goals;

    @Data
    @Builder
    public static class GoalDto {
        private Long id;
        private String title;
        private String description;
        private LocalDate deadline;
        private Integer targetValue;
        private Integer currentProgress;
        private String status;
    }
}
