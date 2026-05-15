package com.learningweb.learning_platform.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class ActivityHeatmapResponse {
    private Map<String, Integer> heatmapData; // date -> count
    private Integer totalSessions;
    private Integer longestStreak;
    private Integer currentStreak;
}
