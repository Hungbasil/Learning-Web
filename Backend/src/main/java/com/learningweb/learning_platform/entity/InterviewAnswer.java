package com.learningweb.learning_platform.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "interview_answers")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    private InterviewSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private InterviewQuestion question;

    @Column(columnDefinition = "TEXT")
    private String userAnswer;

    private Integer score;

    @Column(columnDefinition = "TEXT")
    private String feedback;
}
