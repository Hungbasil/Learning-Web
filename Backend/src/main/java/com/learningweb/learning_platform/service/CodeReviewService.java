package com.learningweb.learning_platform.service;

import com.learningweb.learning_platform.dto.CodeReviewRequest;
import com.learningweb.learning_platform.dto.CodeReviewResponse;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class CodeReviewService {

    public CodeReviewResponse analyzeBackend(CodeReviewRequest request) {
        List<String> strengths = new ArrayList<>();
        List<String> improvements = new ArrayList<>();
        int score = 10;

        // ============ ANALYSIS LOGIC ============

        // 1. Controller-Service Ratio
        if (request.getControllerCount() != null && request.getServiceCount() != null) {
            int ratio = request.getControllerCount() / Math.max(request.getServiceCount(), 1);
            
            if (ratio > 3) {
                improvements.add(
                    String.format("Tỷ lệ Controller:Service là %d:1 - nghĩa là logic kinh doanh có thể bị rò rỉ vào controller. Hãy tạo thêm %d service class để xử lý business logic",
                    ratio, request.getControllerCount() - request.getServiceCount())
                );
                score -= 2;
            } else {
                strengths.add(
                    String.format("Tỷ lệ Controller:Service cân bằng (%d:%d) - separation of concerns tốt", 
                    request.getControllerCount(), request.getServiceCount())
                );
            }
        }

        // 2. Entity-Controller Balance
        if (request.getEntityCount() != null && request.getControllerCount() != null) {
            if (request.getEntityCount() > 20) {
                strengths.add(
                    String.format("Domain model phong phú (%d entities) - data structure tổ chức tốt", 
                    request.getEntityCount())
                );
            }
        }

        // 3. Global Exception Handler
        if (request.getHasGlobalExceptionHandler() != null) {
            if (request.getHasGlobalExceptionHandler()) {
                strengths.add("✅ Global exception handler (@ControllerAdvice) - error response consistent");
            } else {
                improvements.add("❌ Thiếu global exception handler - response format không nhất quán giữa các endpoint. Tạo @ControllerAdvice để xử lý lỗi chung");
                score -= 2;
            }
        }

        // 4. Input Validation
        if (request.getHasInputValidation() != null) {
            if (request.getHasInputValidation()) {
                strengths.add("✅ Request validation đầy đủ (@Valid, @NotNull, @NotBlank trên DTO)");
            } else {
                improvements.add("❌ Input validation thiếu - DTOs không có @Valid annotation. Thêm javax.validation để bảo vệ API");
                score -= 2;
            }
        }

        // 5. Logging
        if (request.getHasProperLogging() != null) {
            if (request.getHasProperLogging()) {
                strengths.add("✅ Structured logging với SLF4J - dễ track issues trong production");
            } else {
                improvements.add("⚠️ Logging dùng System.out.println - khó theo dõi trong production. Thay bằng SLF4J logger");
                score -= 1;
            }
        }

        // 6. Configuration Management
        if (request.getHasConfigExternalization() != null) {
            if (request.getHasConfigExternalization()) {
                strengths.add("✅ Configuration externalized - secret và config trong application.properties");
            } else {
                improvements.add("⚠️ Hardcoded values (JWT secret, OTP expiry, API keys) - move sang application.properties để bảo mật");
                score -= 1;
            }
        }

        // Add default insights if not enough issues detected
        if (improvements.isEmpty() && strengths.size() < 3) {
            improvements.add("💡 Xem xét thêm custom repository queries để tránh N+1 query problem");
            improvements.add("💡 Implement proper pagination/caching cho heavy queries");
        }

        String assessment;
        if (score >= 8) {
            assessment = "Kiến trúc tốt, code đã follow những best practices cơ bản. Tinh chỉnh thêm ở detail.";
        } else if (score >= 6) {
            assessment = "Nền tảng vững nhưng cần refactor để cải thiện. Tập trung vào separation of concerns.";
        } else {
            assessment = "Cần review kỹ architecture. Xử lý lỗi, validation, logging là priority.";
        }

        return CodeReviewResponse.builder()
                .strengths(strengths)
                .improvements(improvements)
                .overallAssessment(assessment)
                .scoreOutOf10(score)
                .build();
    }

    public CodeReviewResponse analyzeFrontend(CodeReviewRequest request) {
        List<String> strengths = new ArrayList<>();
        List<String> improvements = new ArrayList<>();
        int score = 10;

        improvements.add("Frontend analysis - coming soon");

        return CodeReviewResponse.builder()
                .strengths(strengths)
                .improvements(improvements)
                .overallAssessment("Frontend review feature đang phát triển")
                .scoreOutOf10(score)
                .build();
    }
}
