package com.learningweb.learning_platform.repository;

import com.learningweb.learning_platform.entity.LessonMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LessonMaterialRepository extends JpaRepository<LessonMaterial, Long> {
    List<LessonMaterial> findByLessonIdOrderByOrderIndex(Long lessonId);
}
