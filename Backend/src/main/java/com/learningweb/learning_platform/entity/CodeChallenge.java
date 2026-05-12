package com.learningweb.learning_platform.entity;


import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "code_challenges")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class CodeChallenge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String difficulty;
    private Integer xpReward;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;        // Bài thực hành gắn với bài học nào

    @OneToMany(mappedBy = "challenge", cascade = CascadeType.ALL)
    private List<TestCase> testCases;
}
