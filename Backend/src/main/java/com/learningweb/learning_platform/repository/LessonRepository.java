package com.learningweb.learning_platform.repository;

import com.learningweb.learning_platform.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonRepository extends JpaRepository<Lesson, Long> {}
