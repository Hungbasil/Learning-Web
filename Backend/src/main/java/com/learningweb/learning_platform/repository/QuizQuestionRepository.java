package com.learningweb.learning_platform.repository;

import com.learningweb.learning_platform.entity.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {
}
