package com.learningweb.learning_platform.repository;

import com.learningweb.learning_platform.entity.Enrollment;
import com.learningweb.learning_platform.entity.User;
import com.learningweb.learning_platform.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    Optional<Enrollment> findByUserAndCourse(User user, Course course);
}
