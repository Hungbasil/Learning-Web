package com.learningweb.learning_platform.service;

import com.learningweb.learning_platform.dto.*;
import com.learningweb.learning_platform.entity.User;
import com.learningweb.learning_platform.entity.StudySession;
import com.learningweb.learning_platform.entity.UserSkill;
import com.learningweb.learning_platform.entity.PersonalGoal;
import com.learningweb.learning_platform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSkillRepository userSkillRepository;

    @Autowired
    private PersonalGoalRepository personalGoalRepository;

    @Autowired
    private StudySessionRepository studySessionRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private LessonProgressRepository lessonProgressRepository;

    // ========== LEADERBOARD ==========
    public LeaderboardResponse.LeaderboardPageDto getLeaderboard(User currentUser, int limit, int offset) {
        // Get all users sorted by XP (descending)
        Pageable pageable = PageRequest.of(offset / limit, limit);
        List<User> users = userRepository.findAll(pageable).getContent();

        // Sort and assign ranks
        List<User> sortedUsers = userRepository.findAll()
                .stream()
                .sorted((u1, u2) -> Integer.compare(u2.getTotalXp(), u1.getTotalXp()))
                .collect(Collectors.toList());

        List<LeaderboardResponse> leaderboardList = new ArrayList<>();
        for (int i = 0; i < sortedUsers.size(); i++) {
            User user = sortedUsers.get(i);
            leaderboardList.add(LeaderboardResponse.builder()
                    .rank(i + 1)
                    .userId(user.getId())
                    .fullName(user.getFullName())
                    .totalXp(user.getTotalXp())
                    .build());
        }

        // Get current user's rank
        Integer userRank = leaderboardList.stream()
                .filter(l -> l.getUserId().equals(currentUser.getId()))
                .findFirst()
                .map(LeaderboardResponse::getRank)
                .orElse(sortedUsers.size());

        return LeaderboardResponse.LeaderboardPageDto.builder()
                .data(leaderboardList.stream().limit(limit).collect(Collectors.toList()))
                .userRank(userRank)
                .userXp(currentUser.getTotalXp())
                .build();
    }

    // ========== ACTIVITY HEATMAP ==========
    public ActivityHeatmapResponse getActivityHeatmap(User currentUser, int days) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);

        List<StudySession> sessions = studySessionRepository.findByUserOrderByStartTimeDesc(currentUser);

        // Group by date
        Map<String, Integer> heatmapData = new TreeMap<>();
        LocalDate now = LocalDate.now();

        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = now.minusDays(i);
            heatmapData.put(date.toString(), 0);
        }

        // Count sessions per day
        for (StudySession session : sessions) {
            if (session.getStartTime() != null && session.getStartTime().isAfter(startDate)) {
                String date = session.getStartTime().toLocalDate().toString();
                heatmapData.merge(date, 1, Integer::sum);
            }
        }

        // Calculate streaks
        int currentStreak = calculateCurrentStreak(sessions);
        int longestStreak = calculateLongestStreak(sessions);

        return ActivityHeatmapResponse.builder()
                .heatmapData(heatmapData)
                .totalSessions(sessions.size())
                .currentStreak(currentStreak)
                .longestStreak(longestStreak)
                .build();
    }

    private int calculateCurrentStreak(List<StudySession> sessions) {
        if (sessions.isEmpty()) return 0;

        // Get unique dates in descending order
        Set<LocalDate> uniqueDates = sessions.stream()
                .map(s -> s.getStartTime().toLocalDate())
                .collect(Collectors.toCollection(TreeSet::new));

        List<LocalDate> sortedDates = new ArrayList<>(uniqueDates);
        Collections.reverse(sortedDates);

        int streak = 0;
        LocalDate today = LocalDate.now();

        for (LocalDate date : sortedDates) {
            if (date.equals(today) || date.equals(today.minusDays(streak + 1))) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    private int calculateLongestStreak(List<StudySession> sessions) {
        if (sessions.isEmpty()) return 0;

        Set<LocalDate> uniqueDates = sessions.stream()
                .map(s -> s.getStartTime().toLocalDate())
                .collect(Collectors.toCollection(TreeSet::new));

        List<LocalDate> sortedDates = new ArrayList<>(uniqueDates);
        Collections.sort(sortedDates);

        int maxStreak = 1;
        int currentStreak = 1;

        for (int i = 1; i < sortedDates.size(); i++) {
            if (sortedDates.get(i).equals(sortedDates.get(i - 1).plusDays(1))) {
                currentStreak++;
            } else {
                maxStreak = Math.max(maxStreak, currentStreak);
                currentStreak = 1;
            }
        }

        return Math.max(maxStreak, currentStreak);
    }

    // ========== USER SKILLS ==========
    public UserSkillsResponse getUserSkills(User currentUser) {
        List<UserSkill> skills = userSkillRepository.findByUserOrderByProgressDesc(currentUser);

        List<UserSkillsResponse.SkillDto> skillDtos = skills.stream()
                .map(skill -> UserSkillsResponse.SkillDto.builder()
                        .id(skill.getId())
                        .skillName(skill.getSkillName())
                        .proficiency(skill.getProficiency())
                        .progress(skill.getProgress())
                        .build())
                .collect(Collectors.toList());

        return UserSkillsResponse.builder()
                .skills(skillDtos)
                .build();
    }

    // ========== PERSONAL GOALS ==========
    public PersonalGoalsResponse getPersonalGoals(User currentUser) {
        List<PersonalGoal> goals = personalGoalRepository.findByUserOrderByDeadlineAsc(currentUser);

        List<PersonalGoalsResponse.GoalDto> goalDtos = goals.stream()
                .map(goal -> PersonalGoalsResponse.GoalDto.builder()
                        .id(goal.getId())
                        .title(goal.getTitle())
                        .description(goal.getDescription())
                        .deadline(goal.getDeadline())
                        .targetValue(goal.getTargetValue())
                        .currentProgress(goal.getCurrentProgress())
                        .status(goal.getStatus())
                        .build())
                .collect(Collectors.toList());

        return PersonalGoalsResponse.builder()
                .goals(goalDtos)
                .build();
    }

    // ========== DASHBOARD STATS ==========
    public DashboardStatsResponse getDashboardStats(User currentUser) {
        // Get user rank
        List<User> allUsers = userRepository.findAll();
        int rank = (int) allUsers.stream()
                .filter(u -> u.getTotalXp() > currentUser.getTotalXp())
                .count() + 1;

        // Get streak info
        List<StudySession> sessions = studySessionRepository.findByUserOrderByStartTimeDesc(currentUser);
        int currentStreak = calculateCurrentStreak(sessions);

        // Calculate total study hours
        Double totalStudyHours = sessions.stream()
                .mapToDouble(session -> {
                    if (session.getStartTime() != null && session.getEndTime() != null) {
                        return java.time.temporal.ChronoUnit.MINUTES.between(
                                session.getStartTime(),
                                session.getEndTime()
                        ) / 60.0;
                    }
                    return 0.0;
                })
                .sum();

        // Count completed courses
        long completedCourses = enrollmentRepository.findByUser(currentUser).stream()
                .filter(enrollment -> {
                    int totalLessons = enrollment.getCourse().getTotalLessons();
                    if (totalLessons == 0) return false;
                    long completedLessons = lessonProgressRepository
                            .countByUserAndLesson_Section_Course_IdAndCompleted(
                                    currentUser, enrollment.getCourse().getId(), true
                            );
                    return completedLessons == totalLessons;
                })
                .count();

        // Count skills
        int skillsCount = (int) userSkillRepository.findByUser(currentUser).stream().count();

        String level = "Beginner";
        if (currentUser.getTotalXp() >= 1000 && currentUser.getTotalXp() < 5000) {
            level = "Intermediate";
        } else if (currentUser.getTotalXp() >= 5000) {
            level = "Advanced";
        }

        return DashboardStatsResponse.builder()
                .totalXp(currentUser.getTotalXp())
                .rank(rank)
                .streakDays(currentStreak)
                .totalStudyHours(totalStudyHours)
                .totalCoursesCompleted((int) completedCourses)
                .skillsAcquired(skillsCount)
                .currentLevel(level)
                .build();
    }
}
