package com.learningweb.learning_platform.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonMaterialResponse {
    private Long id;
    private String title;
    private String description;
    private String fileUrl;
    private String materialType;
    private Integer orderIndex;
}
