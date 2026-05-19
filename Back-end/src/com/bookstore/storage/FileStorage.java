package com.bookstore.storage;

import java.io.*;
import java.nio.file.*;
import java.util.*;

/**
 * FileStorage – Generic TXT file read/write utility.
 *
 * All data in this application is persisted in plain text files
 * stored under Back-end/data/.  Each file uses pipe '|' delimited
 * lines (one record per line).  Blank lines and lines starting with
 * '#' are treated as comments and ignored.
 *
 * This class is intentionally kept framework-free (pure Java SE).
 */
public class FileStorage {

    /** Root directory where all .txt data files are stored */
    private static final String DATA_DIR = "data/";

    // ── Read helpers ─────────────────────────────────────────────────────────

    /**
     * Read all non-empty, non-comment lines from a file.
     * Returns an empty list if the file does not exist yet.
     *
     * @param filename e.g. "users.txt"
     */
    public static List<String> readLines(String filename) {
        List<String> lines = new ArrayList<>();
        Path path = Paths.get(DATA_DIR + filename);
        if (!Files.exists(path)) return lines;
        try (BufferedReader br = Files.newBufferedReader(path)) {
            String line;
            while ((line = br.readLine()) != null) {
                line = line.trim();
                if (!line.isEmpty() && !line.startsWith("#")) {
                    lines.add(line);
                }
            }
        } catch (IOException e) {
            System.err.println("[FileStorage] Error reading " + filename + ": " + e.getMessage());
        }
        return lines;
    }

    // ── Write helpers ─────────────────────────────────────────────────────────

    /**
     * Overwrite the entire file with the given list of lines.
     * Creates parent directories if they do not exist.
     *
     * @param filename e.g. "users.txt"
     * @param lines    the lines to write (no trailing newline needed)
     */
    public static void writeLines(String filename, List<String> lines) {
        Path path = Paths.get(DATA_DIR + filename);
        try {
            Files.createDirectories(path.getParent());
            try (BufferedWriter bw = Files.newBufferedWriter(path)) {
                for (String line : lines) {
                    bw.write(line);
                    bw.newLine();
                }
            }
        } catch (IOException e) {
            System.err.println("[FileStorage] Error writing " + filename + ": " + e.getMessage());
        }
    }

    /**
     * Append a single line to the file.
     * Creates the file (and parent directories) if they do not exist.
     *
     * @param filename e.g. "orders.txt"
     * @param line     the line to append
     */
    public static void appendLine(String filename, String line) {
        Path path = Paths.get(DATA_DIR + filename);
        try {
            Files.createDirectories(path.getParent());
            try (BufferedWriter bw = new BufferedWriter(
                    new FileWriter(path.toFile(), true))) {
                bw.write(line);
                bw.newLine();
            }
        } catch (IOException e) {
            System.err.println("[FileStorage] Error appending to " + filename + ": " + e.getMessage());
        }
    }

    // ── Convenience ──────────────────────────────────────────────────────────

    /**
     * Check whether a given file exists in the data directory.
     */
    public static boolean fileExists(String filename) {
        return Files.exists(Paths.get(DATA_DIR + filename));
    }

    /**
     * Ensure that a data file exists; create it empty if it does not.
     */
    public static void ensureFile(String filename) {
        Path path = Paths.get(DATA_DIR + filename);
        if (!Files.exists(path)) {
            writeLines(filename, Collections.emptyList());
        }
    }

    /**
     * Parse a simple JSON body (key-value pairs, string and numeric only).
     * Used in handlers where we need to extract specific fields from a
     * compact JSON request body without pulling in a JSON library.
     *
     * Example input:  {"name":"Alice","age":30}
     * Returns map:    {name -> Alice, age -> 30}
     */
    public static Map<String, String> parseJsonBody(String json) {
        Map<String, String> map = new LinkedHashMap<>();
        if (json == null || json.isBlank()) return map;

        // Remove surrounding braces
        json = json.trim();
        if (json.startsWith("{")) json = json.substring(1);
        if (json.endsWith("}"))   json = json.substring(0, json.length() - 1);

        // Split by comma — naive but sufficient for flat JSON
        String[] pairs = json.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
        for (String pair : pairs) {
            int colon = pair.indexOf(':');
            if (colon < 0) continue;
            String key   = pair.substring(0, colon).trim().replaceAll("\"", "");
            String value = pair.substring(colon + 1).trim().replaceAll("^\"|\"$", "");
            map.put(key, value);
        }
        return map;
    }
}
