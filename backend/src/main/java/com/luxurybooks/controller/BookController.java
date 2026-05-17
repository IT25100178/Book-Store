package com.luxurybooks.controller;

import com.luxurybooks.dsa.CustomHashMap;
import com.luxurybooks.dsa.CustomQueue;
import com.luxurybooks.dsa.MergeSort;
import com.luxurybooks.model.Author;
import com.luxurybooks.model.BookStoreItem;
import com.luxurybooks.model.Review;
import com.luxurybooks.service.JsonStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class BookController {

    @Autowired
    private JsonStorageService storageService;

    // In-memory Waitlist Queues utilizing CustomQueue per bookId
    private final CustomHashMap<Integer, CustomQueue<String>> waitlists = new CustomHashMap<>();

    // GET all books
    @GetMapping("/books")
    public List<BookStoreItem> getAllBooks() {
        return storageService.getAllBooks();
    }

    // GET book details (O(1) lookup via custom HashMap)
    @GetMapping("/books/{id}")
    public ResponseEntity<BookStoreItem> getBook(@PathVariable int id) {
        BookStoreItem book = storageService.getBook(id);
        if (book != null) {
            return ResponseEntity.ok(book);
        }
        return ResponseEntity.notFound().build();
    }

    // GET sorted reviews using custom MergeSort
    @GetMapping("/books/{id}/reviews")
    public ResponseEntity<List<Review>> getSortedReviews(
            @PathVariable int id,
            @RequestParam(defaultValue = "date") String sortBy) {
        
        BookStoreItem book = storageService.getBook(id);
        if (book == null) {
            return ResponseEntity.notFound().build();
        }

        List<Review> reviews = book.getReviews();
        Comparator<Review> comparator;

        switch (sortBy) {
            case "rating_high":
                comparator = (a, b) -> Integer.compare(b.getRating(), a.getRating());
                break;
            case "rating_low":
                comparator = (a, b) -> Integer.compare(a.getRating(), b.getRating());
                break;
            case "helpful":
                comparator = (a, b) -> Integer.compare(b.getHelpfulVotes(), a.getHelpfulVotes());
                break;
            case "date":
            default:
                comparator = (a, b) -> b.getDate().compareTo(a.getDate());
                break;
        }

        List<Review> sorted = MergeSort.sort(reviews, comparator);
        return ResponseEntity.ok(sorted);
    }

    // POST a new review, automatically saved to JSON database file
    @PostMapping("/books/{id}/reviews")
    public ResponseEntity<Review> addReview(
            @PathVariable int id,
            @RequestBody Review newReview) {
        
        BookStoreItem book = storageService.getBook(id);
        if (book == null) {
            return ResponseEntity.notFound().build();
        }

        newReview.setId("r-" + System.currentTimeMillis());
        newReview.setDate(LocalDate.now().toString());
        newReview.setHelpfulVotes(0);

        book.getReviews().add(newReview);
        
        // Recalculate average rating of the book
        double totalRating = 0;
        for (Review r : book.getReviews()) {
            totalRating += r.getRating();
        }
        double avg = totalRating / book.getReviews().size();
        book.setRating(Math.round(avg * 10.0) / 10.0);

        storageService.saveBooks(); // persist to JSON file!

        return ResponseEntity.ok(newReview);
    }

    // GET author details (O(1) lookup via custom HashMap) and all books written by author
    @GetMapping("/authors/{authorId}")
    public ResponseEntity<Map<String, Object>> getAuthorDetails(@PathVariable String authorId) {
        Author author = storageService.getAuthor(authorId);
        if (author == null) {
            return ResponseEntity.notFound().build();
        }

        // Get books written by this author, sorted by rating via custom MergeSort
        List<BookStoreItem> allBooks = storageService.getAllBooks();
        List<BookStoreItem> authorBooks = new ArrayList<>();
        for (BookStoreItem b : allBooks) {
            if (authorId.equals(b.getAuthorId())) {
                authorBooks.add(b);
            }
        }

        List<BookStoreItem> sortedBooks = MergeSort.sort(authorBooks, 
            (a, b) -> Double.compare(b.getRating(), a.getRating())
        );

        Map<String, Object> response = new HashMap<>();
        response.put("author", author);
        response.put("books", sortedBooks);

        return ResponseEntity.ok(response);
    }

    // POST join FIFO waitlist queue using CustomQueue
    @PostMapping("/books/{id}/waitlist")
    public ResponseEntity<Map<String, Object>> joinWaitlist(
            @PathVariable int id,
            @RequestParam String userId) {
        
        BookStoreItem book = storageService.getBook(id);
        if (book == null) {
            return ResponseEntity.notFound().build();
        }

        if (!waitlists.containsKey(id)) {
            waitlists.put(id, new CustomQueue<>());
        }

        CustomQueue<String> queue = waitlists.get(id);
        queue.enqueue(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("position", queue.size());
        response.put("message", "Successfully joined the waitlist for '" + book.getTitle() + "'");
        response.put("bookTitle", book.getTitle());

        return ResponseEntity.ok(response);
    }
}
