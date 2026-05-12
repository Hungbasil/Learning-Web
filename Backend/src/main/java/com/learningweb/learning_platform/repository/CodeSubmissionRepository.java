package com.learningweb.learning_platform.repository;

import com.learningweb.learning_platform.entity.CodeSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CodeSubmissionRepository extends JpaRepository<CodeSubmission, Long> {
}
