package com.horizonte.api.auth;

public record AuthResponse(
    String token,
    String tokenType,
    UserResponse user
) {
}
