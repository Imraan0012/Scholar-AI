package com.scholarai.backend.util;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class DeadlineStatusUtil {

    public static String calculateDeadlineStatus(String deadlineStr, String startStr) {
        if (deadlineStr == null || deadlineStr.trim().isEmpty()) {
            return "YEAR_ROUND";
        }

        try {
            LocalDate today = LocalDate.now();
            LocalDate deadline = LocalDate.parse(deadlineStr.substring(0, Math.min(10, deadlineStr.length())));

            if (startStr != null && !startStr.trim().isEmpty()) {
                LocalDate start = LocalDate.parse(startStr.substring(0, Math.min(10, startStr.length())));
                if (today.isBefore(start)) {
                    return "NOT_YET_OPEN";
                }
            }

            long daysUntilDeadline = ChronoUnit.DAYS.between(today, deadline);
            if (daysUntilDeadline < 0) {
                return "CLOSED";
            } else if (daysUntilDeadline <= 15) {
                return "CLOSING_SOON";
            } else {
                return "OPEN";
            }
        } catch (Exception e) {
            return "OPEN";
        }
    }
}
