package com.horizonte.api.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListeningExerciseQuestionRepository extends JpaRepository<ListeningExerciseQuestion, Long> {
    List<ListeningExerciseQuestion> findByListeningExerciseIdOrderByOrderIndex(Long exerciseId);
    List<ListeningExerciseQuestion> findByListeningExerciseIdAndActiveTrue(Long exerciseId);
}
