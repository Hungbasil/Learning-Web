package com.learningweb.learning_platform.controller;


import com.learningweb.learning_platform.dto.CourseDetailResponse;
import com.learningweb.learning_platform.dto.CourseListResponse;
import com.learningweb.learning_platform.dto.CourseRequest;
import com.learningweb.learning_platform.entity.Category;
import com.learningweb.learning_platform.entity.Course;
import com.learningweb.learning_platform.entity.User;
import com.learningweb.learning_platform.repository.CategoryRepository;
import com.learningweb.learning_platform.repository.CourseRepository;
import com.learningweb.learning_platform.repository.CourseReviewRepository;
import com.learningweb.learning_platform.repository.LessonProgressRepository;
import com.learningweb.learning_platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CourseReviewRepository courseReviewRepository;

    @Autowired
    private LessonProgressRepository lessonProgressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.learningweb.learning_platform.service.FileUploadService fileUploadService;

    @Autowired
    private com.learningweb.learning_platform.repository.BookmarkRepository bookmarkRepository;

    @Autowired
    private com.learningweb.learning_platform.repository.EnrollmentRepository enrollmentRepository;


    // Chi tiết khóa học
    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseDetail(@PathVariable Long id) {
        Course course = courseRepository.findById(id).orElse(null);
        if (course == null) {
            return ResponseEntity.badRequest().body("Lỗi: Không tìm thấy khóa học!");
        }

        // Get current user
        User currentUser = null;
        try {
            currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        } catch (Exception e) {
            // User not authenticated or not in principal
        }

        // Calculate average rating and total reviews
        Double averageRating = courseReviewRepository.getAverageRatingByCourseId(id);
        Long totalReviewsCount = courseReviewRepository.countByCourseId(id);
        Integer totalReviews = totalReviewsCount != null ? totalReviewsCount.intValue() : 0;

        // Calculate completion percentage
        Integer completionPercentage = 0;
        if (currentUser != null) {
            Integer totalLessons = course.getTotalLessons() != null ? course.getTotalLessons() : 0;
            if (totalLessons > 0) {
                Long completedLessons = lessonProgressRepository.countByUserIdAndCourseIdAndCompleted(currentUser.getId(), id, true);
                completionPercentage = (int) ((completedLessons * 100L) / totalLessons);
            }
        }

        // Build sections with lessons including status
        List<CourseDetailResponse.SectionDto> sectionDtos = course.getSections().stream().map(section -> {
            List<CourseDetailResponse.LessonDto> lessonDtos = section.getLessons().stream().map(lesson -> {
                String status = "locked"; // default status
                
                if (currentUser != null) {
                    // Check if lesson is completed
                    boolean isCompleted = lessonProgressRepository.existsByUserIdAndLessonIdAndCompleted(currentUser.getId(), lesson.getId(), true);
                    if (isCompleted) {
                        status = "completed";
                    } else {
                        // Check if any lesson before this is completed (simple check: if first lesson or previous is completed)
                        boolean hasStarted = lessonProgressRepository.existsByUserIdAndLessonId(currentUser.getId(), lesson.getId());
                        if (hasStarted || section.getLessons().indexOf(lesson) == 0) {
                            status = "in-progress";
                        }
                    }
                }
                
                return CourseDetailResponse.LessonDto.builder()
                        .id(lesson.getId())
                        .title(lesson.getTitle())
                        .videoUrl(lesson.getVideoUrl())
                        .duration(lesson.getDuration() != null ? lesson.getDuration() : 0)
                        .orderIndex(lesson.getOrderIndex())
                        .isFree(lesson.isFree())
                        .status(status)
                        .build();
            }).toList();

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
                .level(course.getLevel() != null ? course.getLevel() : "Cơ bản")
                .categoryName(course.getCategory() != null ? course.getCategory().getName() : "Khác")
                .instructorName(course.getInstructor() != null ? course.getInstructor().getFullName() : "Unknown")
                .totalLessons(course.getTotalLessons() != null ? course.getTotalLessons() : 0)
                .totalDuration(course.getTotalDuration() != null ? course.getTotalDuration() : "0")
                .averageRating(averageRating != null ? averageRating : 0.0)
                .totalReviews(totalReviews)
                .completionPercentage(completionPercentage)
                .isFree(course.getIsFree() != null ? course.getIsFree() : (course.getPrice() == null || course.getPrice() == 0))
                .programmingLanguage(course.getProgrammingLanguage() != null ? course.getProgrammingLanguage() : "JavaScript")
                .icon(course.getIcon() != null ? course.getIcon() : "💻")
                .bgColor(course.getBgColor() != null ? course.getBgColor() : "bg-blue-100")
                .enrolledCount(course.getEnrolledCount() != null ? course.getEnrolledCount() : 0)
                .isBookmarked(currentUser != null && bookmarkRepository.existsByUserIdAndCourseId(currentUser.getId(), id))
                .isEnrolled(currentUser != null && enrollmentRepository.findByUserAndCourse(currentUser, course).isPresent())
                .sections(sectionDtos)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<?> getAllCourses() {

        List<Course> courses = courseRepository.findAll();
        List<CourseListResponse> responseList = courses.stream().map(course -> {
            Boolean isFree = course.getIsFree() != null ? course.getIsFree() : (course.getPrice() == null || course.getPrice() == 0);
            Integer enrolledCount = course.getEnrolledCount() != null ? course.getEnrolledCount() : 0;
            
            return CourseListResponse.builder()
                    .id(course.getId())
                    .title(course.getTitle())
                    .description(course.getDescription())
                    .price(course.getPrice())
                    .imageUrl(course.getImageUrl())
                    .level(course.getLevel() != null ? course.getLevel() : "Cơ bản")
                    .categoryName(course.getCategory() != null ? course.getCategory().getName() : "Khác")
                    .instructorName(course.getInstructor() != null ? course.getInstructor().getFullName() : "Unknown")
                    .totalLessons(course.getTotalLessons() != null ? course.getTotalLessons() : 0)
                    .totalDuration(course.getTotalDuration() != null ? course.getTotalDuration() : "0")
                    .isFree(isFree)
                    .programmingLanguage(course.getProgrammingLanguage() != null ? course.getProgrammingLanguage() : "JavaScript")
                    .icon(course.getIcon() != null ? course.getIcon() : "💻")
                    .bgColor(course.getBgColor() != null ? course.getBgColor() : "bg-blue-100")
                    .enrolledCount(enrolledCount)
                    .build();
        }).collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }




    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createCourse(@ModelAttribute CourseRequest request) {
        try {
            User instructor = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            Category category = categoryRepository.findById(request.getCategoryId()).orElse(null);
            if (category == null) return ResponseEntity.badRequest().body("Lỗi: Không tìm thấy danh mục!");
            String imageUrl = "";
            if (request.getImageFile() != null && !request.getImageFile().isEmpty()) {
                imageUrl = fileUploadService.uploadFile(request.getImageFile());
            }
            Course newCourse = Course.builder()
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .price(request.getPrice())
                    .imageUrl(imageUrl)
                    .level(request.getLevel())
                    .category(category)
                    .instructor(instructor)
                    .totalLessons(0)
                    .totalDuration("0 giờ")
                    .build();

            courseRepository.save(newCourse);
            return ResponseEntity.ok("Đã tạo khóa học thành công!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi hệ thống: " + e.getMessage());
        }
    }


    // sửa khóa học
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @ModelAttribute CourseRequest request) {
        try {
            Course existingCourse = courseRepository.findById(id).orElse(null);
            if (existingCourse == null) return ResponseEntity.badRequest().body("Lỗi: Không tìm thấy khóa học!");

            User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            boolean isCreator = existingCourse.getInstructor().getId().equals(currentUser.getId());
            boolean isAdmin = "ADMIN".equals(currentUser.getRole());

            if (!isCreator && !isAdmin) {
                return ResponseEntity.status(403).body("Bạn không có quyền sửa khóa học này!");
            }

            if (request.getTitle() != null && !request.getTitle().isEmpty()) {
                existingCourse.setTitle(request.getTitle());
            }
            if (request.getDescription() != null && !request.getDescription().isEmpty()) {
                existingCourse.setDescription(request.getDescription());
            }
            if (request.getPrice() != null) {
                existingCourse.setPrice(request.getPrice());
            }
            if (request.getLevel() != null && !request.getLevel().isEmpty()) {
                existingCourse.setLevel(request.getLevel());
            }

            if (request.getImageFile() != null && !request.getImageFile().isEmpty()) {
                String newImageUrl = fileUploadService.uploadFile(request.getImageFile());
                existingCourse.setImageUrl(newImageUrl);
            }

            if (request.getCategoryId() != null) {
                Category newCategory = categoryRepository.findById(request.getCategoryId()).orElse(null);
                if (newCategory != null) existingCourse.setCategory(newCategory);
            }

            courseRepository.save(existingCourse);
            return ResponseEntity.ok("Cập nhật khóa học thành công!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi: " + e.getMessage());
        }
    }

    // Xóa khóa học
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            Course existingCourse = courseRepository.findById(id).orElse(null);
            if (existingCourse == null) {
                return ResponseEntity.badRequest().body("Lỗi: Không tìm thấy khóa học!");
            }

            User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            boolean isCreator = existingCourse.getInstructor().getId().equals(currentUser.getId());
            boolean isAdmin = "ADMIN".equals(currentUser.getRole());

            if (!isCreator && !isAdmin) {
                return ResponseEntity.status(403).body("Bạn không có quyền xóa khóa học này!");
            }

            courseRepository.delete(existingCourse);

            return ResponseEntity.ok("Đã xóa khóa học thành công!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi hệ thống: " + e.getMessage());
        }
    }



}
