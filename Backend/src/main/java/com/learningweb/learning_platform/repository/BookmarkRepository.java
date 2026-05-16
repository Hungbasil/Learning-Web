package com.learningweb.learning_platform.repository;

import com.learningweb.learning_platform.entity.Bookmark;
import com.learningweb.learning_platform.entity.Course;
import com.learningweb.learning_platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    Optional<Bookmark> findByUserAndCourse(User user, Course course);
    
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
    
    List<Bookmark> findByUserIdOrderByBookmarkedAtDesc(Long userId);
}
