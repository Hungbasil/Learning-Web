package com.learningweb.learning_platform.repository;

import com.learningweb.learning_platform.entity.StudyNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudyNoteRepository extends JpaRepository<StudyNote, Long> {
    List<StudyNote> findBySessionId(Long sessionId);
}
