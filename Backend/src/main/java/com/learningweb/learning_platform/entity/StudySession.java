package com.learningweb.learning_platform.entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "study_sessions")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudySession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Long relatedCourseId;

    private Integer workDuration;
    private Integer breakDuration;

    private String backgroundMusic;

    private String status;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    // New fields for stats tracking
    private Integer actualDuration;  // Thời gian thực tế (phút)
    private Integer xpEarned;         // XP kiếm được
    private Integer pomodorosCompleted; // Số pomodoros hoàn thành
    private Integer notesWritten;     // Số ghi chú viết
    private Integer tasksCompleted;   // Số task hoàn thành

    @PrePersist
    protected void onCreate() {
        startTime = LocalDateTime.now();
        if (status == null) {
            status = "ONGOING";
        }
        // Initialize stats with 0
        if (xpEarned == null) xpEarned = 0;
        if (pomodorosCompleted == null) pomodorosCompleted = 0;
        if (notesWritten == null) notesWritten = 0;
        if (tasksCompleted == null) tasksCompleted = 0;
    }
}
