package com.bookstore.admin.service;

import com.bookstore.admin.model.Publisher;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

/**
 * PublisherManager — Service class for Publisher CRUD operations.
 * DSA Implementation:
 * - HashMap<String, Publisher> for O(1) lookup by ID.
 * - Insertion Sort by publisher name — O(n²) but practical for small-medium lists,
 *   demonstrating a different sort algorithm from QuickSort (Orders) and MergeSort (Authors).
 * - Stack<Publisher> for undo-last-delete.
 */
@Service
public class PublisherManager {

    private final JsonStorageUtil storage;

    /** Primary store: HashMap for O(1) get/put/delete by ID */
    private HashMap<String, Publisher> publisherMap = new HashMap<>();

    /** Undo stack — Stack<Publisher> for last deleted publisher restore */
    private Stack<Publisher> deleteStack = new Stack<>();

    public PublisherManager(JsonStorageUtil storage) {
        this.storage = storage;
    }

    @PostConstruct
    public void init() throws IOException {
        List<Publisher> publishers = storage.readPublishers();
        for (Publisher p : publishers) {
            publisherMap.put(p.getId(), p);
        }
    }

    // ─── CRUD Operations ────────────────────────────────────────────────

    /** Returns all publishers sorted by name using Insertion Sort — O(n²) */
    public List<Publisher> getAll() {
        return insertionSortByName(new ArrayList<>(publisherMap.values()));
    }

    /** O(1) lookup by ID via HashMap */
    public Publisher getById(String id) {
        return publisherMap.get(id);
    }

    /** Add a new publisher — O(1) HashMap insertion */
    public Publisher add(Publisher publisher) throws IOException {
        publisherMap.put(publisher.getId(), publisher);
        save();
        return publisher;
    }

    /** Update existing publisher — O(1) HashMap replacement */
    public Publisher update(String id, Publisher updated) throws IOException {
        if (!publisherMap.containsKey(id)) return null;
        updated.setId(id);
        publisherMap.put(id, updated);
        save();
        return updated;
    }

    /** Delete publisher and push to undo Stack — O(1) */
    public Publisher delete(String id) throws IOException {
        Publisher removed = publisherMap.remove(id);
        if (removed != null) {
            deleteStack.push(removed);
            save();
        }
        return removed;
    }

    /** Restore last deleted publisher from Stack — O(1) */
    public Publisher undoDelete() throws IOException {
        if (deleteStack.isEmpty()) return null;
        Publisher publisher = deleteStack.pop();
        publisherMap.put(publisher.getId(), publisher);
        save();
        return publisher;
    }

    /** Search publishers by name substring — O(n) linear scan */
    public List<Publisher> searchByName(String query) {
        String lower = query.toLowerCase();
        List<Publisher> results = new ArrayList<>();
        for (Publisher p : publisherMap.values()) {
            if (p.getName() != null && p.getName().toLowerCase().contains(lower)) {
                results.add(p);
            }
        }
        return insertionSortByName(results);
    }

    // ─── Insertion Sort by Name — O(n²) ────────────────────────────────
    /**
     * Insertion Sort: efficient for nearly-sorted data and small lists.
     * Used here to contrast with QuickSort (Orders) and MergeSort (Authors).
     */
    private List<Publisher> insertionSortByName(List<Publisher> list) {
        for (int i = 1; i < list.size(); i++) {
            Publisher key = list.get(i);
            int j = i - 1;
            while (j >= 0 && list.get(j).getName().compareToIgnoreCase(key.getName()) > 0) {
                list.set(j + 1, list.get(j));
                j--;
            }
            list.set(j + 1, key);
        }
        return list;
    }

    private void save() throws IOException {
        storage.writePublishers(new ArrayList<>(publisherMap.values()));
    }
}
