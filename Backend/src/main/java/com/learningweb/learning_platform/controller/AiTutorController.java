package com.learningweb.learning_platform.controller;


import com.learningweb.learning_platform.dto.LearningPathRequest;
import com.learningweb.learning_platform.entity.AiLearning;
import com.learningweb.learning_platform.entity.User;
import com.learningweb.learning_platform.repository.AiLearningRepository;
import com.learningweb.learning_platform.repository.UserRepository;
import com.learningweb.learning_platform.service.OllamaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/ai-tutor")
public class AiTutorController {

    @Autowired private AiLearningRepository pathRepository;
    @Autowired private OllamaService ollamaService;
    @Autowired private UserRepository userRepository;

    @PostMapping("/generate")
    public ResponseEntity<?> generatePath(@RequestBody LearningPathRequest request) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Optional<AiLearning> existingPath = pathRepository.findByUser(currentUser);
        if (currentUser.getAiTokens() <= 0) {
            return ResponseEntity.badRequest().body("Bạn đã hết lượt tạo lộ trình. Hãy thanh toán để nhận thêm lượt!");
        }

        System.out.println(" Đang nhờ suy nghĩ vẽ lộ trình...");

        String roadmap = ollamaService.generateLearningPath(request);
        if (roadmap == null) return ResponseEntity.internalServerError().body("Lỗi AI");
        
        currentUser.setAiTokens(currentUser.getAiTokens() - 1);
        userRepository.save(currentUser);

        // Lưu vào Database để lần sau xem lại
        AiLearning newPath = AiLearning.builder()
                .user(currentUser)
                .targetLanguage(request.getTargetLanguage())
                .currentLevel(request.getCurrentLevel())
                .studyGoal(request.getStudyGoal())
                .hoursPerWeek(request.getHoursPerWeek())
                .generatedRoadmap(roadmap)
                .build();

        pathRepository.save(newPath);
        
        // Trả về cả lộ trình và token mới để Frontend update
        return ResponseEntity.ok(Map.of(
            "path", newPath,
            "aiTokens", currentUser.getAiTokens()
        ));
    }

    @GetMapping("/my-path")
    public ResponseEntity<?> getMyPath() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<AiLearning> path = pathRepository.findByUser(currentUser);

        if (path.isEmpty()) {
            return ResponseEntity.ok().body("Chưa có lộ trình nào. Hãy bắt đầu tạo mới!");
        }
        return ResponseEntity.ok(path.get());
    }
}
