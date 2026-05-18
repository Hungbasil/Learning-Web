package com.learningweb.learning_platform.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestCaseResponse {
    private Long id;
    private String inputData;
    private String expectedOutput;
    private Boolean isHidden;
}
