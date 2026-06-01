package com.learningweb.learning_platform.repository;

import com.learningweb.learning_platform.entity.MusicTrack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MusicTrackRepository extends JpaRepository<MusicTrack, Long> {
    List<MusicTrack> findByCategory(String category);
    List<MusicTrack> findByIsPopularTrue();
    List<MusicTrack> findAll();
}
