package com.learningweb.learning_platform.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class UserSkillsResponse {
    private List<SkillDto> skills;

    @Data
    @Builder
    public static class SkillDto {
        private Long id;
        private String skillName;
        private String proficiency;
        private Integer progress;
    }
}
