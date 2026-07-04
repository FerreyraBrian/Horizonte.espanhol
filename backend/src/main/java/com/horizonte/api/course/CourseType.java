package com.horizonte.api.course;

public enum CourseType {
    ADULT("Adult"), 
    KIDS("Kids");

    private final String displayName;

    CourseType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
