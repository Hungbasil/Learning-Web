package com.learningweb.learning_platform.dto;

import lombok.*;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonDetailResponse {
    private Long id;
    private String title;
    private String videoUrl;
    private String content;
    private Integer duration;
    private Boolean isFree;
    private Integer orderIndex;
    
    // Tài liệu học tập
    private List<LessonMaterialResponse> materials;
    
    // Bài kiểm tra
    private QuizInfoResponse quiz;
    
    // Thử thách lập trình
    private List<CodeChallengeResponse> challenges;
}
