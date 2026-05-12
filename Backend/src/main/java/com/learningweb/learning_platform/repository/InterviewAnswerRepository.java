package com.learningweb.learning_platform.repository;


import com.learningweb.learning_platform.entity.InterviewAnswer;
import com.learningweb.learning_platform.entity.InterviewQuestion;
import com.learningweb.learning_platform.entity.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface InterviewAnswerRepository extends JpaRepository<InterviewAnswer, Long> {
    Optional<InterviewAnswer> findBySessionAndQuestion(InterviewSession session, InterviewQuestion question);
    
    List<InterviewAnswer> findBySession(InterviewSession session);
}
