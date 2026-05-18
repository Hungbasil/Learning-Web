package com.learningweb.learning_platform.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lesson_materials")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String fileUrl;        // Link tới file (PDF, PPT, v.v)
    private String materialType;   // "PDF", "VIDEO", "DOCUMENT", "CODE"
    
    private Integer orderIndex;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;
}
