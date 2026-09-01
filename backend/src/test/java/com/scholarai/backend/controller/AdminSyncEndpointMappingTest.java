package com.scholarai.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AdminSyncEndpointMappingTest {

    @Autowired
    private MockMvc mockMvc;

    private static final String VALID_SCHEDULER_SECRET = "test-scheduler-secret-2026";

    @Test
    void testPublishSafeEndpointMappingWithValidSecret() throws Exception {
        mockMvc.perform(post("/api/admin/discovery/publish-safe")
                        .header("X-Scheduler-Secret", VALID_SCHEDULER_SECRET)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Safe candidates published successfully"));
    }

    @Test
    void testPublishSafeEndpointMappingWithInvalidSecret() throws Exception {
        mockMvc.perform(post("/api/admin/discovery/publish-safe")
                        .header("X-Scheduler-Secret", "invalid-secret-token")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testPublishSafeEndpointMappingWithMissingSecret() throws Exception {
        mockMvc.perform(post("/api/admin/discovery/publish-safe")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testSyncPublishSafeEndpointMappingWithValidSecret() throws Exception {
        mockMvc.perform(post("/api/admin/sync/publish-safe")
                        .header("X-Scheduler-Secret", VALID_SCHEDULER_SECRET)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
