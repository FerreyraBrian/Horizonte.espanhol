package com.horizonte.api.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListeningExerciseRepository extends JpaRepository<ListeningExercise, Long> {
    List<ListeningExercise> findByLessonIdAndActiveTrue(Long lessonId);
    List<ListeningExercise> findByLessonId(Long lessonId);
}
