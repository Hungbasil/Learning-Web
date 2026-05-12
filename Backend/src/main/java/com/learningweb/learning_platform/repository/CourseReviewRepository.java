package com.learningweb.learning_platform.repository;


import com.learningweb.learning_platform.entity.CourseReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface CourseReviewRepository extends JpaRepository<CourseReview, Long> {

    Optional<CourseReview> findByUserIdAndCourseId(Long userId, Long courseId);
    List<CourseReview> findByCourseIdOrderByCreatedAtDesc(Long courseId);

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM CourseReview r WHERE r.course.id = :courseId")
    Double getAverageRatingByCourseId(Long courseId);
    @Query("SELECT COUNT(r) FROM CourseReview r WHERE r.course.id = :courseId AND r.rating = :star")
    Long countByCourseIdAndRating(Long courseId, Integer star);
    Long countByCourseId(Long courseId);
}
