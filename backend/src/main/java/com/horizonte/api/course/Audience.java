package com.horizonte.api.course;

public enum Audience {
    ADULT("Adult"),
    KIDS("Kids");

    private final String displayName;

    Audience(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
