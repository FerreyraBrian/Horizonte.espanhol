package com.horizonte.api.course;

public enum EvaluationStatus {
    LOCKED("Bloqueada"),
    AVAILABLE("Liberada"),
    COMPLETED("Concluída"),
    GRADED("Avaliada");

    private final String displayName;

    EvaluationStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
