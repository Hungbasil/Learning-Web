package com.learningweb.learning_platform.controller;


import com.learningweb.learning_platform.dto.StudySessionRequest;
import com.learningweb.learning_platform.entity.StudySession;
import com.learningweb.learning_platform.entity.User;
import com.learningweb.learning_platform.repository.StudySessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

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

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeSession(@PathVariable Long id) {
        StudySession session = sessionRepository.findById(id).orElse(null);
        if (session == null) return ResponseEntity.badRequest().body("Không tìm thấy phiên học");

        session.setStatus("COMPLETED");
        session.setEndTime(LocalDateTime.now());
        sessionRepository.save(session);

        return ResponseEntity.ok("Chúc mừng bạn đã hoàn thành phiên học!");
    }
}
