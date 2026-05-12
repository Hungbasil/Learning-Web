package com.learningweb.learning_platform.repository;

import com.learningweb.learning_platform.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {}
