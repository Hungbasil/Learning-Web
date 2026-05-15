package com.learningweb.learning_platform.repository;

import com.learningweb.learning_platform.entity.User;
import com.learningweb.learning_platform.entity.PersonalGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonalGoalRepository extends JpaRepository<PersonalGoal, Long> {
    List<PersonalGoal> findByUserOrderByDeadlineAsc(User user);
    
    List<PersonalGoal> findByUserAndStatus(User user, String status);
    
    int countByUserAndStatus(User user, String status);
}
