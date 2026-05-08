package com.learningweb.learning_platform.dto;


import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class DashboardResponse {
    private int totalEnrolledCourses;
    private int totalCompletedCourses;

    private List<EnrolledCourseDto> inProgressCourses;

    @Data
    @Builder
    public static class EnrolledCourseDto {
        private Long courseId;
        private String title;
        private String imageUrl;
        private int totalLessons;
        private int completedLessons;
        private double progressPercent;
    }
}
