package com.learningweb.learning_platform.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "music_tracks")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MusicTrack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String artist;
    private String category; // lofi, classical, ambient, nature, jazz, etc.
    private String spotifyUrl; // Link to Spotify or streaming service
    private String youtubeUrl;
    
    private Integer duration; // Thời lượng nhạc (giây)
    private String thumbnailUrl;
    
    private Boolean isPopular; // Nhạc phổ biến
    private Integer playCount; // Số lần phát
    
    @Column(columnDefinition = "TEXT")
    private String description;
}
