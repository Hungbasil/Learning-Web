package com.learningweb.learning_platform.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudySessionRequest {
    private String title;
    private String description;
    private Long relatedCourseId;
    private String topic;
    private String subject;
    private Integer workDuration;
    private Integer breakDuration;
    private Integer longBreakDuration;
    private Integer maxParticipants;
    private String backgroundMusic;
}
