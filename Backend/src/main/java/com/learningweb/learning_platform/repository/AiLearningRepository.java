package com.learningweb.learning_platform.repository;

import com.learningweb.learning_platform.entity.AiLearning;
import com.learningweb.learning_platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AiLearningRepository extends JpaRepository<AiLearning, Long> {
    Optional<AiLearning> findByUser(User user);
}
