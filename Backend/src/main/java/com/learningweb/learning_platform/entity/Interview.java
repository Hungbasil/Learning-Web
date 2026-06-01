package com.learningweb.learning_platform.entity;


import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "interviews")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Interview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String role;
    private String field;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer durationMinutes;
    private Integer totalQuestions;
    private Integer passingScore;
    private Integer xpReward;
    private String difficulty;

    @OneToMany(mappedBy = "interview", cascade = CascadeType.ALL)
    private List<InterviewQuestion> questions;
}