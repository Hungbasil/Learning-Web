package com.learningweb.learning_platform.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SectionRequest {
    private String title;
    private Integer orderIndex;
    private Long courseId;
}
