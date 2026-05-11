package com.learningweb.learning_platform.dto;


import lombok.Getter;
import lombok.Setter;
import java.util.Map;

@Getter @Setter
public class QuizSubmissionRequest {
    // chứa id câu hỏi và lựa chọn của từng người
    private Map<Long, Long> answers;
}
