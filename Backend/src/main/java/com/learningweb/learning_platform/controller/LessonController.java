package com.learningweb.learning_platform.controller;

import com.learningweb.learning_platform.dto.*;
import com.learningweb.learning_platform.entity.*;
import com.learningweb.learning_platform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    @Autowired private LessonRepository lessonRepository;
    @Autowired private LessonMaterialRepository materialRepository;
    @Autowired private QuizRepository quizRepository;
    @Autowired private CodeChallengeRepository challengeRepository;
    @Autowired private QuizAttemptRepository quizAttemptRepository;
    @Autowired private UserRepository userRepository;

    /**
     * GET /api/lessons/{id} - Lấy chi tiết lesson với tất cả thông tin
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getLessonDetail(@PathVariable Long id) {
        Lesson lesson = lessonRepository.findById(id).orElse(null);
        if (lesson == null) {
            return ResponseEntity.badRequest().body("Không tìm thấy bài học!");
        }
        
        // Get current user
        User user = null;
        try {
            user = (User) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        } catch (Exception e) {
            // User not authenticated
        }

        // Lấy materials
        List<LessonMaterial> materials = materialRepository.findByLessonIdOrderByOrderIndex(id);
        List<LessonMaterialResponse> materialResponses = materials.stream()
                .map(m -> LessonMaterialResponse.builder()
                        .id(m.getId())
                        .title(m.getTitle())
                        .description(m.getDescription())
                        .fileUrl(m.getFileUrl())
                        .materialType(m.getMaterialType())
                        .orderIndex(m.getOrderIndex())
                        .build())
                .collect(Collectors.toList());

        // Lấy quiz
        QuizInfoResponse quizResponse = null;
        if (lesson.getQuiz() != null) {
            Quiz quiz = lesson.getQuiz();
            List<QuizQuestionResponse> questions = quiz.getQuestions().stream()
                    .map(q -> QuizQuestionResponse.builder()
                            .id(q.getId())
                            .content(q.getContent())
                            .difficulty(q.getDifficulty())
                            .xpReward(q.getXpReward())
                            .options(q.getOptions().stream()
                                    .map(opt -> QuizOptionResponse.builder()
                                            .id(opt.getId())
                                            .optionText(opt.getOptionText())
                                            .build())
                                    .collect(Collectors.toList()))
                            .build())
                    .collect(Collectors.toList());

            quizResponse = QuizInfoResponse.builder()
                    .id(quiz.getId())
                    .title(quiz.getTitle())
                    .passingScore(quiz.getPassingScore())
                    .xpReward(quiz.getXpReward())
                    .questions(questions)
                    .totalQuestions(questions.size())
                    .build();
        }

        // Lấy code challenges
        List<CodeChallenge> challenges = lesson.getChallenges();
        List<CodeChallengeResponse> challengeResponses = challenges.stream()
                .map(c -> CodeChallengeResponse.builder()
                        .id(c.getId())
                        .title(c.getTitle())
                        .description(c.getDescription())
                        .difficulty(c.getDifficulty())
                        .xpReward(c.getXpReward())
                        .testCases(c.getTestCases().stream()
                                .map(tc -> TestCaseResponse.builder()
                                        .id(tc.getId())
                                        .inputData(tc.getInputData())
                                        .expectedOutput(tc.getExpectedOutput())
                                        .isHidden(tc.getIsHidden())
                                        .build())
                                .collect(Collectors.toList()))
                        .totalTestCases(c.getTestCases().size())
                        .build())
                .collect(Collectors.toList());

        // Check if user has passed quiz
        Boolean quizPassed = false;
        if (user != null && lesson.getQuiz() != null) {
            quizPassed = quizAttemptRepository.hasUserPassedQuiz(user.getId(), lesson.getQuiz().getId());
        }
        
        // Build response
        LessonDetailResponse response = LessonDetailResponse.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .videoUrl(lesson.getVideoUrl())
                .content(lesson.getContent())
                .duration(lesson.getDuration())
                .isFree(lesson.isFree())
                .orderIndex(lesson.getOrderIndex())
                .materials(materialResponses)
                .quiz(quizResponse)
                .quizPassed(quizPassed)
                .challenges(challengeResponses)
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/lessons/{id}/materials - Admin thêm tài liệu học tập
     */
    @PostMapping("/{id}/materials")
    public ResponseEntity<?> addMaterial(@PathVariable Long id, @RequestBody LessonMaterialRequest request) {
        Lesson lesson = lessonRepository.findById(id).orElse(null);
        if (lesson == null) {
            return ResponseEntity.badRequest().body("Không tìm thấy bài học!");
        }

        LessonMaterial material = LessonMaterial.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .fileUrl(request.getFileUrl())
                .materialType(request.getMaterialType())
                .orderIndex(request.getOrderIndex())
                .lesson(lesson)
                .build();

        materialRepository.save(material);
        return ResponseEntity.ok("Thêm tài liệu thành công!");
    }

    /**
     * DELETE /api/lessons/{id}/materials/{materialId} - Admin xóa tài liệu
     */
    @DeleteMapping("/{id}/materials/{materialId}")
    public ResponseEntity<?> deleteMaterial(@PathVariable Long id, @PathVariable Long materialId) {
        LessonMaterial material = materialRepository.findById(materialId).orElse(null);
        if (material == null) {
            return ResponseEntity.badRequest().body("Không tìm thấy tài liệu!");
        }

        materialRepository.delete(material);
        return ResponseEntity.ok("Xóa tài liệu thành công!");
    }
}
