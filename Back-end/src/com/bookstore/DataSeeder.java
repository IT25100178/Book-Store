package com.bookstore;

import com.bookstore.storage.FileStorage;

import java.util.List;

/**
 * DataSeeder – Pre-populates the TXT data files with
 * sample books and a demo admin account if they are empty.
 *
 * This runs once on first server startup.
 */
public class DataSeeder {

    public static void seed() {
        seedAdmin();
        seedBooks();
    }

    // ── Admin user ────────────────────────────────────────────────────────────

    private static void seedAdmin() {
        List<String> lines = FileStorage.readLines("users.txt");
        if (!lines.isEmpty()) return;   // already seeded

        // id|name|email|password|phone|address|role|avatar|joinDate
        String admin = "ADMIN001|Vishahan Admin|admin@luxurybooks.com|admin123"
                + "|(+94)742624977|132/1 Thalaiyadi Lane Jaffna"
                + "|ADMIN"
                + "|https://ui-avatars.com/api/?background=8B0000&color=fff&name=Admin"
                + "|2024-01-01";
        FileStorage.appendLine("users.txt", admin);
        System.out.println("[Seeder] Admin user created → admin@luxurybooks.com / admin123");
    }

    // ── Books ─────────────────────────────────────────────────────────────────

    private static void seedBooks() {
        List<String> lines = FileStorage.readLines("books.txt");
        if (!lines.isEmpty()) return;   // already seeded

        // id|title|author|price|originalPrice|rating|category|description|
        //   stock|isNew|isBestseller|pages|year|image
        String[] books = {
            "BK001|The Great Gatsby|F. Scott Fitzgerald|14.99|24.99|4.5|Fiction"
                + "|A story of decadence and excess exploring the darker aspects of the American Dream."
                + "|15|false|true|180|1925|📖",

            "BK002|To Kill a Mockingbird|Harper Lee|12.99|19.99|4.8|Classic"
                + "|The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience."
                + "|8|false|true|336|1960|📚",

            "BK003|1984|George Orwell|13.99|18.99|4.7|Dystopian"
                + "|A dystopian social science fiction novel and cautionary tale against unchecked government power."
                + "|20|true|false|328|1949|📕",

            "BK004|Pride and Prejudice|Jane Austen|11.99|16.99|4.6|Romance"
                + "|A romantic novel that also contains a sharp critique of the British class system."
                + "|12|false|true|279|1813|💕",

            "BK005|The Hobbit|J.R.R. Tolkien|15.99|22.99|4.9|Fantasy"
                + "|A fantasy novel about Bilbo Baggins and his unexpected adventure with wizards and dwarves."
                + "|25|false|true|310|1937|🐉",

            "BK006|Harry Potter and the Philosopher's Stone|J.K. Rowling|19.99|29.99|4.9|Fantasy"
                + "|The story of a young wizard and his adventures at Hogwarts School of Witchcraft and Wizardry."
                + "|30|true|true|320|1997|⚡",

            "BK007|The Da Vinci Code|Dan Brown|12.99|17.99|4.3|Mystery"
                + "|A mystery thriller about a murder investigation in the Louvre Museum in Paris."
                + "|18|false|false|454|2003|🔍",

            "BK008|Becoming|Michelle Obama|17.99|24.99|4.8|Biography"
                + "|The intimate and powerful memoir of the former First Lady of the United States."
                + "|22|true|true|448|2018|👩",

            "BK009|Animal Farm|George Orwell|11.99|16.99|4.6|Dystopian"
                + "|A satirical novella about farm animals who rebel against their human farmer."
                + "|18|false|true|112|1945|🐖",

            "BK010|The Lord of the Rings: The Fellowship|J.R.R. Tolkien|18.99|25.99|4.8|Fantasy"
                + "|The first volume following Frodo Baggins and the Fellowship on a quest to destroy the One Ring."
                + "|22|false|true|423|1954|🧙",

            "BK011|The Catcher in the Rye|J.D. Salinger|13.49|18.49|4.4|Classic"
                + "|A controversial novel narrated by Holden Caulfield about teenage rebellion and alienation."
                + "|10|false|false|277|1951|📓",

            "BK012|Sense and Sensibility|Jane Austen|10.99|15.99|4.3|Romance"
                + "|A story of two sisters facing very different challenges in their search for love and happiness."
                + "|14|false|false|352|1811|💃"
        };

        for (String book : books) {
            FileStorage.appendLine("books.txt", book);
        }
        System.out.println("[Seeder] " + books.length + " books seeded into books.txt");
    }
}
