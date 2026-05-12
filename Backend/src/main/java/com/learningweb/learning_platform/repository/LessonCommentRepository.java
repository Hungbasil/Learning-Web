package com.learningweb.learning_platform.repository;


import com.learningweb.learning_platform.entity.LessonComment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LessonCommentRepository extends JpaRepository<LessonComment, Long> {
    // Lấy tất cả bình luận của một bài học, sắp xếp mới nhất lên đầu
    List<LessonComment> findByLessonIdAndParentCommentIsNullOrderByCreatedAtDesc(Long lessonId);
}
