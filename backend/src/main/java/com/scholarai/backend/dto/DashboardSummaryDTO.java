package com.scholarai.backend.dto;

public class DashboardSummaryDTO {
    private long eligibleCount;
    private long possibleCount;
    private long notEligibleCount;
    private long totalCount;
    private int profileCompletion;
    private long unreadNotifications;
    private long savedScholarships;
    private long activeApplications;

    public DashboardSummaryDTO() {}

    public DashboardSummaryDTO(long eligibleCount, long possibleCount, long notEligibleCount, long totalCount,
                               int profileCompletion, long unreadNotifications, long savedScholarships, long activeApplications) {
        this.eligibleCount = eligibleCount;
        this.possibleCount = possibleCount;
        this.notEligibleCount = notEligibleCount;
        this.totalCount = totalCount;
        this.profileCompletion = profileCompletion;
        this.unreadNotifications = unreadNotifications;
        this.savedScholarships = savedScholarships;
        this.activeApplications = activeApplications;
    }

    public long getEligibleCount() { return eligibleCount; }
    public void setEligibleCount(long eligibleCount) { this.eligibleCount = eligibleCount; }

    public long getPossibleCount() { return possibleCount; }
    public void setPossibleCount(long possibleCount) { this.possibleCount = possibleCount; }

    public long getNotEligibleCount() { return notEligibleCount; }
    public void setNotEligibleCount(long notEligibleCount) { this.notEligibleCount = notEligibleCount; }

    public long getTotalCount() { return totalCount; }
    public void setTotalCount(long totalCount) { this.totalCount = totalCount; }

    public int getProfileCompletion() { return profileCompletion; }
    public void setProfileCompletion(int profileCompletion) { this.profileCompletion = profileCompletion; }

    public long getUnreadNotifications() { return unreadNotifications; }
    public void setUnreadNotifications(long unreadNotifications) { this.unreadNotifications = unreadNotifications; }

    public long getSavedScholarships() { return savedScholarships; }
    public void setSavedScholarships(long savedScholarships) { this.savedScholarships = savedScholarships; }

    public long getActiveApplications() { return activeApplications; }
    public void setActiveApplications(long activeApplications) { this.activeApplications = activeApplications; }
}
