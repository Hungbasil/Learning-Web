package com.learningweb.learning_platform.repository;


import com.learningweb.learning_platform.entity.PaymentTransaction;
import com.learningweb.learning_platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    Optional<PaymentTransaction> findByAppTransId(String appTransId);
    List<PaymentTransaction> findByUserOrderByCreatedAtDesc(User user);
}
