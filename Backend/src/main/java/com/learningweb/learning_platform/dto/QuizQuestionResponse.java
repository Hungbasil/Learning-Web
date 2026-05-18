package com.learningweb.learning_platform.dto;

import lombok.*;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizQuestionResponse {
    private Long id;
    private String content;
    private String difficulty;
    private Integer xpReward;
    private List<QuizOptionResponse> options;
}
