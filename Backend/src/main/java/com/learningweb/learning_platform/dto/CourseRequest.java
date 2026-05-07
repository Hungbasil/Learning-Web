package com.learningweb.learning_platform.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourseRequest {
    private String title;
    private String description;
    private Double price;
    private String imageUrl;
    private String level;
    private Long categoryId;
}
