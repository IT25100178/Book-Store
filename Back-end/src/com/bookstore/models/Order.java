package com.bookstore.models;

/**
 * OOP Model – Order
 * Represents a completed checkout order.
 * Data is serialized to / deserialized from orders.txt
 *
 * Items field format inside orders.txt:
 *   bookId:qty,bookId:qty,...
 */
public class Order {

    private String id;
    private String userId;
    private String items;        // "bookId:qty,bookId:qty"
    private double totalPrice;
    private double tax;
    private double deliveryCharge;
    private String status;       // "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
    private String paymentMethod;// "COD" | "ONLINE"
    private String address;
    private String discountCode;
    private double discountAmount;
    private String createdAt;

    // ── Constructors ─────────────────────────────────────────────────────────

    public Order() {}

    public Order(String id, String userId, String items, double totalPrice,
                 double tax, double deliveryCharge, String status,
                 String paymentMethod, String address, String discountCode,
                 double discountAmount, String createdAt) {
        this.id             = id;
        this.userId         = userId;
        this.items          = items;
        this.totalPrice     = totalPrice;
        this.tax            = tax;
        this.deliveryCharge = deliveryCharge;
        this.status         = status;
        this.paymentMethod  = paymentMethod;
        this.address        = address;
        this.discountCode   = discountCode;
        this.discountAmount = discountAmount;
        this.createdAt      = createdAt;
    }

    // ── Getters & Setters ────────────────────────────────────────────────────

    public String getId()                       { return id; }
    public void   setId(String id)              { this.id = id; }

    public String getUserId()                       { return userId; }
    public void   setUserId(String userId)          { this.userId = userId; }

    public String getItems()                    { return items; }
    public void   setItems(String items)        { this.items = items; }

    public double getTotalPrice()                       { return totalPrice; }
    public void   setTotalPrice(double totalPrice)      { this.totalPrice = totalPrice; }

    public double getTax()                  { return tax; }
    public void   setTax(double tax)        { this.tax = tax; }

    public double getDeliveryCharge()                           { return deliveryCharge; }
    public void   setDeliveryCharge(double deliveryCharge)      { this.deliveryCharge = deliveryCharge; }

    public String getStatus()                       { return status; }
    public void   setStatus(String status)          { this.status = status; }

    public String getPaymentMethod()                            { return paymentMethod; }
    public void   setPaymentMethod(String paymentMethod)        { this.paymentMethod = paymentMethod; }

    public String getAddress()                      { return address; }
    public void   setAddress(String address)        { this.address = address; }

    public String getDiscountCode()                         { return discountCode; }
    public void   setDiscountCode(String discountCode)      { this.discountCode = discountCode; }

    public double getDiscountAmount()                           { return discountAmount; }
    public void   setDiscountAmount(double discountAmount)      { this.discountAmount = discountAmount; }

    public String getCreatedAt()                        { return createdAt; }
    public void   setCreatedAt(String createdAt)        { this.createdAt = createdAt; }

    // ── Serialization ─────────────────────────────────────────────────────────

    /**
     * Format: id|userId|items|totalPrice|tax|deliveryCharge|status|
     *          paymentMethod|address|discountCode|discountAmount|createdAt
     */
    public String toFileLine() {
        return String.join("|",
            safe(id), safe(userId), safe(items),
            String.valueOf(totalPrice), String.valueOf(tax), String.valueOf(deliveryCharge),
            safe(status), safe(paymentMethod), safe(address),
            safe(discountCode), String.valueOf(discountAmount), safe(createdAt)
        );
    }

    public static Order fromFileLine(String line) {
        String[] p = line.split("\\|", -1);
        if (p.length < 12) return null;
        try {
            return new Order(
                p[0], p[1], p[2],
                Double.parseDouble(p[3]), Double.parseDouble(p[4]),
                Double.parseDouble(p[5]), p[6], p[7], p[8], p[9],
                Double.parseDouble(p[10]), p[11]
            );
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public String toJson() {
        return "{"
            + "\"id\":\""              + esc(id)                       + "\","
            + "\"userId\":\""          + esc(userId)                   + "\","
            + "\"items\":\""           + esc(items)                    + "\","
            + "\"totalPrice\":"        + totalPrice                    + ","
            + "\"tax\":"               + tax                           + ","
            + "\"deliveryCharge\":"    + deliveryCharge                + ","
            + "\"status\":\""          + esc(status)                   + "\","
            + "\"paymentMethod\":\""   + esc(paymentMethod)            + "\","
            + "\"address\":\""         + esc(address)                  + "\","
            + "\"discountCode\":\""    + esc(discountCode)             + "\","
            + "\"discountAmount\":"    + discountAmount                + ","
            + "\"createdAt\":\""       + esc(createdAt)                + "\""
            + "}";
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private String safe(String s) { return s == null ? "" : s; }
    private String esc(String s)  {
        return s == null ? "" : s.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    @Override
    public String toString() { return toJson(); }
}
