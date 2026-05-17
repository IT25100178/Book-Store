package com.bookstore.models;

/**
 * OOP Model – Book
 * Represents a book in the catalogue.
 * Data is serialized to / deserialized from books.txt
 */
public class Book {

    // ── Fields ──────────────────────────────────────────────────────────────
    private String  id;
    private String  title;
    private String  author;
    private double  price;
    private double  originalPrice;
    private double  rating;
    private String  category;
    private String  description;
    private int     stock;
    private boolean isNew;
    private boolean isBestseller;
    private int     pages;
    private int     year;
    private String  image;           // emoji or URL

    // ── Constructors ─────────────────────────────────────────────────────────

    public Book() {}

    public Book(String id, String title, String author, double price,
                double originalPrice, double rating, String category,
                String description, int stock, boolean isNew, boolean isBestseller,
                int pages, int year, String image) {
        this.id            = id;
        this.title         = title;
        this.author        = author;
        this.price         = price;
        this.originalPrice = originalPrice;
        this.rating        = rating;
        this.category      = category;
        this.description   = description;
        this.stock         = stock;
        this.isNew         = isNew;
        this.isBestseller  = isBestseller;
        this.pages         = pages;
        this.year          = year;
        this.image         = image;
    }

    // ── Getters & Setters ────────────────────────────────────────────────────

    public String  getId()                          { return id; }
    public void    setId(String id)                 { this.id = id; }

    public String  getTitle()                       { return title; }
    public void    setTitle(String title)           { this.title = title; }

    public String  getAuthor()                      { return author; }
    public void    setAuthor(String author)         { this.author = author; }

    public double  getPrice()                       { return price; }
    public void    setPrice(double price)           { this.price = price; }

    public double  getOriginalPrice()                           { return originalPrice; }
    public void    setOriginalPrice(double originalPrice)       { this.originalPrice = originalPrice; }

    public double  getRating()                      { return rating; }
    public void    setRating(double rating)         { this.rating = rating; }

    public String  getCategory()                        { return category; }
    public void    setCategory(String category)         { this.category = category; }

    public String  getDescription()                         { return description; }
    public void    setDescription(String description)       { this.description = description; }

    public int     getStock()                       { return stock; }
    public void    setStock(int stock)              { this.stock = stock; }

    public boolean isNew()                          { return isNew; }
    public void    setNew(boolean isNew)            { this.isNew = isNew; }

    public boolean isBestseller()                               { return isBestseller; }
    public void    setBestseller(boolean isBestseller)          { this.isBestseller = isBestseller; }

    public int     getPages()                       { return pages; }
    public void    setPages(int pages)              { this.pages = pages; }

    public int     getYear()                        { return year; }
    public void    setYear(int year)                { this.year = year; }

    public String  getImage()                       { return image; }
    public void    setImage(String image)           { this.image = image; }

    // ── Serialization ─────────────────────────────────────────────────────────

    /**
     * Format: id|title|author|price|originalPrice|rating|category|description|
     *          stock|isNew|isBestseller|pages|year|image
     */
    public String toFileLine() {
        return String.join("|",
            safe(id), safe(title), safe(author),
            String.valueOf(price), String.valueOf(originalPrice),
            String.valueOf(rating), safe(category), safe(description),
            String.valueOf(stock), String.valueOf(isNew), String.valueOf(isBestseller),
            String.valueOf(pages), String.valueOf(year), safe(image)
        );
    }

    public static Book fromFileLine(String line) {
        String[] p = line.split("\\|", -1);
        if (p.length < 14) return null;
        try {
            return new Book(
                p[0], p[1], p[2],
                Double.parseDouble(p[3]), Double.parseDouble(p[4]),
                Double.parseDouble(p[5]), p[6], p[7],
                Integer.parseInt(p[8]),
                Boolean.parseBoolean(p[9]), Boolean.parseBoolean(p[10]),
                Integer.parseInt(p[11]), Integer.parseInt(p[12]), p[13]
            );
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public String toJson() {
        return "{"
            + "\"id\":\""            + esc(id)                    + "\","
            + "\"title\":\""         + esc(title)                 + "\","
            + "\"author\":\""        + esc(author)                + "\","
            + "\"price\":"           + price                      + ","
            + "\"originalPrice\":"   + originalPrice              + ","
            + "\"rating\":"          + rating                     + ","
            + "\"category\":\""      + esc(category)              + "\","
            + "\"description\":\""   + esc(description)           + "\","
            + "\"stock\":"           + stock                      + ","
            + "\"isNew\":"           + isNew                      + ","
            + "\"isBestseller\":"    + isBestseller               + ","
            + "\"pages\":"           + pages                      + ","
            + "\"year\":"            + year                       + ","
            + "\"image\":\""         + esc(image)                 + "\""
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
