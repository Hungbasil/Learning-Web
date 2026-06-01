package com.learningweb.learning_platform.dto;

import lombok.*;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizInfoResponse {
    private Long id;
    private String title;
    private Integer passingScore;
    private Integer xpReward;
    private List<QuizQuestionResponse> questions;
    private Integer totalQuestions;
}
