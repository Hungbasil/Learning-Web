package com.learningweb.learning_platform.controller;

import com.learningweb.learning_platform.dto.CodeSubmitRequest;
import com.learningweb.learning_platform.entity.*;
import com.learningweb.learning_platform.repository.CodeChallengeRepository;
import com.learningweb.learning_platform.repository.LessonProgressRepository;
import com.learningweb.learning_platform.repository.UserRepository;
import com.learningweb.learning_platform.service.CodeEvaluationService;
import com.learningweb.learning_platform.service.OllamaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/challenges")
public class CodeChallengeController {

    @Autowired private CodeChallengeRepository challengeRepository;
    @Autowired private CodeEvaluationService evaluationService;
    @Autowired private OllamaService ollamaService;
    @Autowired private UserRepository userRepository;
    @Autowired private LessonProgressRepository lessonProgressRepository;

    @PostMapping("/{id}/process")
    public ResponseEntity<?> processCode(
            @PathVariable Long id,
            @RequestBody CodeSubmitRequest request) {

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CodeChallenge challenge = challengeRepository.findById(id).orElse(null);
        if (challenge == null) return ResponseEntity.badRequest().body("Không tìm thấy thử thách!");

        Map<String, Object> response = new HashMap<>();

        // LUỒNG 1: BẤM NÚT PHÂN TÍCH AI
        if (Boolean.TRUE.equals(request.getIsAiAnalysis())) {
            if (user.getAiTokens() <= 0) {
                return ResponseEntity.badRequest().body("Hết lượt nhờ AI. Vui lòng nạp thêm!");
            }

            System.out.println(" AI đang đọc và phân tích từng dòng code...");

            String aiFeedback = ollamaService.analyzeCode(
                    challenge.getTitle(),
                    challenge.getDescription(),
                    request.getLanguage(),
                    request.getSubmittedCode()
            );

            user.setAiTokens(user.getAiTokens() - 1);
            userRepository.save(user);

            response.put("type", "AI_ANALYSIS");
            response.put("feedback", aiFeedback);
            response.put("remainingTokens", user.getAiTokens());
            return ResponseEntity.ok(response);
        }

        // LUỒNG 2: BẤM NÚT NỘP BÀI

        CodeSubmission result = evaluationService.evaluateSubmission(user, challenge, request.getSubmittedCode(), request.getLanguage());

        response.put("type", "EVALUATION");
        response.put("status", result.getStatus());
        
        if (result.getStatus().equals("ACCEPTED")) {
            Lesson lesson = challenge.getLesson();
            if (lesson != null) {
                LessonProgress progress = lessonProgressRepository.findByUserAndLesson(user, lesson)
                        .orElse(LessonProgress.builder().user(user).lesson(lesson).build());
                progress.setCompleted(true);
                lessonProgressRepository.save(progress);
                System.out.println(" Đã đánh dấu bài học " + lesson.getId() + " là hoàn thành cho " + user.getEmail());
            }
        }
        
        response.put("xpEarned", result.getStatus().equals("ACCEPTED") ? challenge.getXpReward() : 0);
        return ResponseEntity.ok(response);
    }
}