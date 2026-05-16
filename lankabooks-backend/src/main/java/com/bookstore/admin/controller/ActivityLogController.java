package com.bookstore.admin.controller;

import com.bookstore.admin.model.ActivityLog;
import com.bookstore.admin.service.ActivityLogManager;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/logs")
@CrossOrigin(origins = "*")
public class ActivityLogController {

    private final ActivityLogManager logManager;

    public ActivityLogController(ActivityLogManager logManager) {
        this.logManager = logManager;
    }

    @GetMapping
    public List<ActivityLog> getLogs(
            @RequestParam(required = false) String action, 
            @RequestParam(required = false) String adminId) {
        
        if (action != null && !action.isEmpty()) {
            return logManager.getByAction(action);
        } else if (adminId != null && !adminId.isEmpty()) {
            return logManager.getByAdminId(adminId);
        }
        return logManager.getAll();
    }
}
