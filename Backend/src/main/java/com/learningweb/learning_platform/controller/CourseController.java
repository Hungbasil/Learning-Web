package com.learningweb.learning_platform.controller;


import com.learningweb.learning_platform.dto.CourseDetailResponse;
import com.learningweb.learning_platform.dto.CourseRequest;
import com.learningweb.learning_platform.entity.Category;
import com.learningweb.learning_platform.entity.Course;
import com.learningweb.learning_platform.entity.User;
import com.learningweb.learning_platform.repository.CategoryRepository;
import com.learningweb.learning_platform.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody CourseRequest request) {

        User instructor = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElse(null);
        if (category == null) {
            return ResponseEntity.badRequest().body("Lỗi: Không tìm thấy danh mục với ID này!");
        }

        Course newCourse = Course.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .level(request.getLevel())
                .category(category)
                .instructor(instructor)
                .totalLessons(0)
                .totalDuration("0 giờ")
                .build();

        // 4. Lưu xuống Database
        courseRepository.save(newCourse);

        return ResponseEntity.ok("Chúc mừng! Đã tạo vỏ khóa học thành công!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseDetail(@PathVariable Long id) {
        Course course = courseRepository.findById(id).orElse(null);
        if (course == null) {
            return ResponseEntity.badRequest().body("Lỗi: Không tìm thấy khóa học!");
        }

        List<CourseDetailResponse.SectionDto> sectionDtos = course.getSections().stream().map(section -> {
            List<CourseDetailResponse.LessonDto> lessonDtos = section.getLessons().stream().map(lesson ->
                    CourseDetailResponse.LessonDto.builder()
                            .id(lesson.getId())
                            .title(lesson.getTitle())
                            .videoUrl(lesson.getVideoUrl())
                            .orderIndex(lesson.getOrderIndex())
                            .isFree(lesson.isFree())
                            .build()
            ).toList();

            return CourseDetailResponse.SectionDto.builder()
                    .id(section.getId())
                    .title(section.getTitle())
                    .orderIndex(section.getOrderIndex())
                    .lessons(lessonDtos)
                    .build();
        }).toList();

        CourseDetailResponse response = CourseDetailResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .price(course.getPrice())
                .imageUrl(course.getImageUrl())
                .level(course.getLevel())
                .categoryName(course.getCategory().getName())
                .instructorName(course.getInstructor().getFullName())
                .sections(sectionDtos)
                .build();
        return ResponseEntity.ok(response);
    }
}
