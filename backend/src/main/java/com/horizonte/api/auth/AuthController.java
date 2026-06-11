package com.horizonte.api.auth;

import com.horizonte.api.user.AppUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal AppUser user) {
        return authService.me(user);
    }

    @PatchMapping("/me")
    public AuthResponse updateProfile(
        @AuthenticationPrincipal AppUser user,
        @Valid @RequestBody UpdateProfileRequest request
    ) {
        return authService.updateProfile(user, request);
    }

    @PostMapping("/me/password")
    public MessageResponse changePassword(
        @AuthenticationPrincipal AppUser user,
        @Valid @RequestBody ChangePasswordRequest request
    ) {
        return authService.changePassword(user, request);
    }
}
