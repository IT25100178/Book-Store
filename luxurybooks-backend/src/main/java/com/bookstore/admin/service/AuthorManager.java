package com.bookstore.admin.service;

import com.bookstore.admin.model.Author;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

/**
 * AuthorManager - Service class for Author operations.
 * DSA Implementation:
 * - HashMap<String, Author> for O(1) storage & lookup.
 * - Manual MergeSort on author name — O(n log n), different algo from QuickSort used in OrderManager.
 * - Trie (prefix tree) for fast prefix-based author name search — O(m) where m = prefix length.
 * - Stack<Author> for undo-last-delete.
 */
@Service
public class AuthorManager {

    private final JsonStorageUtil storage;
    private final ActivityLogManager activityLog;
    private HashMap<String, Author> authorMap = new HashMap<>();
    private Stack<Author> deleteStack = new Stack<>();

    // ─── Inner Trie Implementation ──────────────────────────────────────
    private static class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        List<String> authorIds = new ArrayList<>(); // author IDs ending at/passing through this node
    }

    private TrieNode trieRoot = new TrieNode();

    public AuthorManager(JsonStorageUtil storage, ActivityLogManager activityLog) {
        this.storage = storage;
        this.activityLog = activityLog;
    }

    @PostConstruct
    public void init() throws IOException {
        List<Author> authors = storage.readAuthors();
        for (Author a : authors) {
            authorMap.put(a.getId(), a);
            insertTrie(a.getName().toLowerCase(), a.getId());
        }
    }

    // ─── Trie Operations ────────────────────────────────────────────────
    /** Insert author name into Trie — O(m) where m = name length */
    private void insertTrie(String name, String authorId) {
        TrieNode node = trieRoot;
        for (char c : name.toCharArray()) {
            node.children.putIfAbsent(c, new TrieNode());
            node = node.children.get(c);
            node.authorIds.add(authorId); // every node along path stores author
        }
    }

    /** Remove author from Trie — O(m) */
    private void removeTrie(String name, String authorId) {
        TrieNode node = trieRoot;
        for (char c : name.toCharArray()) {
            if (!node.children.containsKey(c)) return;
            node = node.children.get(c);
            node.authorIds.remove(authorId);
        }
    }

    /** Prefix search using Trie — O(m) for traversal, then ID lookups */
    public List<Author> searchByPrefix(String prefix) {
        TrieNode node = trieRoot;
        for (char c : prefix.toLowerCase().toCharArray()) {
            if (!node.children.containsKey(c)) return new ArrayList<>();
            node = node.children.get(c);
        }
        // Collect unique authors from IDs at this node
        Set<String> ids = new LinkedHashSet<>(node.authorIds);
        List<Author> result = new ArrayList<>();
        for (String id : ids) {
            Author a = authorMap.get(id);
            if (a != null) result.add(a);
        }
        return result;
    }

    // ─── CRUD Operations ────────────────────────────────────────────────
    public List<Author> getAll() {
        return mergeSortByName(new ArrayList<>(authorMap.values()));
    }

    public Author getById(String id) {
        return authorMap.get(id);
    }

    public Author add(Author author) throws IOException {
        authorMap.put(author.getId(), author);
        insertTrie(author.getName().toLowerCase(), author.getId());
        save();
        activityLog.log("ADMIN_01", "AUTHOR_ADDED", author.getId(), "AUTHOR", "Added new author: " + author.getName());
        return author;
    }

    public Author update(String id, Author updatedAuthor) throws IOException {
        Author existing = authorMap.get(id);
        if (existing == null) return null;
        // Remove old trie entry, insert new name
        removeTrie(existing.getName().toLowerCase(), id);
        updatedAuthor.setId(id);
        authorMap.put(id, updatedAuthor);
        insertTrie(updatedAuthor.getName().toLowerCase(), id);
        save();
        activityLog.log("ADMIN_01", "AUTHOR_UPDATED", id, "AUTHOR", "Updated author: " + updatedAuthor.getName());
        return updatedAuthor;
    }

    public Author delete(String id) throws IOException {
        Author removed = authorMap.remove(id);
        if (removed != null) {
            removeTrie(removed.getName().toLowerCase(), id);
            deleteStack.push(removed);
            save();
            activityLog.log("ADMIN_01", "AUTHOR_DELETED", id, "AUTHOR", "Deleted author: " + removed.getName());
        }
        return removed;
    }

    public Author undoDelete() throws IOException {
        if (deleteStack.isEmpty()) return null;
        Author author = deleteStack.pop();
        authorMap.put(author.getId(), author);
        insertTrie(author.getName().toLowerCase(), author.getId());
        save();
        activityLog.log("ADMIN_01", "AUTHOR_RESTORED", author.getId(), "AUTHOR", "Restored author: " + author.getName());
        return author;
    }

    // ─── MergeSort by Name — O(n log n) ─────────────────────────────────
    public List<Author> mergeSortByName(List<Author> list) {
        if (list.size() <= 1) return list;
        int mid = list.size() / 2;
        List<Author> left = mergeSortByName(new ArrayList<>(list.subList(0, mid)));
        List<Author> right = mergeSortByName(new ArrayList<>(list.subList(mid, list.size())));
        return merge(left, right);
    }

    private List<Author> merge(List<Author> left, List<Author> right) {
        List<Author> result = new ArrayList<>();
        int i = 0, j = 0;
        while (i < left.size() && j < right.size()) {
            if (left.get(i).getName().compareToIgnoreCase(right.get(j).getName()) <= 0) {
                result.add(left.get(i++));
            } else {
                result.add(right.get(j++));
            }
        }
        while (i < left.size()) result.add(left.get(i++));
        while (j < right.size()) result.add(right.get(j++));
        return result;
    }

    private void save() throws IOException {
        storage.writeAuthors(new ArrayList<>(authorMap.values()));
    }
}
