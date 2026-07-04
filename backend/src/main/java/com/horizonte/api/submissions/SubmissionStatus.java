package com.horizonte.api.submissions;

public enum SubmissionStatus {
    SUBMITTED("Enviado"),
    UNDER_REVIEW("Em Revisão"),
    GRADED("Avaliado"),
    RETURNED("Devolvido");

    private final String displayName;

    SubmissionStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
