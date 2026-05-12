package com.learningweb.learning_platform.repository;

import com.learningweb.learning_platform.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {}
