package com.learningweb.learning_platform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeReviewResponse {
    private List<String> strengths;
    private List<String> improvements;
    private String overallAssessment;
    private Integer scoreOutOf10;
}
