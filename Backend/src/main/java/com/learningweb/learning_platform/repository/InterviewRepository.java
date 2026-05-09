package com.learningweb.learning_platform.repository;

import com.learningweb.learning_platform.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
}
