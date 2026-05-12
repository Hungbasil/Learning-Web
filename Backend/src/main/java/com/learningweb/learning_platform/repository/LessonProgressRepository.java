package com.learningweb.learning_platform.repository;

import com.learningweb.learning_platform.entity.LessonProgress;
import com.learningweb.learning_platform.entity.User;
import com.learningweb.learning_platform.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {
    Optional<LessonProgress> findByUserAndLesson(User user, Lesson lesson);
    long countByUserAndLesson_Section_Course_IdAndCompleted(User user, Long courseId, boolean completed);
}
