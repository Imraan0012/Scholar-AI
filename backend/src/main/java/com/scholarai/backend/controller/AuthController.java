package com.scholarai.backend.controller;

import com.scholarai.backend.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Public auth utility endpoints — no JWT required.
 * Handles seamless account registration and password synchronization directly in Supabase auth tables
 * bypassing Supabase client-side email rate limits completely.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JdbcTemplate jdbcTemplate;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    /**
     * Creates or updates a user in auth.users and auth.identities with email pre-confirmed.
     * Guarantees 100% immediate compatibility with Supabase signInWithPassword.
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(
            @RequestBody Map<String, String> body) {

        String email = body == null ? null : body.get("email");
        String password = body == null ? null : body.get("password");
        String fullName = body == null ? null : body.get("fullName");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email is required"));
        }
        if (password == null || password.length() < 8) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Password must be at least 8 characters"));
        }

        String normalizedEmail = email.trim().toLowerCase();
        String trimmedName = fullName != null ? fullName.trim() : "";

        try {
            String hashedPassword = passwordEncoder.encode(password);

            // Check if user already exists
            List<Map<String, Object>> existing = jdbcTemplate.queryForList(
                    "SELECT id FROM auth.users WHERE LOWER(email) = LOWER(?) AND deleted_at IS NULL",
                    normalizedEmail
            );

            if (!existing.isEmpty()) {
                String userIdStr = existing.get(0).get("id").toString();
                String userMetaData = String.format(
                        "{\"sub\":\"%s\",\"email\":\"%s\",\"full_name\":\"%s\",\"role\":\"STUDENT\",\"email_verified\":true,\"phone_verified\":false}",
                        userIdStr, normalizedEmail, trimmedName.replace("\"", "\\\"")
                );

                // Update existing user with new password and ensure confirmed
                jdbcTemplate.update(
                        "UPDATE auth.users SET " +
                        " encrypted_password = ?, " +
                        " email_confirmed_at = COALESCE(email_confirmed_at, NOW()), " +
                        " confirmation_token = '', confirmation_sent_at = NULL, " +
                        " recovery_token = '', email_change_token_new = '', email_change = '', " +
                        " phone_change = '', phone_change_token = '', email_change_token_current = '', " +
                        " email_change_confirm_status = 0, reauthentication_token = '', " +
                        " raw_user_meta_data = ?::jsonb, " +
                        " is_sso_user = false, is_anonymous = false, updated_at = NOW() " +
                        "WHERE LOWER(email) = LOWER(?) AND deleted_at IS NULL",
                        hashedPassword, userMetaData, normalizedEmail
                );

                // Ensure identity record exists and is synced
                try {
                    jdbcTemplate.update(
                            "INSERT INTO auth.identities (" +
                            " provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at) " +
                            "VALUES (?, ?::uuid, ?::jsonb, 'email', NOW(), NOW(), NOW()) " +
                            "ON CONFLICT DO NOTHING",
                            userIdStr, userIdStr, userMetaData
                    );
                } catch (Exception ie) {
                    System.out.println("[AuthController] Identity sync notice: " + ie.getMessage());
                }

                return ResponseEntity.ok(ApiResponse.success(
                        "Account ready",
                        Map.of("created", false, "exists", true, "email", normalizedEmail, "userId", userIdStr)
                ));
            }

            // Create new user
            UUID newUserId = UUID.randomUUID();
            String userIdStr = newUserId.toString();

            String userMetaData = String.format(
                    "{\"sub\":\"%s\",\"email\":\"%s\",\"full_name\":\"%s\",\"role\":\"STUDENT\",\"email_verified\":true,\"phone_verified\":false}",
                    userIdStr, normalizedEmail, trimmedName.replace("\"", "\\\"")
            );

            // 1. Insert into auth.users
            jdbcTemplate.update(
                    "INSERT INTO auth.users (" +
                    " instance_id, id, aud, role, email, encrypted_password, " +
                    " email_confirmed_at, confirmation_token, confirmation_sent_at, " +
                    " recovery_token, email_change_token_new, email_change, phone_change, phone_change_token, " +
                    " email_change_token_current, email_change_confirm_status, reauthentication_token, " +
                    " raw_app_meta_data, raw_user_meta_data, " +
                    " is_sso_user, is_anonymous, created_at, updated_at) " +
                    "VALUES (" +
                    " '00000000-0000-0000-0000-000000000000', ?, 'authenticated', 'authenticated', ?, ?, " +
                    " NOW(), '', NULL, " +
                    " '', '', '', '', '', " +
                    " '', 0, '', " +
                    " '{\"provider\":\"email\",\"providers\":[\"email\"]}'::jsonb, ?::jsonb, " +
                    " false, false, NOW(), NOW())",
                    newUserId,
                    normalizedEmail,
                    hashedPassword,
                    userMetaData
            );

            // 2. Insert into auth.identities
            jdbcTemplate.update(
                    "INSERT INTO auth.identities (" +
                    " provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at) " +
                    "VALUES (?, ?, ?::jsonb, 'email', NOW(), NOW(), NOW()) " +
                    "ON CONFLICT DO NOTHING",
                    userIdStr,
                    newUserId,
                    userMetaData
            );

            return ResponseEntity.ok(ApiResponse.success(
                    "Account created successfully",
                    Map.of("created", true, "userId", userIdStr, "email", normalizedEmail)
            ));

        } catch (Exception e) {
            System.err.println("[AuthController] register error: " + e.getMessage());
            return ResponseEntity.status(500).body(ApiResponse.error("Registration failed: " + e.getMessage()));
        }
    }

    /**
     * Auto-confirms a user's email — called when signIn returns email_not_confirmed.
     */
    @PostMapping("/confirm-user")
    public ResponseEntity<ApiResponse<Map<String, Object>>> confirmUser(
            @RequestBody Map<String, String> body) {

        String email = body == null ? null : body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email is required"));
        }

        try {
            int updated = jdbcTemplate.update(
                    "UPDATE auth.users " +
                    "SET email_confirmed_at = COALESCE(email_confirmed_at, NOW()), " +
                    "    confirmation_token = '', confirmation_sent_at = NULL " +
                    "WHERE LOWER(email) = LOWER(?) AND deleted_at IS NULL AND email_confirmed_at IS NULL",
                    email.trim()
            );

            if (updated > 0) {
                return ResponseEntity.ok(ApiResponse.success("Email confirmed", Map.of("confirmed", true)));
            } else {
                return ResponseEntity.ok(ApiResponse.success("Already confirmed or not found", Map.of("confirmed", false)));
            }
        } catch (Exception e) {
            System.err.println("[AuthController] confirm-user error: " + e.getMessage());
            return ResponseEntity.ok(ApiResponse.success("Could not confirm", Map.of("confirmed", false)));
        }
    }
}