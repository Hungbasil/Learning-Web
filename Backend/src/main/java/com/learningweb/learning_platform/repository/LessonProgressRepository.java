package com.learningweb.learning_platform.repository;

import com.learningweb.learning_platform.entity.LessonProgress;
import com.learningweb.learning_platform.entity.User;
import com.learningweb.learning_platform.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {
    Optional<LessonProgress> findByUserAndLesson(User user, Lesson lesson);
    long countByUserAndLesson_Section_Course_IdAndCompleted(User user, Long courseId, boolean completed);
    
    // Custom queries for lesson progress
    @Query("SELECT COUNT(lp) FROM LessonProgress lp WHERE lp.user.id = :userId AND lp.lesson.section.course.id = :courseId AND lp.completed = :completed")
    Long countByUserIdAndCourseIdAndCompleted(@Param("userId") Long userId, @Param("courseId") Long courseId, @Param("completed") boolean completed);
    
    @Query("SELECT CASE WHEN COUNT(lp) > 0 THEN true ELSE false END FROM LessonProgress lp WHERE lp.user.id = :userId AND lp.lesson.id = :lessonId AND lp.completed = :completed")
    boolean existsByUserIdAndLessonIdAndCompleted(@Param("userId") Long userId, @Param("lessonId") Long lessonId, @Param("completed") boolean completed);
    
    @Query("SELECT CASE WHEN COUNT(lp) > 0 THEN true ELSE false END FROM LessonProgress lp WHERE lp.user.id = :userId AND lp.lesson.id = :lessonId")
    boolean existsByUserIdAndLessonId(@Param("userId") Long userId, @Param("lessonId") Long lessonId);
}
