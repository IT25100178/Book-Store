package com.bookstore.admin.controller;

import com.bookstore.admin.model.Publisher;
import com.bookstore.admin.service.ActivityLogManager;
import com.bookstore.admin.service.PublisherManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/publishers")
@CrossOrigin(origins = "*")
public class PublisherController {

    private final PublisherManager publisherManager;
    private final com.bookstore.admin.service.BookManager bookManager;
    private final ActivityLogManager logManager;

    public PublisherController(PublisherManager publisherManager, com.bookstore.admin.service.BookManager bookManager, ActivityLogManager logManager) {
        this.publisherManager = publisherManager;
        this.bookManager = bookManager;
        this.logManager = logManager;
    }

    /** GET /api/admin/publishers — all publishers, Insertion-Sorted by name */
    @GetMapping
    public List<Publisher> getAllPublishers() {
        return publisherManager.getAll();
    }

    /** GET /api/admin/publishers/search?query= — substring search */
    @GetMapping("/search")
    public List<Publisher> search(@RequestParam String query) {
        return publisherManager.searchByName(query);
    }

    /** GET /api/admin/publishers/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<Publisher> getById(@PathVariable String id) {
        Publisher p = publisherManager.getById(id);
        return p != null ? ResponseEntity.ok(p) : ResponseEntity.notFound().build();
    }

    /** POST /api/admin/publishers */
    @PostMapping
    public ResponseEntity<Publisher> addPublisher(@RequestBody Publisher publisher) throws IOException {
        publisher.setId(UUID.randomUUID().toString());
        Publisher saved = publisherManager.add(publisher);
        logManager.log("admin_uid", "PUBLISHER_ADDED", saved.getId(), "Publisher",
                "Added publisher: " + saved.getName());
        return ResponseEntity.ok(saved);
    }

    /** PUT /api/admin/publishers/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<Publisher> updatePublisher(@PathVariable String id,
                                                      @RequestBody Publisher publisher) throws IOException {
        Publisher updated = publisherManager.update(id, publisher);
        if (updated != null) {
            logManager.log("admin_uid", "PUBLISHER_UPDATED", id, "Publisher",
                    "Updated publisher: " + updated.getName());
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    /** DELETE /api/admin/publishers/{id} — pushes to undo stack */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePublisher(@PathVariable String id) throws IOException {
        Publisher deleted = publisherManager.delete(id);
        if (deleted != null) {
            logManager.log("admin_uid", "PUBLISHER_DELETED", id, "Publisher",
                    "Deleted publisher: " + deleted.getName());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    /** POST /api/admin/publishers/undo-delete — pops from undo stack */
    @PostMapping("/undo-delete")
    public ResponseEntity<Publisher> undoDelete() throws IOException {
        Publisher restored = publisherManager.undoDelete();
        if (restored != null) {
            logManager.log("admin_uid", "PUBLISHER_RESTORED", restored.getId(), "Publisher",
                    "Restored publisher: " + restored.getName());
            return ResponseEntity.ok(restored);
        }
        return ResponseEntity.notFound().build();
    }

    /** GET /api/admin/publishers/{id}/books — get all books by this publisher */
    @GetMapping("/{id}/books")
    public ResponseEntity<List<com.bookstore.admin.model.Book>> getBooksByPublisher(@PathVariable String id) {
        Publisher p = publisherManager.getById(id);
        if (p == null) return ResponseEntity.notFound().build();
        List<com.bookstore.admin.model.Book> books = new java.util.ArrayList<>();
        if (p.getBookIds() != null) {
            for (String bookId : p.getBookIds()) {
                com.bookstore.admin.model.Book b = bookManager.getById(bookId);
                if (b != null) books.add(b);
            }
        }
        return ResponseEntity.ok(books);
    }
}
