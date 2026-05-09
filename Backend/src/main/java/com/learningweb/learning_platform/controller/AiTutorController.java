package com.learningweb.learning_platform.controller;


import com.learningweb.learning_platform.dto.LearningPathRequest;
import com.learningweb.learning_platform.entity.AiLearning;
import com.learningweb.learning_platform.entity.User;
import com.learningweb.learning_platform.repository.AiLearningRepository;
import com.learningweb.learning_platform.service.OllamaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/ai-tutor")
public class AiTutorController {

    @Autowired private AiLearningRepository pathRepository;
    @Autowired private OllamaService ollamaService;


    @PostMapping("/generate")
    public ResponseEntity<?> generatePath(@RequestBody LearningPathRequest request) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Optional<AiLearning> existingPath = pathRepository.findByUser(currentUser);
        if (existingPath.isPresent()) {
            return ResponseEntity.badRequest().body("Bạn đã sử dụng hết 1 lượt tạo lộ trình miễn phí. Vui lòng nâng cấp tài khoản (Thanh toán) để tạo lộ trình mới!");
        }

        System.out.println(" Đang nhờ suy nghĩ vẽ lộ trình...");
        String roadmap = ollamaService.generateLearningPath(request);

        if (roadmap == null) {
            return ResponseEntity.internalServerError().body("Lỗi: Không thể kết nối với AI lúc này.");
        }

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
        return ResponseEntity.ok(newPath);
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
