package com.learningweb.learning_platform.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer totalXp = 0;

    @Column(unique = true, nullable = false)
    private String email;
    @Column(length = 6)
    private String otpCode;
    private LocalDateTime otpExpiryTime;

    @Column(nullable = false)
    private String password;
    private String fullName;
    private String role;
    private Integer aiTokens = 1;
    private Boolean isEmailVerified = false;
    
    private Boolean isPremium = false;
    private LocalDateTime premiumExpiryDate;
}
