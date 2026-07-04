package com.horizonte.api.course;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "listening_exercise_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListeningExerciseQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "listening_exercise_id", nullable = false)
    private ListeningExercise listeningExercise;

    @Column(nullable = false, length = 1000)
    private String question;

    @Column(nullable = false, length = 5000)
    private String optionsJson; // JSON array stored as string

    @Column(nullable = false, length = 500)
    private String correctAnswer;

    @Column(length = 500)
    private String correctFeedback;

    @Column(length = 500)
    private String incorrectFeedback;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private java.time.LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = java.time.LocalDateTime.now();
    }
}
