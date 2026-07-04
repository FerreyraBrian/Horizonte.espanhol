package com.horizonte.api.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {
    List<QuizQuestion> findByQuizIdOrderByOrderIndex(Long quizId);
    List<QuizQuestion> findByQuizIdAndActiveTrue(Long quizId);
}
