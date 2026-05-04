package com.bookstore.admin.service;

import com.bookstore.admin.model.Book;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

/**
 * BookManager - Service class for Book operations.
 * DSA Implementation:
 * - HashMap for O(1) lookups.
 * - ArrayList for sorted data management.
 * - Binary Search for searching by title.
 * - Stack<List<Book>> for undo-last-delete (supports both single and bulk undo in one frame).
 * - Multi-Index HashMap for O(1) multi-field lookup (Title, Author, ISBN).
 * - Binary Search Tree (BST) for price range filtering.
 */
@Service
public class BookManager {
    private final JsonStorageUtil storage;
    private final ActivityLogManager activityLog;
    private HashMap<String, Book> bookMap = new HashMap<>();
    private Stack<List<Book>> deleteStack = new Stack<>();

    // ─── Hash Index for Multi-field Search ──────────────────────────────
    private HashMap<String, List<Book>> indexByTitle = new HashMap<>();
    private HashMap<String, List<Book>> indexByAuthor = new HashMap<>();
    private HashMap<String, List<Book>> indexByIsbn = new HashMap<>();

    // ─── BST for Price Range Filter ─────────────────────────────────────
    private class BSTNode {
        Book book;
        BSTNode left, right;
        BSTNode(Book book) { this.book = book; }
    }
    private BSTNode priceRoot = null;

    public BookManager(JsonStorageUtil storage, ActivityLogManager activityLog) {
        this.storage = storage;
        this.activityLog = activityLog;
    }

    @PostConstruct
    public void init() throws IOException {
        List<Book> books = storage.readBooks();
        for (Book book : books) {
            internalAdd(book);
        }
    }

    // ─── Index & BST Maintenance ────────────────────────────────────────
    private void addToIndices(Book book) {
        indexByTitle.computeIfAbsent(book.getTitle().toLowerCase(), k -> new ArrayList<>()).add(book);
        indexByAuthor.computeIfAbsent(book.getAuthor().toLowerCase(), k -> new ArrayList<>()).add(book);
        indexByIsbn.computeIfAbsent(book.getIsbn().toLowerCase(), k -> new ArrayList<>()).add(book);
    }

    private void removeFromIndices(Book book) {
        List<Book> byTitle = indexByTitle.get(book.getTitle().toLowerCase());
        if (byTitle != null) { byTitle.remove(book); if(byTitle.isEmpty()) indexByTitle.remove(book.getTitle().toLowerCase()); }

        List<Book> byAuthor = indexByAuthor.get(book.getAuthor().toLowerCase());
        if (byAuthor != null) { byAuthor.remove(book); if(byAuthor.isEmpty()) indexByAuthor.remove(book.getAuthor().toLowerCase()); }

        List<Book> byIsbn = indexByIsbn.get(book.getIsbn().toLowerCase());
        if (byIsbn != null) { byIsbn.remove(book); if(byIsbn.isEmpty()) indexByIsbn.remove(book.getIsbn().toLowerCase()); }
    }

    private BSTNode insertBST(BSTNode node, Book book) {
        if (node == null) return new BSTNode(book);
        if (book.getPrice() < node.book.getPrice()) {
            node.left = insertBST(node.left, book);
        } else {
            // allowing duplicates on right
            node.right = insertBST(node.right, book);
        }
        return node;
    }

    private BSTNode deleteBST(BSTNode root, Book book) {
        if (root == null) return null;
        if (book.getPrice() < root.book.getPrice()) {
            root.left = deleteBST(root.left, book);
        } else if (book.getPrice() > root.book.getPrice() || !root.book.getId().equals(book.getId())) {
            // Need to handle duplicates carefully: traverse right if price matches but ID doesn't
            root.right = deleteBST(root.right, book);
        } else {
            // Node found
            if (root.left == null) return root.right;
            if (root.right == null) return root.left;

            // Node with two children: Get inorder successor
            BSTNode minNode = minValueNode(root.right);
            root.book = minNode.book;
            root.right = deleteBST(root.right, minNode.book);
        }
        return root;
    }

    private BSTNode minValueNode(BSTNode node) {
        BSTNode current = node;
        while (current.left != null) current = current.left;
        return current;
    }

    private void inOrderRangeList(BSTNode node, double min, double max, List<Book> result) {
        if (node == null) return;
        if (node.book.getPrice() > min) {
            inOrderRangeList(node.left, min, max, result);
        }
        if (node.book.getPrice() >= min && node.book.getPrice() <= max) {
            result.add(node.book);
        }
        if (node.book.getPrice() < max) {
            inOrderRangeList(node.right, min, max, result);
        }
    }

    // ─── CRUD ───────────────────────────────────────────────────────────
    private void internalAdd(Book book) {
        bookMap.put(book.getId(), book);
        addToIndices(book);
        priceRoot = insertBST(priceRoot, book);
    }

    private void internalRemove(Book book) {
        bookMap.remove(book.getId());
        removeFromIndices(book);
        priceRoot = deleteBST(priceRoot, book);
    }

    public List<Book> getAll() {
        return new ArrayList<>(bookMap.values());
    }

    public Book getById(String id) {
        return bookMap.get(id);
    }

    public Book add(Book book) throws IOException {
        internalAdd(book);
        save();
        activityLog.log("ADMIN_01", "BOOK_ADDED", book.getId(), "BOOK", "Added new book: " + book.getTitle());
        return book;
    }

    public Book update(String id, Book book) throws IOException {
        Book oldBook = bookMap.get(id);
        if (oldBook != null) {
            internalRemove(oldBook);
            book.setId(id);
            internalAdd(book);
            save();
            activityLog.log("ADMIN_01", "BOOK_UPDATED", id, "BOOK", "Updated book: " + book.getTitle());
            return book;
        }
        return null;
    }

    public Book delete(String id) throws IOException {
        Book removed = bookMap.get(id);
        if (removed != null) {
            internalRemove(removed);
            deleteStack.push(Collections.singletonList(removed));
            save();
            activityLog.log("ADMIN_01", "BOOK_DELETED", id, "BOOK", "Deleted book: " + removed.getTitle());
        }
        return removed;
    }

    public int bulkDelete(List<String> ids) throws IOException {
        List<Book> batch = new ArrayList<>();
        for (String id : ids) {
            Book b = bookMap.get(id);
            if (b != null) {
                internalRemove(b);
                batch.add(b);
            }
        }
        if (!batch.isEmpty()) {
            deleteStack.push(batch);
            save();
            activityLog.log("ADMIN_01", "BOOK_DELETED", "BULK", "BOOK", "Bulk deleted " + batch.size() + " books");
        }
        return batch.size();
    }

    public Book undoDelete() throws IOException {
        if (!deleteStack.isEmpty()) {
            List<Book> batch = deleteStack.pop();
            for(Book b : batch) {
                internalAdd(b);
            }
            save();
            activityLog.log("ADMIN_01", "BOOK_RESTORED", batch.get(0).getId(), "BOOK", "Restored " + batch.size() + " book(s)");
            return batch.get(0); // API historically returned one book, best effort. Bulk operations can handle differently in UI.
        }
        return null;
    }

    /**
     * Binary Search by Title
     */
    public Book searchByTitle(String title) {
        List<Book> sortedBooks = new ArrayList<>(bookMap.values());
        sortedBooks.sort(Comparator.comparing(Book::getTitle, String.CASE_INSENSITIVE_ORDER));
        
        int low = 0;
        int high = sortedBooks.size() - 1;
        
        while (low <= high) {
            int mid = low + (high - low) / 2;
            int cmp = sortedBooks.get(mid).getTitle().compareToIgnoreCase(title);
            
            if (cmp == 0) return sortedBooks.get(mid);
            if (cmp < 0) low = mid + 1;
            else high = mid - 1;
        }
        return null;
    }

    /**
     * Multi-field Search via Hash Index - O(1) multi-field lookup
     */
    public List<Book> multiSearch(String query) {
        Set<Book> results = new HashSet<>();
        String q = query.toLowerCase();
        if (indexByTitle.containsKey(q)) results.addAll(indexByTitle.get(q));
        if (indexByAuthor.containsKey(q)) results.addAll(indexByAuthor.get(q));
        if (indexByIsbn.containsKey(q)) results.addAll(indexByIsbn.get(q));
        return new ArrayList<>(results);
    }

    /**
     * BST Price Range Filter
     */
    public List<Book> getBooksByPriceRange(double min, double max) {
        List<Book> result = new ArrayList<>();
        inOrderRangeList(priceRoot, min, max, result);
        return result;
    }

    public List<Book> getSorted(String sortBy) {
        List<Book> books = new ArrayList<>(bookMap.values());
        if (books.isEmpty()) return books;
        
        quickSort(books, 0, books.size() - 1, sortBy);
        return books;
    }

    private void quickSort(List<Book> list, int low, int high, String key) {
        if (low < high) {
            int pi = partition(list, low, high, key);
            quickSort(list, low, pi - 1, key);
            quickSort(list, pi + 1, high, key);
        }
    }

    private int partition(List<Book> list, int low, int high, String key) {
        Book pivot = list.get(high);
        int i = (low - 1);
        for (int j = low; j < high; j++) {
            boolean condition = false;
            if ("price".equals(key)) {
                condition = list.get(j).getPrice() <= pivot.getPrice();
            } else {
                condition = list.get(j).getTitle().compareToIgnoreCase(pivot.getTitle()) <= 0;
            }
            if (condition) {
                i++;
                Collections.swap(list, i, j);
            }
        }
        Collections.swap(list, i + 1, high);
        return i + 1;
    }

    private void save() throws IOException {
        storage.writeBooks(new ArrayList<>(bookMap.values()));
    }
}
