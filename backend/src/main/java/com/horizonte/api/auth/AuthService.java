package com.horizonte.api.auth;

import com.horizonte.api.security.JwtService;
import com.horizonte.api.user.AppUser;
import com.horizonte.api.user.Role;
import com.horizonte.api.user.UserRepository;
import com.horizonte.api.user.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public MessageResponse register(RegisterRequest request) {
        String normalizedEmail = normalizeEmail(request.email());

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe uma conta cadastrada com este e-mail.");
        }

        AppUser user = AppUser.builder()
            .name(request.name().trim())
            .email(normalizedEmail)
            .passwordHash(passwordEncoder.encode(request.password()))
            .role(Role.STUDENT)
            .status(UserStatus.PENDING)
            .emailVerified(false)
            .enabled(true)
            .progress(0)
            .build();

        userRepository.save(user);

        return new MessageResponse("Cadastro realizado com sucesso. Aguarde a liberação do administrador para acessar o curso.");
    }

    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = normalizeEmail(request.email());

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.password())
            );
        } catch (AuthenticationException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos.");
        }

        AppUser user = userRepository.findByEmailIgnoreCase(normalizedEmail)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado."));

        if (user.getRole() == Role.STUDENT && user.getStatus() != UserStatus.ACTIVE) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Sua conta ainda não está liberada. Status atual: " + user.getStatus().name()
            );
        }

        if (!user.isEnabled()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Sua conta está desativada.");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, "Bearer", UserResponse.from(user));
    }

    public UserResponse me(AppUser user) {
        return UserResponse.from(requireAuthenticatedUser(user));
    }

    public AuthResponse updateProfile(AppUser currentUser, UpdateProfileRequest request) {
        AppUser user = requireAuthenticatedUser(currentUser);
        String normalizedEmail = normalizeEmail(request.email());

        if (!user.getEmail().equalsIgnoreCase(normalizedEmail) && userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe uma conta cadastrada com este e-mail.");
        }

        user.setName(request.name().trim());
        user.setEmail(normalizedEmail);

        AppUser savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);

        return new AuthResponse(token, "Bearer", UserResponse.from(savedUser));
    }

    public MessageResponse changePassword(AppUser currentUser, ChangePasswordRequest request) {
        AppUser user = requireAuthenticatedUser(currentUser);

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A senha atual está incorreta.");
        }

        if (passwordEncoder.matches(request.newPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A nova senha deve ser diferente da senha atual.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        return new MessageResponse("Senha atualizada com sucesso.");
    }

    private AppUser requireAuthenticatedUser(AppUser user) {
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Faça login para continuar.");
        }

        return userRepository.findById(user.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }
}
