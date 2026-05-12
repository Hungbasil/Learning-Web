package com.learningweb.learning_platform.dto;


import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LearningPathRequest {
    private String targetLanguage;
    private String currentLevel;
    private String studyGoal;
    private String hoursPerWeek;
}
