package com.learningweb.learning_platform.repository;


import com.learningweb.learning_platform.entity.StudySession;
import com.learningweb.learning_platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudySessionRepository extends JpaRepository<StudySession, Long> {

    List<StudySession> findByUserOrderByStartTimeDesc(User user);
}
