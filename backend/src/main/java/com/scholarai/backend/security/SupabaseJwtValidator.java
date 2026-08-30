package com.scholarai.backend.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

@Component
public class SupabaseJwtValidator {

    private static final Logger log = LoggerFactory.getLogger(SupabaseJwtValidator.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${supabase.jwt.secret:}")
    private String jwtSecret;

    public AuthenticatedUser validateToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            return null;
        }

        try {
            // If secret is configured, perform cryptographic signature verification
            if (jwtSecret != null && !jwtSecret.trim().isEmpty()) {
                byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
                SecretKey key = Keys.hmacShaKeyFor(keyBytes);

                Claims claims = Jwts.parser()
                        .verifyWith(key)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

                String sub = claims.getSubject();
                String email = claims.get("email", String.class);
                String role = claims.get("role", String.class);

                if (sub != null && !sub.isEmpty()) {
                    return new AuthenticatedUser(UUID.fromString(sub), email, role != null ? role : "ROLE_USER");
                }
            } else {
                // Parse JWT claims directly from payload
                String[] parts = token.split("\\.");
                if (parts.length < 2) {
                    log.warn("Invalid JWT structure");
                    return null;
                }

                String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
                JsonNode payload = objectMapper.readTree(payloadJson);

                if (payload.has("exp")) {
                    long expSeconds = payload.get("exp").asLong();
                    long nowSeconds = System.currentTimeMillis() / 1000;
                    if (expSeconds < nowSeconds) {
                        log.warn("Supabase JWT has expired");
                        return null;
                    }
                }

                if (payload.has("sub")) {
                    String sub = payload.get("sub").asText();
                    String email = payload.has("email") ? payload.get("email").asText() : null;
                    String role = payload.has("role") ? payload.get("role").asText() : "ROLE_USER";

                    // Check for admin role in app_metadata if present
                    if (payload.has("app_metadata") && payload.get("app_metadata").has("role")) {
                        String appRole = payload.get("app_metadata").get("role").asText();
                        if ("admin".equalsIgnoreCase(appRole)) {
                            role = "ROLE_ADMIN";
                        }
                    }

                    return new AuthenticatedUser(UUID.fromString(sub), email, role);
                }
            }
        } catch (Exception e) {
            log.error("Supabase JWT validation failed: {}", e.getMessage());
        }

        return null;
    }
}
