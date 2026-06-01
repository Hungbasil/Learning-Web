package com.learningweb.learning_platform.repository;

import com.learningweb.learning_platform.entity.QuizAttempt;
import com.learningweb.learning_platform.entity.User;
import com.learningweb.learning_platform.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    // Tìm attempt pass cuối cùng của user cho quiz này
    @Query("SELECT qa FROM QuizAttempt qa WHERE qa.user = :user AND qa.quiz = :quiz AND qa.isPassed = true ORDER BY qa.completedAt DESC LIMIT 1")
    Optional<QuizAttempt> findPassedAttemptByUserAndQuiz(@Param("user") User user, @Param("quiz") Quiz quiz);
    
    // Kiểm tra user đã pass quiz này chưa
    @Query("SELECT CASE WHEN COUNT(qa) > 0 THEN true ELSE false END FROM QuizAttempt qa WHERE qa.user.id = :userId AND qa.quiz.id = :quizId AND qa.isPassed = true")
    boolean hasUserPassedQuiz(@Param("userId") Long userId, @Param("quizId") Long quizId);
}
