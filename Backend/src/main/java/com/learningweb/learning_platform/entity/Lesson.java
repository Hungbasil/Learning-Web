package com.learningweb.learning_platform.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lessons")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;
    private String videoUrl;

    @Column(columnDefinition = "TEXT")
    private String content;
    private Integer orderIndex;
    private Integer duration; // thời lượng bài học tính bằng phút
    private boolean isFree;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id")
    private Section section;
}