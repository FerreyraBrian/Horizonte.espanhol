package com.horizonte.api.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    Optional<Evaluation> findBySlug(String slug);
    List<Evaluation> findByCourseIdAndActiveTrue(Long courseId);
    List<Evaluation> findByCourseId(Long courseId);
}
