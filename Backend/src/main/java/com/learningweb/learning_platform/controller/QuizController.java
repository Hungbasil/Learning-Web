package com.learningweb.learning_platform.controller;



import com.learningweb.learning_platform.dto.QuizSubmissionRequest;
import com.learningweb.learning_platform.dto.QuizResultResponse;
import com.learningweb.learning_platform.entity.*;
import com.learningweb.learning_platform.repository.*;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired private QuizRepository quizRepository;
    @Autowired private QuizQuestionRepository questionRepository;
    @Autowired private QuizOptionRepository optionRepository;
    @Autowired private QuizAttemptRepository attemptRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private LessonProgressRepository lessonProgressRepository;

    @PostMapping("/{quizId}/submit")
    @Transactional
    public ResponseEntity<?> submitQuiz(@PathVariable Long quizId, @RequestBody QuizSubmissionRequest request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Quiz quiz = quizRepository.findByIdWithQuestions(quizId).orElse(null);
        if (quiz == null) return ResponseEntity.badRequest().body("Không tìm thấy bài Quiz");

        // ✅ VẤN ĐỀ 2 FIX: Kiểm tra user đã pass quiz này trước đó chưa
        boolean hasAlreadyPassed = attemptRepository.hasUserPassedQuiz(user.getId(), quizId);
        if (hasAlreadyPassed) {
            // Lấy attempt pass cũ để return thông tin (format giống như lần đầu pass)
            QuizAttempt previousAttempt = attemptRepository.findPassedAttemptByUserAndQuiz(user, quiz).orElse(null);
            System.out.println("⚠️ User " + user.getEmail() + " đã pass quiz này rồi. Không cộng thêm XP.");
            // Return với flag alreadyPassed = true
            return ResponseEntity.ok(QuizResultResponse.builder()
                    .score(previousAttempt != null ? previousAttempt.getScore() : 0)
                    .isPassed(true)
                    .earnedXp(0) // Không cộng thêm XP
                    .alreadyPassed(true)
                    .build());
        }

        List<QuizQuestion> questions = quiz.getQuestions();
        int totalQuestions = questions.size();
        int correctAnswers = 0;
        int totalEarnedXp = 0;

        for (QuizQuestion question : questions) {
            // Initialize options collection để tránh lazy loading outside transaction
            Hibernate.initialize(question.getOptions());
            
            Long userSelectedOptionId = request.getAnswers().get(question.getId());
            
            System.out.println("Question " + question.getId() + ": selected option = " + userSelectedOptionId);
            System.out.println("Available options: " + (question.getOptions() != null ? question.getOptions().size() : "null"));

            boolean isCorrect = question.getOptions() != null && question.getOptions().stream()
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

        // ✅ VẤN ĐỀ 1 FIX: Update LessonProgress.completed = true khi isPassed (bất kể XP)
        if (isPassed) {
            Lesson lesson = quiz.getLesson();
            if (lesson != null) {
                LessonProgress progress = lessonProgressRepository.findByUserAndLesson(user, lesson)
                        .orElse(LessonProgress.builder().user(user).lesson(lesson).build());
                progress.setCompleted(true);
                lessonProgressRepository.save(progress);
                System.out.println("✅ Đã đánh dấu bài học " + lesson.getId() + " là hoàn thành cho " + user.getEmail());
            }
        }

        // Cộng XP chỉ khi pass và có XP reward
        if (isPassed && totalEarnedXp > 0) {
            user.setTotalXp((user.getTotalXp() == null ? 0 : user.getTotalXp()) + totalEarnedXp);
            userRepository.save(user);
            System.out.println("✨ Đã cộng " + totalEarnedXp + " XP cho học viên: " + user.getEmail());
        }

        // Return response format thống nhất
        return ResponseEntity.ok(QuizResultResponse.builder()
                .score(finalScore)
                .isPassed(isPassed)
                .earnedXp(totalEarnedXp)
                .alreadyPassed(false) // Lần đầu pass
                .build());
    }
}
