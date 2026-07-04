package com.horizonte.api.submissions;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WritingSubmissionRepository extends JpaRepository<WritingSubmission, Long> {
    
    List<WritingSubmission> findByUserId(Long userId);
    
    List<WritingSubmission> findByUserIdAndStatus(Long userId, SubmissionStatus status);
    
    List<WritingSubmission> findByLessonId(Long lessonId);
    
    List<WritingSubmission> findByStatusOrderBySubmittedAtDesc(SubmissionStatus status);
}
