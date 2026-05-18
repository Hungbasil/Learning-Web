package com.learningweb.learning_platform.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonMaterialRequest {
    private String title;
    private String description;
    private String fileUrl;
    private String materialType;  // "PDF", "VIDEO", "DOCUMENT", "CODE"
    private Integer orderIndex;
}
