package com.learningweb.learning_platform.controller;


import com.learningweb.learning_platform.entity.*;
import com.learningweb.learning_platform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/learning")
public class EnrollmentController {

    @Autowired private EnrollmentRepository enrollmentRepository;
    @Autowired private CourseRepository courseRepository;
    @Autowired private LessonRepository lessonRepository;
    @Autowired private LessonProgressRepository progressRepository;

    @PostMapping("/enroll/{courseId}")
    public ResponseEntity<?> enrollCourse(@PathVariable Long courseId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Course course = courseRepository.findById(courseId).orElse(null);

        if (course == null) return ResponseEntity.badRequest().body("Khóa học không tồn tại");
        if (enrollmentRepository.findByUserAndCourse(user, course).isPresent()) {
            return ResponseEntity.badRequest().body("Bạn đã đăng ký khóa học này rồi");
        }

        Enrollment enrollment = Enrollment.builder().user(user).course(course).build();
        enrollmentRepository.save(enrollment);
        return ResponseEntity.ok("Ghi danh thành công!");
    }

    @PostMapping("/complete-lesson/{lessonId}")
    public ResponseEntity<?> completeLesson(@PathVariable Long lessonId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Lesson lesson = lessonRepository.findById(lessonId).orElse(null);

        if (lesson == null) return ResponseEntity.badRequest().body("Bài học không tồn tại");

        LessonProgress progress = progressRepository.findByUserAndLesson(user, lesson)
                .orElse(LessonProgress.builder().user(user).lesson(lesson).build());

        progress.setCompleted(true);
        progressRepository.save(progress);
        return ResponseEntity.ok("Đã đánh dấu hoàn thành bài học!");
    }
}
