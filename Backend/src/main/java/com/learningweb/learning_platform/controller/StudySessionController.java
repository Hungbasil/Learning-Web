package com.learningweb.learning_platform.controller;


import com.learningweb.learning_platform.dto.StudySessionRequest;
import com.learningweb.learning_platform.dto.StudySessionStatsResponse;
import com.learningweb.learning_platform.entity.StudySession;
import com.learningweb.learning_platform.entity.StudyTodoItem;
import com.learningweb.learning_platform.entity.StudyNote;
import com.learningweb.learning_platform.entity.User;
import com.learningweb.learning_platform.repository.StudySessionRepository;
import com.learningweb.learning_platform.repository.StudyTodoItemRepository;
import com.learningweb.learning_platform.repository.StudyNoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
public class StudySessionController {

    @Autowired
    private StudySessionRepository sessionRepository;

    @Autowired
    private StudyTodoItemRepository todoRepository;

    @Autowired
    private StudyNoteRepository noteRepository;

    @PostMapping
    public ResponseEntity<?> createSession(@RequestBody StudySessionRequest request) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        StudySession newSession = StudySession.builder()
                .user(currentUser)
                .title(request.getTitle())
                .description(request.getDescription())
                .relatedCourseId(request.getRelatedCourseId())
                .topic(request.getTopic())
                .subject(request.getSubject())
                .workDuration(request.getWorkDuration())
                .breakDuration(request.getBreakDuration())
                .longBreakDuration(request.getLongBreakDuration())
                .maxParticipants(request.getMaxParticipants())
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

    // ===== GET Session Detail =====
    @GetMapping("/{id}")
    public ResponseEntity<?> getSessionDetail(@PathVariable Long id) {
        StudySession session = sessionRepository.findById(id).orElse(null);
        if (session == null) return ResponseEntity.badRequest().body("Không tìm thấy phiên học");
        
        Map<String, Object> response = new HashMap<>();
        response.put("session", session);
        response.put("todos", todoRepository.findBySessionId(id));
        response.put("notes", noteRepository.findBySessionId(id));
        
        return ResponseEntity.ok(response);
    }

    // ===== TODOS ENDPOINTS =====
    
    // Get all todos for a session
    @GetMapping("/{id}/todos")
    public ResponseEntity<?> getTodos(@PathVariable Long id) {
        List<StudyTodoItem> todos = todoRepository.findBySessionId(id);
        return ResponseEntity.ok(todos);
    }

    // Create a new todo
    @PostMapping("/{id}/todos")
    public ResponseEntity<?> createTodo(@PathVariable Long id, @RequestBody Map<String, String> request) {
        StudySession session = sessionRepository.findById(id).orElse(null);
        if (session == null) return ResponseEntity.badRequest().body("Không tìm thấy phiên học");

        String todoText = request.get("text");
        if (todoText == null || todoText.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Nội dung công việc không được trống");
        }

        StudyTodoItem todo = StudyTodoItem.builder()
                .session(session)
                .text(todoText)
                .completed(false)
                .build();

        StudyTodoItem savedTodo = todoRepository.save(todo);
        return ResponseEntity.ok(savedTodo);
    }

    // Update todo (toggle completed or update text)
    @PutMapping("/{id}/todos/{todoId}")
    public ResponseEntity<?> updateTodo(@PathVariable Long id, @PathVariable Long todoId, @RequestBody Map<String, Object> request) {
        StudyTodoItem todo = todoRepository.findById(todoId).orElse(null);
        if (todo == null) return ResponseEntity.badRequest().body("Không tìm thấy công việc");

        if (request.containsKey("completed")) {
            todo.setCompleted((Boolean) request.get("completed"));
        }
        if (request.containsKey("text")) {
            todo.setText((String) request.get("text"));
        }

        StudyTodoItem updatedTodo = todoRepository.save(todo);
        return ResponseEntity.ok(updatedTodo);
    }

    // Delete a todo
    @DeleteMapping("/{id}/todos/{todoId}")
    public ResponseEntity<?> deleteTodo(@PathVariable Long id, @PathVariable Long todoId) {
        StudyTodoItem todo = todoRepository.findById(todoId).orElse(null);
        if (todo == null) return ResponseEntity.badRequest().body("Không tìm thấy công việc");

        todoRepository.delete(todo);
        return ResponseEntity.ok("Xóa công việc thành công");
    }

    // ===== NOTES ENDPOINTS =====

    // Get all notes for a session
    @GetMapping("/{id}/notes")
    public ResponseEntity<?> getNotes(@PathVariable Long id) {
        List<StudyNote> notes = noteRepository.findBySessionId(id);
        return ResponseEntity.ok(notes);
    }

    // Create a new note
    @PostMapping("/{id}/notes")
    public ResponseEntity<?> createNote(@PathVariable Long id, @RequestBody Map<String, String> request) {
        StudySession session = sessionRepository.findById(id).orElse(null);
        if (session == null) return ResponseEntity.badRequest().body("Không tìm thấy phiên học");

        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String content = request.get("content");

        StudyNote note = StudyNote.builder()
                .session(session)
                .user(currentUser)
                .content(content)
                .build();

        StudyNote savedNote = noteRepository.save(note);
        return ResponseEntity.ok(savedNote);
    }

    // Update a note
    @PutMapping("/{id}/notes/{noteId}")
    public ResponseEntity<?> updateNote(@PathVariable Long id, @PathVariable Long noteId, @RequestBody Map<String, String> request) {
        StudyNote note = noteRepository.findById(noteId).orElse(null);
        if (note == null) return ResponseEntity.badRequest().body("Không tìm thấy ghi chú");

        String content = request.get("content");
        if (content != null) {
            note.setContent(content);
        }

        StudyNote updatedNote = noteRepository.save(note);
        return ResponseEntity.ok(updatedNote);
    }

    // Delete a note
    @DeleteMapping("/{id}/notes/{noteId}")
    public ResponseEntity<?> deleteNote(@PathVariable Long id, @PathVariable Long noteId) {
        StudyNote note = noteRepository.findById(noteId).orElse(null);
        if (note == null) return ResponseEntity.badRequest().body("Không tìm thấy ghi chú");

        noteRepository.delete(note);
        return ResponseEntity.ok("Xóa ghi chú thành công");
    }

    // ===== BACKGROUND MUSIC ENDPOINT =====
    
    // Update background music for session
    @PutMapping("/{id}/music")
    public ResponseEntity<?> updateBackgroundMusic(@PathVariable Long id, @RequestBody Map<String, String> request) {
        StudySession session = sessionRepository.findById(id).orElse(null);
        if (session == null) return ResponseEntity.badRequest().body("Không tìm thấy phiên học");

        String backgroundMusic = request.get("backgroundMusic");
        session.setBackgroundMusic(backgroundMusic);
        sessionRepository.save(session);

        return ResponseEntity.ok(session);
    }
}
