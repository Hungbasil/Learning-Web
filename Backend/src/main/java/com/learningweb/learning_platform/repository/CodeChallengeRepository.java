package com.learningweb.learning_platform.repository;

import com.learningweb.learning_platform.entity.CodeChallenge;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CodeChallengeRepository extends JpaRepository<CodeChallenge, Long> {
}
