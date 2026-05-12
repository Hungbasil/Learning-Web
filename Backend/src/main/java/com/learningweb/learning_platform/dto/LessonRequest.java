package com.learningweb.learning_platform.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LessonRequest {
    private String title;
    private String videoUrl;
    private String content;
    private Integer orderIndex;
    private boolean isFree;
    private Long sectionId;
}
