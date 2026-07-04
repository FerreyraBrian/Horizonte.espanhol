package com.horizonte.api.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    Optional<Lesson> findBySlug(String slug);
    List<Lesson> findByCourseIdAndActiveTrue(Long courseId);
    List<Lesson> findByCourseIdAndAudienceAndActiveTrue(Long courseId, Audience audience);
    List<Lesson> findByCourseIdOrderByOrderIndex(Long courseId);
    Optional<Lesson> findBySlugAndActiveTrue(String slug);
}
