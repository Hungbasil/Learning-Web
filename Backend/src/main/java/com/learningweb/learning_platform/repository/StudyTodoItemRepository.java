package com.learningweb.learning_platform.repository;

import com.learningweb.learning_platform.entity.StudyTodoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudyTodoItemRepository extends JpaRepository<StudyTodoItem, Long> {
    List<StudyTodoItem> findBySessionId(Long sessionId);
}
