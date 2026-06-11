package com.horizonte.api.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
    @NotBlank(message = "A senha atual é obrigatória.")
    String currentPassword,

    @NotBlank(message = "A nova senha é obrigatória.")
    @Size(min = 8, max = 100, message = "A nova senha deve ter no mínimo 8 caracteres.")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$",
        message = "A nova senha deve conter letra maiúscula, minúscula e número."
    )
    String newPassword
) {
}
