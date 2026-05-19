package com.bookstore.admin.service;

import com.bookstore.admin.model.Promotion;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.*;
import java.util.*;

@Service
public class PromotionManager {
    private final JsonStorageUtil storage;
    private HashMap<String, Promotion> promoMap = new HashMap<>();

    public PromotionManager(JsonStorageUtil storage) {
        this.storage = storage;
    }

    @PostConstruct
    public void init() {
        try {
            for (Promotion p : storage.readPromotions()) {
                promoMap.put(p.getId(), p);
            }
            syncToTxt();
        } catch(Exception ignored){}
    }

    public List<Promotion> getAll() {
        return new ArrayList<>(promoMap.values());
    }

    public Promotion add(Promotion p) throws Exception {
        if(p.getId() == null || p.getId().isEmpty()) {
            p.setId(UUID.randomUUID().toString());
        }
        promoMap.put(p.getId(), p);
        save();
        return p;
    }

    public Promotion update(String id, Promotion p) throws Exception {
        p.setId(id);
        promoMap.put(id, p);
        save();
        return p;
    }

    public void delete(String id) throws Exception {
        promoMap.remove(id);
        save();
    }

    private void save() throws Exception {
        storage.writePromotions(new ArrayList<>(promoMap.values()));
        syncToTxt();
    }

    private void syncToTxt() {
        try {
            File file = new File("../Back-end/data/promotions.txt");
            if (file.getParentFile() != null) file.getParentFile().mkdirs();
            if (!file.exists()) file.createNewFile();
            try (PrintWriter writer = new PrintWriter(new FileWriter(file))) {
                for (Promotion p : promoMap.values()) {
                    String line = String.join("|",
                        p.getId() != null ? p.getId() : "",
                        p.getCode() != null ? p.getCode() : "",
                        p.getType() != null ? p.getType() : "",
                        String.valueOf(p.getValue()),
                        String.valueOf(p.getMinOrder()),
                        p.getExpiry() != null ? p.getExpiry() : "",
                        p.getStatus() != null ? p.getStatus() : "",
                        String.valueOf(p.getUsage()),
                        String.valueOf(p.getMaxUses())
                    );
                    writer.println(line);
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to sync promotions: " + e.getMessage());
        }
    }
}
