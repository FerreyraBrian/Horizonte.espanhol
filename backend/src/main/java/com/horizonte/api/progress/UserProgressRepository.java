package com.horizonte.api.progress;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    
    Optional<UserProgress> findByUserIdAndLessonId(Long userId, Long lessonId);
    
    List<UserProgress> findByUserId(Long userId);
    
    List<UserProgress> findByUserIdAndIsCompletedTrue(Long userId);
    
    @Query("SELECT COUNT(up) FROM UserProgress up WHERE up.user.id = :userId AND up.isCompleted = true")
    long countCompletedLessonsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT AVG(up.progressPercentage) FROM UserProgress up WHERE up.user.id = :userId")
    Double getAverageProgressByUserId(@Param("userId") Long userId);
}
