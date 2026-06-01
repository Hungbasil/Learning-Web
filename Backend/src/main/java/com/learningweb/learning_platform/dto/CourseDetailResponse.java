package com.learningweb.learning_platform.dto;


import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class CourseDetailResponse {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private String imageUrl;
    private String level;
    private String categoryName;
    private String instructorName;
    private Integer totalLessons;
    private String totalDuration;
    private Double averageRating;
    private Integer totalReviews;
    private Integer completionPercentage;
    private Boolean isFree;
    private String programmingLanguage;
    private String icon;
    private String bgColor;
    private Integer enrolledCount;
    private Boolean isBookmarked;
    private Boolean isEnrolled;

    private List<SectionDto> sections;

    @Data @Builder
    public static class SectionDto {
        private Long id;
        private String title;
        private Integer orderIndex;
        private List<LessonDto> lessons;
    }
    
    @Data @Builder
    public static class LessonDto {
        private Long id;
        private String title;
        private String videoUrl;
        private Integer duration; // phút
        private Integer orderIndex;
        private boolean isFree;
        private String status; // "locked", "in-progress", "completed"
    }
}
