package com.learningweb.learning_platform.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudySessionStatsResponse {

    private Integer totalStudyTime;         // Tổng thời gian học tập (phút)
    private Integer totalXpEarned;          // Tổng XP kiếm được
    private Integer currentStreak;          // Chuỗi hiện tại (ngày)
    private Integer completedSessions;      // Phiên hoàn thành
    private Integer totalSessions;          // Tổng phiên
    private Integer totalPomodoros;         // Tổng pomodoros
    private Double completionRate;          // Tỷ lệ hoàn thành (%)
    private Double averageSessionDuration;  // Thời gian TBB mỗi phiên
    private Integer totalNotesWritten;      // Tổng ghi chú viết
    private Integer totalTasksCompleted;    // Tổng task hoàn thành
}
