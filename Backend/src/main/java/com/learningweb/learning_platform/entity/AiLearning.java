package com.learningweb.learning_platform.entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_learning_paths")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiLearning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String targetLanguage;
    private String currentLevel;
    private String studyGoal;
    private String hoursPerWeek;

    @Column(columnDefinition = "TEXT")
    private String generatedRoadmap;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
