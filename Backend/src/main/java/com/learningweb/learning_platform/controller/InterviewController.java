package com.learningweb.learning_platform.controller;

package com.learningweb.learning_platform.controller;

import com.learningweb.learning_platform.dto.AnswerRequest;
import com.learningweb.learning_platform.dto.GradeRequest;
import com.learningweb.learning_platform.entity.*;
import com.learningweb.learning_platform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    @Autowired private InterviewRepository interviewRepository;
    @Autowired private InterviewQuestionRepository questionRepository;
    @Autowired private InterviewSessionRepository sessionRepository;
    @Autowired private InterviewAnswerRepository answerRepository;

    // ================= [PHẦN CỦA HỌC VIÊN] =================
    
    @PostMapping("/{interviewId}/start")
    public ResponseEntity<?> startInterview(@PathVariable Long interviewId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Interview interview = interviewRepository.findById(interviewId).orElse(null);

        if (interview == null) return ResponseEntity.badRequest().body("Không tìm thấy bài phỏng vấn");

        InterviewSession session = InterviewSession.builder()
                .user(user)
                .interview(interview)
                .status("ONGOING")
                .build();

        sessionRepository.save(session);
        return ResponseEntity.ok(session);
    }

    @PostMapping("/sessions/{sessionId}/answers")
    public ResponseEntity<?> submitAnswer(@PathVariable Long sessionId, @RequestBody AnswerRequest request) {
        InterviewSession session = sessionRepository.findById(sessionId).orElse(null);
        InterviewQuestion question = questionRepository.findById(request.getQuestionId()).orElse(null);

        if (session == null || question == null) return ResponseEntity.badRequest().body("Dữ liệu không hợp lệ");

        InterviewAnswer answer = answerRepository.findBySessionAndQuestion(session, question)
                .orElse(InterviewAnswer.builder().session(session).question(question).build());

        answer.setUserAnswer(request.getAnswerText());
        answerRepository.save(answer);

        return ResponseEntity.ok("Đã lưu nháp câu trả lời.");
    }

    @PutMapping("/sessions/{sessionId}/submit")
    public ResponseEntity<?> submitSession(@PathVariable Long sessionId) {
        InterviewSession session = sessionRepository.findById(sessionId).orElse(null);
        if (session == null) return ResponseEntity.badRequest().body("Không tìm thấy phiên làm bài");

        session.setStatus("SUBMITTED");
        session.setEndTime(LocalDateTime.now());
        sessionRepository.save(session);

        return ResponseEntity.ok("Đã nộp bài phỏng vấn thành công! Vui lòng chờ kết quả.");
    }

    // ================= [PHẦN GIẢNG VIÊN] =================

    @PutMapping("/answers/{answerId}/grade")
    public ResponseEntity<?> gradeAnswer(@PathVariable Long answerId, @RequestBody GradeRequest request) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!"ADMIN".equals(currentUser.getRole())) {
            return ResponseEntity.status(403).body("Chỉ Giảng viên mới được chấm bài!");
        }

        InterviewAnswer answer = answerRepository.findById(answerId).orElse(null);
        if (answer == null) return ResponseEntity.badRequest().body("Không tìm thấy câu trả lời");

        answer.setScore(request.getScore());
        answer.setFeedback(request.getFeedback());
        answerRepository.save(answer);
        InterviewSession session = answer.getSession();
        List<InterviewAnswer> allAnswers = answerRepository.findBySession(session);

        int totalScore = 0;
        for (InterviewAnswer a : allAnswers) {
            if (a.getScore() != null) {
                totalScore += a.getScore();
            }
        }

        session.setTotalScore(totalScore);
        session.setStatus("GRADED");
        sessionRepository.save(session);

        return ResponseEntity.ok("Chấm điểm thành công! Tổng điểm hiện tại: " + totalScore);
    }
}
