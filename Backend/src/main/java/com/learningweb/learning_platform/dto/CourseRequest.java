package com.learningweb.learning_platform.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class CourseRequest {
    private String title;
    private String description;
    private Double price;
    private String imageUrl;
    private String level;
    private Long categoryId;
    private MultipartFile imageFile;
}
