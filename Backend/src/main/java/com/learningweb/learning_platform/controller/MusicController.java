package com.learningweb.learning_platform.controller;

import com.learningweb.learning_platform.dto.MusicTrackDTO;
import com.learningweb.learning_platform.entity.MusicTrack;
import com.learningweb.learning_platform.repository.MusicTrackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/music")
public class MusicController {

    @Autowired
    private MusicTrackRepository musicTrackRepository;

    // Convert entity to DTO
    private MusicTrackDTO convertToDTO(MusicTrack track) {
        return MusicTrackDTO.builder()
                .id(track.getId())
                .title(track.getTitle())
                .artist(track.getArtist())
                .category(track.getCategory())
                .audioUrl(track.getAudioUrl())
                .spotifyUrl(track.getSpotifyUrl())
                .youtubeUrl(track.getYoutubeUrl())
                .duration(track.getDuration())
                .thumbnailUrl(track.getThumbnailUrl())
                .isPopular(track.getIsPopular())
                .playCount(track.getPlayCount())
                .description(track.getDescription())
                .build();
    }

    // Lấy tất cả nhạc
    @GetMapping
    public ResponseEntity<?> getAllMusic() {
        List<MusicTrack> tracks = musicTrackRepository.findAll();
        List<MusicTrackDTO> dtos = tracks.stream().map(this::convertToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Lấy nhạc theo category
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getMusicByCategory(@PathVariable String category) {
        List<MusicTrack> tracks = musicTrackRepository.findByCategory(category);
        List<MusicTrackDTO> dtos = tracks.stream().map(this::convertToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Lấy nhạc phổ biến
    @GetMapping("/popular")
    public ResponseEntity<?> getPopularMusic() {
        List<MusicTrack> tracks = musicTrackRepository.findByIsPopularTrue();
        List<MusicTrackDTO> dtos = tracks.stream().map(this::convertToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Thêm nhạc (Admin only)
    @PostMapping
    public ResponseEntity<?> addMusic(@RequestBody MusicTrack track) {
        try {
            MusicTrack savedTrack = musicTrackRepository.save(track);
            return ResponseEntity.ok(convertToDTO(savedTrack));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi thêm nhạc: " + e.getMessage());
        }
    }

    // Cập nhật play count
    @PutMapping("/{id}/play")
    public ResponseEntity<?> recordPlayCount(@PathVariable Long id) {
        try {
            MusicTrack track = musicTrackRepository.findById(id).orElse(null);
            if (track == null) {
                return ResponseEntity.badRequest().body("Không tìm thấy nhạc");
            }
            track.setPlayCount((track.getPlayCount() != null ? track.getPlayCount() : 0) + 1);
            MusicTrack updatedTrack = musicTrackRepository.save(track);
            return ResponseEntity.ok(convertToDTO(updatedTrack));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}
