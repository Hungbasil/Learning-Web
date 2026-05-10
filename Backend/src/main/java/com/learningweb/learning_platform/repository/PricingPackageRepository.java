package com.learningweb.learning_platform.repository;

import com.learningweb.learning_platform.entity.PricingPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface PricingPackageRepository extends JpaRepository<PricingPackage, Long> {

    @Query("SELECT p FROM PricingPackage p WHERE p.amount <= :paidAmount AND p.active = true ORDER BY p.amount DESC LIMIT 1")
    Optional<PricingPackage> findBestFitPackage(Long paidAmount);
}
