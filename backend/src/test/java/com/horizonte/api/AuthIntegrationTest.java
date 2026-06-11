package com.horizonte.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.horizonte.api.user.AppUser;
import com.horizonte.api.user.UserRepository;
import com.horizonte.api.user.UserStatus;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldLoginAsAdminAndAccessAdminDashboard() throws Exception {
        String adminToken = loginAndExtractToken("admin@horizonteespanhol.com", "Admin@12345");

        mockMvc.perform(get("/api/admin/dashboard")
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.totalStudents").exists())
            .andExpect(jsonPath("$.activeStudents").exists());
    }

    @Test
    void shouldRegisterStudentAsPendingAndBlockImmediateLogin() throws Exception {
        String email = "novo" + System.currentTimeMillis() + "@horizonteespanhol.com";

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "name", "Aluno Pendente",
                    "email", email,
                    "password", "SenhaSegura1"
                ))))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Aguarde a liberação")));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "email", email,
                    "password", "SenhaSegura1"
                ))))
            .andExpect(status().isForbidden())
            .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("PENDING")));
    }

    @Test
    void shouldRejectStudentFromAdminRoutes() throws Exception {
        String studentToken = loginAndExtractToken("aluno@horizonteespanhol.com", "Aluno@12345");

        mockMvc.perform(get("/api/admin/dashboard")
                .header("Authorization", "Bearer " + studentToken))
            .andExpect(status().isForbidden());
    }

    @Test
    void shouldAllowAuthenticatedUserToUpdateOwnProfile() throws Exception {
        String studentToken = loginAndExtractToken("aluno@horizonteespanhol.com", "Aluno@12345");

        mockMvc.perform(patch("/api/auth/me")
                .header("Authorization", "Bearer " + studentToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "name", "Aluno Atualizado",
                    "email", "aluno@horizonteespanhol.com"
                ))))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.user.name").value("Aluno Atualizado"))
            .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    void shouldChangePasswordForActivatedStudent() throws Exception {
        String email = "senha" + System.currentTimeMillis() + "@horizonteespanhol.com";

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "name", "Aluno Senha",
                    "email", email,
                    "password", "SenhaSegura1"
                ))))
            .andExpect(status().isCreated());

        AppUser createdUser = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow();
        createdUser.setStatus(UserStatus.ACTIVE);
        createdUser.setEmailVerified(true);
        userRepository.save(createdUser);

        String studentToken = loginAndExtractToken(email, "SenhaSegura1");

        mockMvc.perform(post("/api/auth/me/password")
                .header("Authorization", "Bearer " + studentToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "currentPassword", "SenhaSegura1",
                    "newPassword", "NovaSenha2"
                ))))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Senha atualizada")));

        loginAndExtractToken(email, "NovaSenha2");
    }

    private String loginAndExtractToken(String email, String password) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "email", email,
                    "password", password
                ))))
            .andExpect(status().isOk())
            .andReturn();

        JsonNode jsonNode = objectMapper.readTree(result.getResponse().getContentAsString());
        return jsonNode.get("token").asText();
    }
}
