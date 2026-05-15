package com.learningweb.learning_platform.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_skills")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String skillName;

    @Column(length = 50)
    private String proficiency; // Beginner, Intermediate, Advanced, Expert

    @Column(nullable = false)
    private Integer progress = 0; // 0-100%

    @Column(name = "acquired_at")
    private LocalDateTime acquiredAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.acquiredAt == null) {
            this.acquiredAt = LocalDateTime.now();
        }
    }
}
