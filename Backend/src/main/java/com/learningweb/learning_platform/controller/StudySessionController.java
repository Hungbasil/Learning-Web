package com.learningweb.learning_platform.controller;


import com.learningweb.learning_platform.dto.StudySessionRequest;
import com.learningweb.learning_platform.dto.StudySessionStatsResponse;
import com.learningweb.learning_platform.entity.StudySession;
import com.learningweb.learning_platform.entity.User;
import com.learningweb.learning_platform.repository.StudySessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class StudySessionController {

    @Autowired
    private StudySessionRepository sessionRepository;

    @PostMapping
    public ResponseEntity<?> createSession(@RequestBody StudySessionRequest request) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        StudySession newSession = StudySession.builder()
                .user(currentUser)
                .title(request.getTitle())
                .description(request.getDescription())
                .relatedCourseId(request.getRelatedCourseId())
                .workDuration(request.getWorkDuration())
                .breakDuration(request.getBreakDuration())
                .backgroundMusic(request.getBackgroundMusic())
                .status("ONGOING") // Bắt đầu đếm giờ
                .build();

        sessionRepository.save(newSession);
        return ResponseEntity.ok(newSession);
    }

    @GetMapping("/history")
    public ResponseEntity<?> getSessionHistory() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(sessionRepository.findByUserOrderByStartTimeDesc(currentUser));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getSessionStats(@RequestParam(defaultValue = "30") Integer days) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        
        List<StudySession> sessions = sessionRepository.findByUserOrderByStartTimeDesc(currentUser);
        
        // Filter sessions within date range
        List<StudySession> filteredSessions = sessions.stream()
                .filter(s -> s.getStartTime().isAfter(since))
                .toList();
        
        // Calculate stats
        int totalStudyTime = 0;
        int totalXp = 0;
        int completedSessions = 0;
        int totalPomodoros = 0;
        int totalNotesWritten = 0;
        int totalTasksCompleted = 0;
        
        for (StudySession session : filteredSessions) {
            if ("COMPLETED".equals(session.getStatus())) {
                completedSessions++;
                if (session.getActualDuration() != null) {
                    totalStudyTime += session.getActualDuration();
                }
            }
            if (session.getXpEarned() != null) totalXp += session.getXpEarned();
            if (session.getPomodorosCompleted() != null) totalPomodoros += session.getPomodorosCompleted();
            if (session.getNotesWritten() != null) totalNotesWritten += session.getNotesWritten();
            if (session.getTasksCompleted() != null) totalTasksCompleted += session.getTasksCompleted();
        }
        
        double completionRate = filteredSessions.isEmpty() ? 0 : 
                (double) completedSessions / filteredSessions.size() * 100;
        double averageDuration = completedSessions == 0 ? 0 : 
                (double) totalStudyTime / completedSessions;
        
        // Calculate current streak
        int currentStreak = calculateStreak(sessions);
        
        StudySessionStatsResponse stats = StudySessionStatsResponse.builder()
                .totalStudyTime(totalStudyTime)
                .totalXpEarned(totalXp)
                .currentStreak(currentStreak)
                .completedSessions(completedSessions)
                .totalSessions(filteredSessions.size())
                .totalPomodoros(totalPomodoros)
                .completionRate(completionRate)
                .averageSessionDuration(averageDuration)
                .totalNotesWritten(totalNotesWritten)
                .totalTasksCompleted(totalTasksCompleted)
                .build();
        
        return ResponseEntity.ok(stats);
    }

    private int calculateStreak(List<StudySession> sessions) {
        if (sessions.isEmpty()) return 0;
        
        int streak = 0;
        LocalDateTime today = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        
        for (int i = 0; i < 365; i++) {
            LocalDateTime checkDate = today.minusDays(i);
            LocalDateTime nextDate = checkDate.plusDays(1);
            
            boolean hasSessionOnDay = sessions.stream()
                    .anyMatch(s -> "COMPLETED".equals(s.getStatus()) &&
                            s.getStartTime().isAfter(checkDate) &&
                            s.getStartTime().isBefore(nextDate));
            
            if (hasSessionOnDay) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }
        
        return streak;
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeSession(@PathVariable Long id, @RequestBody(required = false) StudySession updateData) {
        StudySession session = sessionRepository.findById(id).orElse(null);
        if (session == null) return ResponseEntity.badRequest().body("Không tìm thấy phiên học");

        session.setStatus("COMPLETED");
        session.setEndTime(LocalDateTime.now());
        
        // Update stats if provided
        if (updateData != null) {
            if (updateData.getActualDuration() != null) {
                session.setActualDuration(updateData.getActualDuration());
            }
            if (updateData.getXpEarned() != null) {
                session.setXpEarned(updateData.getXpEarned());
            }
            if (updateData.getPomodorosCompleted() != null) {
                session.setPomodorosCompleted(updateData.getPomodorosCompleted());
            }
            if (updateData.getNotesWritten() != null) {
                session.setNotesWritten(updateData.getNotesWritten());
            }
            if (updateData.getTasksCompleted() != null) {
                session.setTasksCompleted(updateData.getTasksCompleted());
            }
        }
        
        sessionRepository.save(session);

        return ResponseEntity.ok("Chúc mừng bạn đã hoàn thành phiên học!");
    }
}
