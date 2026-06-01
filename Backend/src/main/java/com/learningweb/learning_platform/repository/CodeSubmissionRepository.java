package com.learningweb.learning_platform.repository;

import com.learningweb.learning_platform.entity.CodeSubmission;
import com.learningweb.learning_platform.entity.User;
import com.learningweb.learning_platform.entity.CodeChallenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CodeSubmissionRepository extends JpaRepository<CodeSubmission, Long> {
    // Tìm submission ACCEPTED cuối cùng của user cho challenge này
    @Query("SELECT cs FROM CodeSubmission cs WHERE cs.user = :user AND cs.challenge = :challenge AND cs.status = 'ACCEPTED' ORDER BY cs.submittedAt DESC LIMIT 1")
    Optional<CodeSubmission> findAcceptedSubmissionByUserAndChallenge(@Param("user") User user, @Param("challenge") CodeChallenge challenge);
    
    // Kiểm tra user đã submit ACCEPTED cho challenge này chưa
    @Query("SELECT CASE WHEN COUNT(cs) > 0 THEN true ELSE false END FROM CodeSubmission cs WHERE cs.user.id = :userId AND cs.challenge.id = :challengeId AND cs.status = 'ACCEPTED'")
    boolean hasUserAcceptedChallenge(@Param("userId") Long userId, @Param("challengeId") Long challengeId);
}
