package com.bookstore.admin.service;

import com.bookstore.admin.model.Book;
import com.bookstore.admin.model.Genre;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

/**
 * GenreManager - Service class for Genre operations.
 * DSA Implementation:
 * - HashMap<String, Genre> for O(1) storage & lookup.
 * - GenreGraph (inner class): adjacency-list graph where genres are nodes,
 *   edges represent books shared across multiple genres.
 *   - BFS traversal to find related genres within 2 hops.
 *   - Degree calculation to find the most connected genre.
 */
@Service
public class GenreManager {

    private final JsonStorageUtil storage;
    private final ActivityLogManager activityLog;
    private HashMap<String, Genre> genreMap = new HashMap<>();

    // ─── Inner Genre Graph Implementation ───────────────────────────────
    /** Adjacency list: genreId -> Set of (neighbour genreId, shared bookId pairs) */
    private HashMap<String, HashMap<String, Set<String>>> graph = new HashMap<>();

    public GenreManager(JsonStorageUtil storage, ActivityLogManager activityLog) {
        this.storage = storage;
        this.activityLog = activityLog;
    }

    @PostConstruct
    public void init() throws IOException {
        List<Genre> genres = storage.readGenres();
        for (Genre g : genres) {
            genreMap.put(g.getId(), g);
        }
        rebuildGraph();
    }

    /** Rebuild the genre relationship graph from current book-genre associations. */
    private void rebuildGraph() {
        graph.clear();
        try {
            List<Book> books = storage.readBooks();
            // Build a map: bookId -> list of genreIds containing that book
            // We use the book's 'category' field (string name) to find the matching genre ID
            HashMap<String, List<String>> bookToGenres = new HashMap<>();
            
            // Create a lookup for Genre Name -> Genre ID
            HashMap<String, String> nameToId = new HashMap<>();
            for (Genre g : genreMap.values()) {
                nameToId.put(g.getName().toLowerCase(), g.getId());
                g.setBookIds(new ArrayList<>()); // Clear old references
            }

            for (Book b : books) {
                if (b.getCategory() == null || b.getCategory().trim().isEmpty()) continue;
                String gId = nameToId.get(b.getCategory().toLowerCase());
                if (gId != null) {
                    bookToGenres.computeIfAbsent(b.getId(), k -> new ArrayList<>()).add(gId);
                    Genre targetGenre = genreMap.get(gId);
                    if (targetGenre != null) {
                        targetGenre.getBookIds().add(b.getId());
                    }
                }
            }

            // For each book in multiple genres (if any, though usually 1:1), add edges
            for (Map.Entry<String, List<String>> entry : bookToGenres.entrySet()) {
                String bookId = entry.getKey();
                List<String> gIds = entry.getValue();
                for (int i = 0; i < gIds.size(); i++) {
                    for (int j = i + 1; j < gIds.size(); j++) {
                        addEdge(gIds.get(i), gIds.get(j), bookId);
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /** addEdge — O(1) amortized. Creates a bidirectional edge between two genres sharing a book. */
    private void addEdge(String genreId1, String genreId2, String bookId) {
        graph.computeIfAbsent(genreId1, k -> new HashMap<>())
                .computeIfAbsent(genreId2, k -> new HashSet<>()).add(bookId);
        graph.computeIfAbsent(genreId2, k -> new HashMap<>())
                .computeIfAbsent(genreId1, k -> new HashSet<>()).add(bookId);
    }

    /**
     * BFS traversal — O(V + E).
     * Returns all genres reachable within 2 hops from the given genre.
     */
    public List<Genre> getRelatedGenres(String genreId) {
        Set<String> visited = new HashSet<>();
        Queue<String> queue = new LinkedList<>();
        Map<String, Integer> distance = new HashMap<>();

        queue.add(genreId);
        visited.add(genreId);
        distance.put(genreId, 0);

        List<Genre> result = new ArrayList<>();
        while (!queue.isEmpty()) {
            String current = queue.poll();
            int dist = distance.get(current);
            if (dist > 0 && dist <= 2) { // include genres within 2 hops (not the source itself)
                Genre g = genreMap.get(current);
                if (g != null) result.add(g);
            }
            if (dist < 2) { // only explore up to depth 2
                HashMap<String, Set<String>> neighbours = graph.getOrDefault(current, new HashMap<>());
                for (String neighbour : neighbours.keySet()) {
                    if (!visited.contains(neighbour)) {
                        visited.add(neighbour);
                        queue.add(neighbour);
                        distance.put(neighbour, dist + 1);
                    }
                }
            }
        }
        return result;
    }

    /**
     * Degree calculation — O(V).
     * Returns the genre with the highest number of connections (most shared books).
     */
    public Genre getMostConnectedGenre() {
        String mostConnectedId = null;
        int maxDegree = -1;
        for (Map.Entry<String, HashMap<String, Set<String>>> entry : graph.entrySet()) {
            int degree = entry.getValue().size();
            if (degree > maxDegree) {
                maxDegree = degree;
                mostConnectedId = entry.getKey();
            }
        }
        return mostConnectedId != null ? genreMap.get(mostConnectedId) : null;
    }

    // ─── CRUD Operations ────────────────────────────────────────────────
    public List<Genre> getAll() {
        return new ArrayList<>(genreMap.values());
    }

    public Genre getById(String id) {
        return genreMap.get(id);
    }

    public List<Genre> getBooksByGenre(String id) {
        // Returns the genre object (frontend extracts bookIds)
        Genre g = genreMap.get(id);
        return g != null ? List.of(g) : new ArrayList<>();
    }

    public Genre add(Genre genre) throws IOException {
        genreMap.put(genre.getId(), genre);
        rebuildGraph();
        save();
        activityLog.log("ADMIN_01", "GENRE_ADDED", genre.getId(), "GENRE", "Added new genre: " + genre.getName());
        return genre;
    }

    public Genre update(String id, Genre updated) throws IOException {
        if (!genreMap.containsKey(id)) return null;
        updated.setId(id);
        genreMap.put(id, updated);
        rebuildGraph();
        save();
        activityLog.log("ADMIN_01", "GENRE_UPDATED", id, "GENRE", "Updated genre: " + updated.getName());
        return updated;
    }

    public Genre delete(String id) throws IOException {
        Genre removed = genreMap.remove(id);
        if (removed != null) {
            rebuildGraph();
            save();
            activityLog.log("ADMIN_01", "GENRE_DELETED", id, "GENRE", "Deleted genre: " + removed.getName());
        }
        return removed;
    }

    private void save() throws IOException {
        storage.writeGenres(new ArrayList<>(genreMap.values()));
    }
}
