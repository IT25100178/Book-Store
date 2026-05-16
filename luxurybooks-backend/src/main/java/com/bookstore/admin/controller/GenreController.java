package com.bookstore.admin.controller;

import com.bookstore.admin.model.Genre;
import com.bookstore.admin.service.GenreManager;
import com.bookstore.admin.service.ActivityLogManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/genres")
@CrossOrigin(origins = "*")
public class GenreController {

    private final GenreManager genreManager;
    private final com.bookstore.admin.service.BookManager bookManager;
    private final ActivityLogManager logManager;

    public GenreController(GenreManager genreManager, com.bookstore.admin.service.BookManager bookManager, ActivityLogManager logManager) {
        this.genreManager = genreManager;
        this.bookManager = bookManager;
        this.logManager = logManager;
    }

    @GetMapping
    public List<Genre> getAllGenres() {
        return genreManager.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Genre> getById(@PathVariable String id) {
        Genre g = genreManager.getById(id);
        return g != null ? ResponseEntity.ok(g) : ResponseEntity.notFound().build();
    }

    /** GET /api/admin/genres/{id}/related — BFS traversal, genres within 2 hops */
    @GetMapping("/{id}/related")
    public ResponseEntity<List<Genre>> getRelated(@PathVariable String id) {
        return ResponseEntity.ok(genreManager.getRelatedGenres(id));
    }

    /** GET /api/admin/genres/most-connected — returns genre with highest degree */
    @GetMapping("/most-connected")
    public ResponseEntity<Genre> getMostConnected() {
        Genre g = genreManager.getMostConnectedGenre();
        return g != null ? ResponseEntity.ok(g) : ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<Genre> addGenre(@RequestBody Genre genre) throws IOException {
        genre.setId(UUID.randomUUID().toString());
        Genre saved = genreManager.add(genre);
        logManager.log("admin_uid", "GENRE_ADDED", saved.getId(), "Genre", "Added genre: " + saved.getName());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Genre> updateGenre(@PathVariable String id, @RequestBody Genre genre) throws IOException {
        Genre updated = genreManager.update(id, genre);
        if (updated != null) {
            logManager.log("admin_uid", "GENRE_UPDATED", id, "Genre", "Updated genre: " + updated.getName());
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGenre(@PathVariable String id) throws IOException {
        Genre deleted = genreManager.delete(id);
        if (deleted != null) {
            logManager.log("admin_uid", "GENRE_DELETED", id, "Genre", "Deleted genre: " + deleted.getName());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    /** GET /api/admin/genres/{id}/books — get all books in this genre */
    @GetMapping("/{id}/books")
    public ResponseEntity<List<com.bookstore.admin.model.Book>> getBooksByGenre(@PathVariable String id) {
        Genre g = genreManager.getById(id);
        if (g == null) return ResponseEntity.notFound().build();
        List<com.bookstore.admin.model.Book> books = new java.util.ArrayList<>();
        if (g.getBookIds() != null) {
            for (String bookId : g.getBookIds()) {
                com.bookstore.admin.model.Book b = bookManager.getById(bookId);
                if (b != null) books.add(b);
            }
        }
        return ResponseEntity.ok(books);
    }
}
