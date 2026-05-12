package com.learningweb.learning_platform.controller;



import com.learningweb.learning_platform.dto.LessonRequest;
import com.learningweb.learning_platform.dto.SectionRequest;
import com.learningweb.learning_platform.entity.Course;
import com.learningweb.learning_platform.entity.Lesson;
import com.learningweb.learning_platform.entity.Section;
import com.learningweb.learning_platform.repository.CourseRepository;
import com.learningweb.learning_platform.repository.LessonRepository;
import com.learningweb.learning_platform.repository.SectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/course-content")
public class CourseContentController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @PostMapping("/sections")
    public ResponseEntity<?> addSection(@RequestBody SectionRequest request) {
        Course course = courseRepository.findById(request.getCourseId()).orElse(null);
        if (course == null) {
            return ResponseEntity.badRequest().body("Lỗi: Không tìm thấy khóa học!");
        }
        Section newSection = Section.builder()
                .title(request.getTitle())
                .orderIndex(request.getOrderIndex())
                .course(course)
                .build();
        sectionRepository.save(newSection);
        return ResponseEntity.ok("Thêm chương thành công!");
    }

    @PostMapping("/lessons")
    public ResponseEntity<?> addLesson(@RequestBody LessonRequest request) {
        Section section = sectionRepository.findById(request.getSectionId()).orElse(null);
        if (section == null) {
            return ResponseEntity.badRequest().body("Lỗi: Không tìm thấy chương học!");
        }

        Lesson newLesson = Lesson.builder()
                .title(request.getTitle())
                .videoUrl(request.getVideoUrl())
                .content(request.getContent())
                .orderIndex(request.getOrderIndex())
                .isFree(request.isFree())
                .section(section)
                .build();

        lessonRepository.save(newLesson);
        return ResponseEntity.ok("Thêm thành công!");
    }
}
