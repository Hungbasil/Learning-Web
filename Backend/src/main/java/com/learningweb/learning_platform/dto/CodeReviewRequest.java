package com.learningweb.learning_platform.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class CodeReviewRequest {
    private String projectType; // "backend" or "frontend"
    private String framework;   // "spring-boot", "react", etc.
    private Integer controllerCount;
    private Integer serviceCount;
    private Integer entityCount;
    private Boolean hasGlobalExceptionHandler;
    private Boolean hasInputValidation;
    private Boolean hasProperLogging;
    private Boolean hasConfigExternalization;
}
