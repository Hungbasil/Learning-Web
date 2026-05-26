package com.learningweb.learning_platform.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MusicTrackDTO {
    private Long id;
    private String title;
    private String artist;
    private String category;
    private String audioUrl;     
    private String spotifyUrl;
    private String youtubeUrl;
    private Integer duration;
    private String thumbnailUrl;
    private Boolean isPopular;
    private Integer playCount;
    private String description;
}
