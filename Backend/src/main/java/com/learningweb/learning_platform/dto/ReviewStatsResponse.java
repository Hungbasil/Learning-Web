package com.learningweb.learning_platform.dto;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.util.Map;

@Getter @Setter @Builder
public class ReviewStatsResponse {
    private Double averageRating;
    private Long totalReviews;
    private Map<Integer, Long> starDistribution;
}
