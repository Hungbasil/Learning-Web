package com.learningweb.learning_platform.controller;


import com.learningweb.learning_platform.dto.CommentRequest;
import com.learningweb.learning_platform.entity.*;
import com.learningweb.learning_platform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
public class LessonCommentController {

    @Autowired private LessonCommentRepository commentRepository;
    @Autowired private LessonRepository lessonRepository; // Giả sử Hưng đã có LessonRepository

    //  LẤY DANH SÁCH BÌNH LUẬN
    @GetMapping("/{lessonId}/comments")
    public ResponseEntity<?> getComments(@PathVariable Long lessonId) {
        List<LessonComment> rootComments = commentRepository
                .findByLessonIdAndParentCommentIsNullOrderByCreatedAtDesc(lessonId);
        return ResponseEntity.ok(rootComments);
    }
    @PostMapping("/{lessonId}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable Long lessonId,
            @RequestBody CommentRequest request) {

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Lesson lesson = lessonRepository.findById(lessonId).orElse(null);
        if (lesson == null) return ResponseEntity.badRequest().body("Không tìm thấy bài học!");

        // Kiểm tra giới hạn
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Nội dung bình luận không được để trống.");
        }
        if (request.getContent().length() > 2000) {
            return ResponseEntity.badRequest().body("Bình luận vượt quá giới hạn 2000 ký tự.");
        }

        LessonComment parent = null;
        if (request.getParentId() != null) {
            parent = commentRepository.findById(request.getParentId()).orElse(null);
            if (parent == null) return ResponseEntity.badRequest().body("Bình luận gốc không tồn tại để reply.");
        }

        LessonComment newComment = LessonComment.builder()
                .user(user)
                .lesson(lesson)
                .content(request.getContent().trim())
                .parentComment(parent)
                .build();

        commentRepository.save(newComment);
        return ResponseEntity.ok(newComment);
    }
}
