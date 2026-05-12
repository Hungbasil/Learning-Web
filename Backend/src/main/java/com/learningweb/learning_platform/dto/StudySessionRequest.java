package com.learningweb.learning_platform.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudySessionRequest {
    private String title;
    private String description;
    private Long relatedCourseId;
    private Integer workDuration;
    private Integer breakDuration;
    private String backgroundMusic;
}
