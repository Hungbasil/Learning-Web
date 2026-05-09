package com.learningweb.learning_platform.repository;


import com.learningweb.learning_platform.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    Optional<PaymentTransaction> findByAppTransId(String appTransId);
}
