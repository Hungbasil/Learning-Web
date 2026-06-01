package com.learningweb.learning_platform.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CourseListResponse {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private String imageUrl;
    private String level;
    private String categoryName;
    private String instructorName;
    private Integer totalLessons;
    private String totalDuration;
    private Boolean isFree;
    private String programmingLanguage;
    private String icon;
    private String bgColor;
    private Integer enrolledCount;
}
