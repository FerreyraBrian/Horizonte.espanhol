package com.horizonte.api.config;

import com.horizonte.api.user.AppUser;
import com.horizonte.api.user.Role;
import com.horizonte.api.user.UserRepository;
import com.horizonte.api.user.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedUsers(
        @Value("${app.security.seed-admin-email:admin@horizonteespanhol.com}") String adminEmail,
        @Value("${app.security.seed-admin-password:Admin@12345}") String adminPassword,
        @Value("${app.security.seed-student-email:aluno@horizonteespanhol.com}") String studentEmail,
        @Value("${app.security.seed-student-password:Aluno@12345}") String studentPassword
    ) {
        return args -> {
            userRepository.findByEmailIgnoreCase(adminEmail).orElseGet(() ->
                userRepository.save(AppUser.builder()
                    .name("Administrador")
                    .email(adminEmail.toLowerCase())
                    .passwordHash(passwordEncoder.encode(adminPassword))
                    .role(Role.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .emailVerified(true)
                    .enabled(true)
                    .progress(100)
                    .build())
            );

            userRepository.findByEmailIgnoreCase(studentEmail).orElseGet(() ->
                userRepository.save(AppUser.builder()
                    .name("Aluno Demo")
                    .email(studentEmail.toLowerCase())
                    .passwordHash(passwordEncoder.encode(studentPassword))
                    .role(Role.STUDENT)
                    .status(UserStatus.ACTIVE)
                    .emailVerified(true)
                    .enabled(true)
                    .progress(35)
                    .build())
            );
        };
    }
}
