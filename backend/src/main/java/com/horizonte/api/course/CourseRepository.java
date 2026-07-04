package com.horizonte.api.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findBySlug(String slug);
    List<Course> findByTypeAndActiveTrue(CourseType type);
    List<Course> findByActiveTrueOrderByLevelAsc();
}
