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
import java.util.Map;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    @Autowired private InterviewRepository interviewRepository;
    @Autowired private InterviewQuestionRepository questionRepository;
    @Autowired private InterviewSessionRepository sessionRepository;
    @Autowired private InterviewAnswerRepository answerRepository;
    @Autowired private com.learningweb.learning_platform.service.OllamaService ollamaService;
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

        // --- BẮT ĐẦU LOGIC AI CHẤM ĐIỂM ---
        List<InterviewAnswer> answers = answerRepository.findBySession(session);
        for (InterviewAnswer answer : answers) {
            // Chỉ bắt AI chấm câu nào là "CODE"
            if ("CODE".equals(answer.getQuestion().getQuestionType()) && answer.getUserAnswer() != null) {

                System.out.println("⏳ Đang chờ chấm câu hỏi Code id: " + answer.getId() + "...");
                Map<String, Object> aiResult = ollamaService.gradeCodeAnswer(
                        answer.getQuestion().getContent(),
                        answer.getUserAnswer()
                );

                if (aiResult != null) {
                    answer.setScore((Integer) aiResult.get("score"));
                    answer.setFeedback(" [Gia sư AI]: " + aiResult.get("feedback"));
                    answerRepository.save(answer);
                    System.out.println("Đã chấm xong!");
                }
            }
        }
        // --- KẾT THÚC LOGIC AI ---

        session.setStatus("WAITING_FOR_REVIEW");
        session.setEndTime(LocalDateTime.now());
        sessionRepository.save(session);

        return ResponseEntity.ok("Đã nộp bài phỏng vấn thành công! Hệ thống sẽ tự động chấm các bài Code, vui lòng chờ Giảng viên đánh giá tổng thể.");
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
