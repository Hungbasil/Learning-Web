package com.learningweb.learning_platform.repository;

import com.learningweb.learning_platform.entity.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {
}
