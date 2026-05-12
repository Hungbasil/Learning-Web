package com.learningweb.learning_platform.entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "code_submissions")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class CodeSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id")
    private CodeChallenge challenge;

    @Column(columnDefinition = "TEXT")
    private String submittedCode;

    private String language;
    private String status; // ACCEPTED (Đúng hết), WRONG_ANSWER (Sai output), ERROR (Lỗi cú pháp)

    private LocalDateTime submittedAt;

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }
}
