package com.learningweb.learning_platform.controller;

import com.learningweb.learning_platform.dto.CodeReviewRequest;
import com.learningweb.learning_platform.dto.CodeReviewResponse;
import com.learningweb.learning_platform.service.CodeReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analysis")
@CrossOrigin(origins = "http://localhost:5173")
public class CodeReviewController {

    @Autowired
    private CodeReviewService codeReviewService;

    @PostMapping("/code-review")
    public ResponseEntity<CodeReviewResponse> analyzeCode(@RequestBody CodeReviewRequest request) {
        CodeReviewResponse response;
        
        if ("backend".equalsIgnoreCase(request.getProjectType())) {
            response = codeReviewService.analyzeBackend(request);
        } else if ("frontend".equalsIgnoreCase(request.getProjectType())) {
            response = codeReviewService.analyzeFrontend(request);
        } else {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(response);
    }
}
