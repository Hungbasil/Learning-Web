package com.learningweb.learning_platform.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizOptionResponse {
    private Long id;
    private String optionText;
    // isCorrect không gửi về frontend để tránh gian lận
}
