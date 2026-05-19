package com.luxurybooks.model;

/**
 * Model representing a Discount/Coupon Code.
 * Demonstrates OOP: Encapsulation.
 */
public class DiscountCode {
    private String code;
    private double discountPercentage;
    private double maxDiscount;  // Maximum discount cap in dollars
    private boolean isActive;

    public DiscountCode() {}

    public DiscountCode(String code, double discountPercentage, double maxDiscount) {
        this.code = code;
        this.discountPercentage = discountPercentage;
        this.maxDiscount = maxDiscount;
        this.isActive = true;
    }

    /**
     * Calculates the discount amount for a given subtotal.
     * @param subtotal The subtotal to apply the discount to.
     * @return The actual discount amount (capped at maxDiscount).
     */
    public double calculateDiscount(double subtotal) {
        double rawDiscount = subtotal * (discountPercentage / 100.0);
        return Math.min(rawDiscount, maxDiscount);
    }

    // Encapsulation: Getters and Setters
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public double getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(double discountPercentage) { this.discountPercentage = discountPercentage; }

    public double getMaxDiscount() { return maxDiscount; }
    public void setMaxDiscount(double maxDiscount) { this.maxDiscount = maxDiscount; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}
