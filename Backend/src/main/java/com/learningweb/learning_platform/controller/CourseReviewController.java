package com.learningweb.learning_platform.controller;


import com.learningweb.learning_platform.dto.ReviewRequest;
import com.learningweb.learning_platform.dto.ReviewResponse;
import com.learningweb.learning_platform.dto.ReviewStatsResponse;
import com.learningweb.learning_platform.entity.*;
import com.learningweb.learning_platform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseReviewController {

    @Autowired private CourseReviewRepository reviewRepository;
    @Autowired private CourseRepository courseRepository;
    // API GỬI/CẬP NHẬT ĐÁNH GIÁ
    @PostMapping("/{courseId}/reviews")
    public ResponseEntity<?> submitReview(
            @PathVariable Long courseId,
            @RequestBody ReviewRequest request) {

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course == null) return ResponseEntity.badRequest().body("Khóa học không tồn tại.");

        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            return ResponseEntity.badRequest().body("Số sao phải nằm trong khoảng từ 1 đến 5.");
        }

        // Kiểm tra có vote ko -> có rồi thì ghi đè / chưa thì tạo mới
        CourseReview review = reviewRepository.findByUserIdAndCourseId(user.getId(), courseId)
                .orElse(new CourseReview());

        review.setUser(user);
        review.setCourse(course);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        reviewRepository.save(review);
        return ResponseEntity.ok("Đánh giá thành công!");
    }

    // API LẤY CỤC THỐNG KÊ (TRUNG BÌNH + BIỂU ĐỒ) CHO UI

    @GetMapping("/{courseId}/reviews/stats")
    public ResponseEntity<ReviewStatsResponse> getReviewStats(@PathVariable Long courseId) {
        Double avg = reviewRepository.getAverageRatingByCourseId(courseId);
        Long total = reviewRepository.countByCourseId(courseId);

        double roundedAvg = Math.round(avg * 10.0) / 10.0;

        // Gom dữ liệu 5 thanh biểu đồ
        Map<Integer, Long> distribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            distribution.put(i, reviewRepository.countByCourseIdAndRating(courseId, i));
        }

        ReviewStatsResponse stats = ReviewStatsResponse.builder()
                .averageRating(roundedAvg)
                .totalReviews(total)
                .starDistribution(distribution)
                .build();

        return ResponseEntity.ok(stats);
    }


    // API LẤY DANH SÁCH TEXT COMMENT PHÍA DƯỚI
    @GetMapping("/{courseId}/reviews")
    public ResponseEntity<List<ReviewResponse>> getReviewsList(@PathVariable Long courseId) {
        List<CourseReview> reviews = reviewRepository.findByCourseIdOrderByCreatedAtDesc(courseId);
        return ResponseEntity.ok(reviews.stream().map(ReviewResponse::fromEntity).toList());
    }
}
