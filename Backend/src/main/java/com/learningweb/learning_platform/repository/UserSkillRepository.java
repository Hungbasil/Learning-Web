package com.learningweb.learning_platform.repository;

import com.learningweb.learning_platform.entity.User;
import com.learningweb.learning_platform.entity.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByUser(User user);
    
    List<UserSkill> findByUserOrderByProgressDesc(User user);
    
    Optional<UserSkill> findByUserAndSkillName(User user, String skillName);
}
