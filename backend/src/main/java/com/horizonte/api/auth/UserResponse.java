package com.horizonte.api.auth;

import com.horizonte.api.user.AppUser;
import com.horizonte.api.user.Role;
import com.horizonte.api.user.UserStatus;
import java.time.LocalDateTime;

public record UserResponse(
    Long id,
    String name,
    String email,
    String avatarUrl,
    Role role,
    UserStatus status,
    Integer progress,
    Boolean emailVerified,
    LocalDateTime createdAt
) {

    public static UserResponse from(AppUser user) {
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getAvatarUrl(),
            user.getRole(),
            user.getStatus(),
            user.getProgress(),
            user.getEmailVerified(),
            user.getCreatedAt()
        );
    }
}
