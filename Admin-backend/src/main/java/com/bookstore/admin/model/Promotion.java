package com.bookstore.admin.model;

import java.util.UUID;

public class Promotion {
    private String id;
    private String code;
    private String type;
    private double value;
    private double minOrder;
    private String expiry;
    private String status;
    private int usage;
    private int maxUses;

    public Promotion() { this.id = UUID.randomUUID().toString(); }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public double getValue() { return value; }
    public void setValue(double value) { this.value = value; }
    public double getMinOrder() { return minOrder; }
    public void setMinOrder(double minOrder) { this.minOrder = minOrder; }
    public String getExpiry() { return expiry; }
    public void setExpiry(String expiry) { this.expiry = expiry; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public int getUsage() { return usage; }
    public void setUsage(int usage) { this.usage = usage; }
    public int getMaxUses() { return maxUses; }
    public void setMaxUses(int maxUses) { this.maxUses = maxUses; }
}
