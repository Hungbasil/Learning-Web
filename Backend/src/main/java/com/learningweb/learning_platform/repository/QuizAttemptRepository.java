package com.learningweb.learning_platform.repository;

import com.learningweb.learning_platform.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
}
