package com.learningweb.learning_platform.controller;


import com.learningweb.learning_platform.dto.*;
import com.learningweb.learning_platform.entity.Course;
import com.learningweb.learning_platform.entity.Enrollment;
import com.learningweb.learning_platform.entity.User;
import com.learningweb.learning_platform.repository.EnrollmentRepository;
import com.learningweb.learning_platform.repository.LessonProgressRepository;
import com.learningweb.learning_platform.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private LessonProgressRepository progressRepository;

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/my-progress")
    public ResponseEntity<?> getMyProgress() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Enrollment> enrollments = enrollmentRepository.findByUser(currentUser);

        int completedCoursesCount = 0;
        List<DashboardResponse.EnrolledCourseDto> courseDtos = new ArrayList<>();

        for (Enrollment enrollment : enrollments) {
            Course course = enrollment.getCourse();

            int totalLessons = course.getTotalLessons();

            long completedLessons = progressRepository.countByUserAndLesson_Section_Course_IdAndCompleted(
                    currentUser, course.getId(), true
            );

            // Tính phần trăm
            double percent = 0.0;
            if (totalLessons > 0) {
                percent = ((double) completedLessons / totalLessons) * 100;
                percent = Math.round(percent * 10.0) / 10.0; // Làm tròn 1 chữ số thập phân
            }

            if (percent == 100.0) {
                completedCoursesCount++;
            }

            courseDtos.add(DashboardResponse.EnrolledCourseDto.builder()
                    .courseId(course.getId())
                    .title(course.getTitle())
                    .imageUrl(course.getImageUrl())
                    .totalLessons(totalLessons)
                    .completedLessons((int) completedLessons)
                    .progressPercent(percent)
                    .build());
        }
        DashboardResponse response = DashboardResponse.builder()
                .totalEnrolledCourses(enrollments.size())
                .totalCompletedCourses(completedCoursesCount)
                .inProgressCourses(courseDtos)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard(@RequestParam(defaultValue = "10") int limit, 
                                            @RequestParam(defaultValue = "0") int offset) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(dashboardService.getLeaderboard(currentUser, limit, offset));
    }

    @GetMapping("/activity-heatmap")
    public ResponseEntity<?> getActivityHeatmap(@RequestParam(defaultValue = "365") int days) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(dashboardService.getActivityHeatmap(currentUser, days));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(dashboardService.getDashboardStats(currentUser));
    }

    @GetMapping("/skills")
    public ResponseEntity<?> getSkills() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(dashboardService.getUserSkills(currentUser));
    }

    @GetMapping("/goals")
    public ResponseEntity<?> getGoals() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(dashboardService.getPersonalGoals(currentUser));
    }
}
