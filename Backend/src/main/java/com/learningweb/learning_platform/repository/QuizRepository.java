package com.learningweb.learning_platform.repository;

import com.learningweb.learning_platform.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
}
