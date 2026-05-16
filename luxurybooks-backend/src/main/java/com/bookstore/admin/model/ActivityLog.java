package com.bookstore.admin.model;

public class ActivityLog {
    private String id;
    private String adminId;
    private String action;
    private String targetId;
    private String targetType;
    private String timestamp;
    private String details;

    public ActivityLog() {
    }

    public ActivityLog(String id, String adminId, String action, String targetId, String targetType, String timestamp, String details) {
        this.id = id;
        this.adminId = adminId;
        this.action = action;
        this.targetId = targetId;
        this.targetType = targetType;
        this.timestamp = timestamp;
        this.details = details;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getAdminId() { return adminId; }
    public void setAdminId(String adminId) { this.adminId = adminId; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getTargetId() { return targetId; }
    public void setTargetId(String targetId) { this.targetId = targetId; }
    public String getTargetType() { return targetType; }
    public void setTargetType(String targetType) { this.targetType = targetType; }
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}
