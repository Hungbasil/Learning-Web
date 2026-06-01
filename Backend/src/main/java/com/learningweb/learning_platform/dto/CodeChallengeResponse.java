package com.learningweb.learning_platform.dto;

import lombok.*;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeChallengeResponse {
    private Long id;
    private String title;
    private String description;
    private String difficulty;
    private Integer xpReward;
    private List<TestCaseResponse> testCases;
    private Integer totalTestCases;
}
