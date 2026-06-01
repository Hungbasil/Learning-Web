package com.learningweb.learning_platform.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsResponse {
    private Integer totalXp;
    private Integer rank;
    private Integer streakDays;
    private Double totalStudyHours;
    private Integer totalCoursesCompleted;
    private Integer skillsAcquired;
    private String currentLevel;
}
