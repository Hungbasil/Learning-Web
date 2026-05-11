package com.learningweb.learning_platform.dto;


import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CodeSubmitRequest {
    private String language;
    private String submittedCode; 
    private Boolean isAiAnalysis; // true nếu bấm nút "Phân tích AI", false nếu bấm "Nộp bài"
}
