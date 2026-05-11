package com.learningweb.learning_platform.controller;



import com.learningweb.learning_platform.dto.QuizSubmissionRequest;
import com.learningweb.learning_platform.entity.*;
import com.learningweb.learning_platform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired private QuizRepository quizRepository;
    @Autowired private QuizQuestionRepository questionRepository;
    @Autowired private QuizOptionRepository optionRepository;
    @Autowired private QuizAttemptRepository attemptRepository;
    @Autowired private UserRepository userRepository;

    @PostMapping("/{quizId}/submit")
    public ResponseEntity<?> submitQuiz(@PathVariable Long quizId, @RequestBody QuizSubmissionRequest request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Quiz quiz = quizRepository.findById(quizId).orElse(null);
        if (quiz == null) return ResponseEntity.badRequest().body("Không tìm thấy bài Quiz");

        List<QuizQuestion> questions = quiz.getQuestions();
        int totalQuestions = questions.size();
        int correctAnswers = 0;
        int totalEarnedXp = 0;

        for (QuizQuestion question : questions) {
            Long userSelectedOptionId = request.getAnswers().get(question.getId());

            boolean isCorrect = question.getOptions().stream()
                    .anyMatch(opt -> opt.getId().equals(userSelectedOptionId) && Boolean.TRUE.equals(opt.getIsCorrect()));

            if (isCorrect) {
                correctAnswers++;
                int xpForThisQuestion = (question.getXpReward() != null) ? question.getXpReward() : 10;
                totalEarnedXp += xpForThisQuestion;
            }
        }

        int finalScore = (correctAnswers * 100) / totalQuestions;
        boolean isPassed = finalScore >= quiz.getPassingScore();
        if (!isPassed) {
            totalEarnedXp = 0;
        }

        QuizAttempt attempt = QuizAttempt.builder()
                .user(user)
                .quiz(quiz)
                .score(finalScore)
                .isPassed(isPassed)
                .earnedXp(totalEarnedXp)
                .build();
        attemptRepository.save(attempt);

        if (isPassed && totalEarnedXp > 0) {
            user.setTotalXp((user.getTotalXp() == null ? 0 : user.getTotalXp()) + totalEarnedXp);
            userRepository.save(user);
            System.out.println("✨ Đã cộng " + totalEarnedXp + " XP cho học viên: " + user.getEmail());
        }

        return ResponseEntity.ok(attempt);
    }
}
