package com.learningweb.learning_platform.controller;

import com.learningweb.learning_platform.entity.*;
import com.learningweb.learning_platform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    @Autowired private BookmarkRepository bookmarkRepository;
    @Autowired private CourseRepository courseRepository;

    // Toggle bookmark - thêm hoặc xóa bookmark
    @PostMapping("/{courseId}")
    public ResponseEntity<?> toggleBookmark(@PathVariable Long courseId) {
        try {
            User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Course course = courseRepository.findById(courseId).orElse(null);

            if (course == null) {
                return ResponseEntity.badRequest().body("Khóa học không tồn tại");
            }

            var existingBookmark = bookmarkRepository.findByUserAndCourse(user, course);
            
            Map<String, Object> response = new HashMap<>();
            if (existingBookmark.isPresent()) {
                // Nếu đã bookmark thì xóa
                bookmarkRepository.delete(existingBookmark.get());
                response.put("isBookmarked", false);
                response.put("message", "Đã bỏ lưu khóa học");
            } else {
                // Nếu chưa thì thêm
                Bookmark bookmark = Bookmark.builder()
                        .user(user)
                        .course(course)
                        .build();
                bookmarkRepository.save(bookmark);
                response.put("isBookmarked", true);
                response.put("message", "Đã lưu khóa học");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    // Kiểm tra xem user đã bookmark course này chưa
    @GetMapping("/{courseId}/check")
    public ResponseEntity<?> checkBookmark(@PathVariable Long courseId) {
        try {
            User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            boolean isBookmarked = bookmarkRepository.existsByUserIdAndCourseId(user.getId(), courseId);
            
            Map<String, Boolean> response = new HashMap<>();
            response.put("isBookmarked", isBookmarked);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi hệ thống: " + e.getMessage());
        }
    }
}
