package com.learningweb.learning_platform.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "study_todo_items")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyTodoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    private StudySession session;

    private String text;

    private Boolean completed;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (completed == null) {
            completed = false;
        }
    }
}
