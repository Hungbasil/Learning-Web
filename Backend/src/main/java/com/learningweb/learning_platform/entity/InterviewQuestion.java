package com.learningweb.learning_platform.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "interview_questions")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id")
    private Interview interview;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String questionType;
    private String difficulty;
    private Integer timeLimitMinutes;
    private Integer orderIndex;
}
