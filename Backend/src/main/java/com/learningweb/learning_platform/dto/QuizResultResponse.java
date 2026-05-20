package com.learningweb.learning_platform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizResultResponse {
    private Integer score;
    private Boolean isPassed;
    private Integer earnedXp;
    private Boolean alreadyPassed; // true nếu user đã pass rồi, false nếu lần đầu pass
}
