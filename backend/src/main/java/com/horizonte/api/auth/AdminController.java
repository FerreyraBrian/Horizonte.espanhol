package com.horizonte.api.auth;

import com.horizonte.api.user.AppUser;
import com.horizonte.api.user.Role;
import com.horizonte.api.user.UserRepository;
import com.horizonte.api.user.UserStatus;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        long totalStudents = userRepository.findAllByRoleOrderByCreatedAtDesc(Role.STUDENT).size();
        long activeStudents = userRepository.findAllByRoleOrderByCreatedAtDesc(Role.STUDENT)
            .stream()
            .filter(user -> user.getStatus() == UserStatus.ACTIVE)
            .count();
        long pendingStudents = userRepository.findAllByRoleOrderByCreatedAtDesc(Role.STUDENT)
            .stream()
            .filter(user -> user.getStatus() == UserStatus.PENDING)
            .count();

        return Map.of(
            "totalStudents", totalStudents,
            "activeStudents", activeStudents,
            "pendingStudents", pendingStudents
        );
    }

    @GetMapping("/students")
    public List<UserResponse> listStudents() {
        return userRepository.findAllByRoleOrderByCreatedAtDesc(Role.STUDENT)
            .stream()
            .map(UserResponse::from)
            .collect(Collectors.toList());
    }

    @PatchMapping("/students/{id}/status")
    public MessageResponse updateStudentStatus(@PathVariable Long id, @RequestParam UserStatus status) {
        AppUser student = userRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado."));

        if (student.getRole() != Role.STUDENT) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Apenas contas de aluno podem ser alteradas aqui.");
        }

        student.setStatus(status);
        if (status == UserStatus.ACTIVE) {
            student.setEmailVerified(true);
        }
        userRepository.save(student);

        return new MessageResponse("Status do aluno atualizado para " + status.name() + ".");
    }
}
