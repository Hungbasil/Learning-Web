package com.learningweb.learning_platform.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class LeaderboardResponse {
    private int rank;
    private Long userId;
    private String fullName;
    private Integer totalXp;
    private String avatar;
    
    @Data
    @Builder
    public static class LeaderboardPageDto {
        private List<LeaderboardResponse> data;
        private Integer userRank;
        private Integer userXp;
    }
}
