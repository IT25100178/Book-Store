package com.bookstore.admin.controller;

import com.bookstore.admin.model.Author;
import com.bookstore.admin.model.Book;
import com.bookstore.admin.service.AuthorManager;
import com.bookstore.admin.service.ActivityLogManager;
import com.bookstore.admin.service.BookManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/authors")
@CrossOrigin(origins = "*")
public class AuthorController {

    private final AuthorManager authorManager;
    private final BookManager bookManager;
    private final ActivityLogManager logManager;

    public AuthorController(AuthorManager authorManager, BookManager bookManager, ActivityLogManager logManager) {
        this.authorManager = authorManager;
        this.bookManager = bookManager;
        this.logManager = logManager;
    }

    /** GET /api/admin/authors — returns all authors MergeSorted by name */
    @GetMapping
    public List<Author> getAllAuthors() {
        return authorManager.getAll();
    }

    /** GET /api/admin/authors/search?prefix= — Trie prefix search */
    @GetMapping("/search")
    public List<Author> searchByPrefix(@RequestParam String prefix) {
        return authorManager.searchByPrefix(prefix);
    }

    /** GET /api/admin/authors/{id} — get single author */
    @GetMapping("/{id}")
    public ResponseEntity<Author> getById(@PathVariable String id) {
        Author a = authorManager.getById(id);
        return a != null ? ResponseEntity.ok(a) : ResponseEntity.notFound().build();
    }

    /** GET /api/admin/authors/{id}/books — get all books by this author */
    @GetMapping("/{id}/books")
    public ResponseEntity<List<Book>> getBooksByAuthor(@PathVariable String id) {
        Author a = authorManager.getById(id);
        if (a == null) return ResponseEntity.notFound().build();
        List<Book> books = new java.util.ArrayList<>();
        if (a.getBookIds() != null) {
            for (String bookId : a.getBookIds()) {
                Book b = bookManager.getById(bookId);
                if (b != null) books.add(b);
            }
        }
        return ResponseEntity.ok(books);
    }

    /** POST /api/admin/authors — add a new author */
    @PostMapping
    public ResponseEntity<Author> addAuthor(@RequestBody Author author) throws IOException {
        author.setId(UUID.randomUUID().toString());
        Author saved = authorManager.add(author);
        logManager.log("admin_uid", "AUTHOR_ADDED", saved.getId(), "Author", "Added author: " + saved.getName());
        return ResponseEntity.ok(saved);
    }

    /** PUT /api/admin/authors/{id} — update an author */
    @PutMapping("/{id}")
    public ResponseEntity<Author> updateAuthor(@PathVariable String id, @RequestBody Author author) throws IOException {
        Author updated = authorManager.update(id, author);
        if (updated != null) {
            logManager.log("admin_uid", "AUTHOR_UPDATED", id, "Author", "Updated author: " + updated.getName());
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    /** DELETE /api/admin/authors/{id} — delete and push to undo stack */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuthor(@PathVariable String id) throws IOException {
        Author deleted = authorManager.delete(id);
        if (deleted != null) {
            logManager.log("admin_uid", "AUTHOR_DELETED", id, "Author", "Deleted author: " + deleted.getName());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    /** POST /api/admin/authors/undo-delete — pop from undo stack */
    @PostMapping("/undo-delete")
    public ResponseEntity<Author> undoDelete() throws IOException {
        Author restored = authorManager.undoDelete();
        if (restored != null) {
            logManager.log("admin_uid", "AUTHOR_RESTORED", restored.getId(), "Author", "Restored author: " + restored.getName());
            return ResponseEntity.ok(restored);
        }
        return ResponseEntity.notFound().build();
    }
}
