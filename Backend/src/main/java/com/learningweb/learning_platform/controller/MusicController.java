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

    // Lấy tất cả nhạc
    @GetMapping
    public ResponseEntity<?> getAllMusic() {
        List<MusicTrack> tracks = musicTrackRepository.findAll();
        return ResponseEntity.ok(tracks);
    }

    // Lấy nhạc theo category
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getMusicByCategory(@PathVariable String category) {
        List<MusicTrack> tracks = musicTrackRepository.findByCategory(category);
        return ResponseEntity.ok(tracks);
    }

    // Lấy nhạc phổ biến
    @GetMapping("/popular")
    public ResponseEntity<?> getPopularMusic() {
        List<MusicTrack> tracks = musicTrackRepository.findByIsPopularTrue();
        return ResponseEntity.ok(tracks);
    }

    // Thêm nhạc (Admin only)
    @PostMapping
    public ResponseEntity<?> addMusic(@RequestBody MusicTrack track) {
        try {
            MusicTrack savedTrack = musicTrackRepository.save(track);
            return ResponseEntity.ok(savedTrack);
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
            musicTrackRepository.save(track);
            return ResponseEntity.ok(track);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}
