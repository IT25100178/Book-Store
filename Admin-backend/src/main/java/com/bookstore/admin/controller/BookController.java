package com.bookstore.admin.controller;

import com.bookstore.admin.model.Book;
import com.bookstore.admin.service.BookManager;
import com.bookstore.admin.service.ActivityLogManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/books")
@CrossOrigin(origins = "*")
public class BookController {
    
    private final BookManager bookManager;
    private final ActivityLogManager logManager;

    public BookController(BookManager bookManager, ActivityLogManager logManager) {
        this.bookManager = bookManager;
        this.logManager = logManager;
    }

    @GetMapping
    public ResponseEntity<List<Book>> getBooks(
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {
        if (minPrice != null && maxPrice != null) {
            return ResponseEntity.ok(bookManager.getBooksByPriceRange(minPrice, maxPrice));
        }
        if (sort != null) {
            return ResponseEntity.ok(bookManager.getSorted(sort));
        }
        return ResponseEntity.ok(bookManager.getAll());
    }

    @PostMapping
    public ResponseEntity<Book> addBook(@RequestBody Book book) throws IOException {
        book.setId(UUID.randomUUID().toString());
        Book savedBook = bookManager.add(book);
        logManager.log("admin_uid", "BOOK_ADDED", savedBook.getId(), "Book", "Added book: " + savedBook.getTitle());
        return ResponseEntity.ok(savedBook);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable String id, @RequestBody Book book) throws IOException {
        Book updatedBook = bookManager.update(id, book);
        if (updatedBook != null) {
            logManager.log("admin_uid", "BOOK_UPDATED", id, "Book", "Updated book: " + updatedBook.getTitle());
            return ResponseEntity.ok(updatedBook);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable String id) throws IOException {
        Book deleted = bookManager.delete(id);
        if (deleted != null) {
            logManager.log("admin_uid", "BOOK_DELETED", id, "Book", "Deleted book: " + deleted.getTitle());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/bulk-delete")
    public ResponseEntity<Integer> bulkDelete(@RequestBody List<String> ids) throws IOException {
        int count = bookManager.bulkDelete(ids);
        if (count > 0) {
            logManager.log("admin_uid", "BOOK_DELETED", "bulk", "Book", "Bulk deleted " + count + " books");
            return ResponseEntity.ok(count);
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/undo-delete")
    public ResponseEntity<Book> undoDelete() {
        try {
            Book restored = bookManager.undoDelete();
            if (restored != null) {
                return ResponseEntity.ok(restored);
            }
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Book> searchByTitle(@RequestParam String title) {
        Book result = bookManager.searchByTitle(title);
        if (result != null) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.notFound().build();
    }
}
