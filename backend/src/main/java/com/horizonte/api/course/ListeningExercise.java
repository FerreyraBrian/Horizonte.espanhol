package com.horizonte.api.course;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "listening_exercises")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListeningExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(nullable = false, length = 500)
    private String audioUrl;

    @Column(length = 500)
    private String description;

    @OneToMany(mappedBy = "listeningExercise", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ListeningExerciseQuestion> questions;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private java.time.LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = java.time.LocalDateTime.now();
    }
}
