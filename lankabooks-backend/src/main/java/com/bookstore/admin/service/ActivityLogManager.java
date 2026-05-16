package com.bookstore.admin.service;

import com.bookstore.admin.model.ActivityLog;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * ActivityLogManager - Service class for ActivityLog operations.
 * DSA Implementation:
 * - LinkedList as the primary structure for naturally ordered chronological entries.
 * - Circular Buffer logic: Capped at 500 entries, removes head (FIFO) when full.
 * - HashMap secondary index for O(1) filtered retrieval by action type.
 */
@Service
public class ActivityLogManager {
    private final JsonStorageUtil storage;
    private LinkedList<ActivityLog> logs = new LinkedList<>();
    private HashMap<String, List<ActivityLog>> actionIndex = new HashMap<>();

    private static final int MAX_LOGS = 500;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    public ActivityLogManager(JsonStorageUtil storage) {
        this.storage = storage;
    }

    @PostConstruct
    public void init() throws IOException {
        List<ActivityLog> readLogs = storage.readLogs();
        if (readLogs != null) {
            logs.addAll(readLogs);
            for (ActivityLog log : readLogs) {
                actionIndex.computeIfAbsent(log.getAction(), k -> new ArrayList<>()).add(log);
            }
        }
    }

    public List<ActivityLog> getAll() {
        return new ArrayList<>(logs); // Return a copy
    }

    public List<ActivityLog> getByAction(String action) {
        return actionIndex.getOrDefault(action, new ArrayList<>());
    }
    
    public List<ActivityLog> getByAdminId(String adminId) {
        List<ActivityLog> result = new ArrayList<>();
        // Linear scan for adminId since it's not indexed
        for(ActivityLog log : logs) {
            if(adminId.equals(log.getAdminId())) {
                result.add(log);
            }
        }
        return result;
    }

    public ActivityLog log(String adminId, String action, String targetId, String targetType, String details) {
        String id = UUID.randomUUID().toString();
        String timestamp = LocalDateTime.now().format(formatter);
        ActivityLog newLog = new ActivityLog(id, adminId, action, targetId, targetType, timestamp, details);

        logs.addLast(newLog); // Push to tail
        actionIndex.computeIfAbsent(action, k -> new ArrayList<>()).add(newLog);

        // Circular buffer (FIFO) if over cap
        if (logs.size() > MAX_LOGS) {
            ActivityLog oldestLog = logs.removeFirst();
            List<ActivityLog> indexedLogs = actionIndex.get(oldestLog.getAction());
            if (indexedLogs != null) {
                indexedLogs.remove(oldestLog); // remove from secondary index
            }
        }

        try {
            save();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return newLog;
    }

    private void save() throws IOException {
        storage.writeLogs(new ArrayList<>(logs));
    }
}
