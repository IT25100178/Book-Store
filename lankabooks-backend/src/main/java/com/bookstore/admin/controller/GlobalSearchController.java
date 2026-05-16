package com.bookstore.admin.controller;

import com.bookstore.admin.model.*;
import com.bookstore.admin.service.*;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/search")
@CrossOrigin(origins = "*")
public class GlobalSearchController {

    private final BookManager bookManager;
    private final UserManager userManager;
    private final OrderManager orderManager;
    private final AuthorManager authorManager;
    private final GenreManager genreManager;

    public GlobalSearchController(BookManager bookManager, UserManager userManager, OrderManager orderManager, AuthorManager authorManager, GenreManager genreManager) {
        this.bookManager = bookManager;
        this.userManager = userManager;
        this.orderManager = orderManager;
        this.authorManager = authorManager;
        this.genreManager = genreManager;
    }

    @GetMapping
    public Map<String, List<?>> search(@RequestParam String q) {
        String query = q.toLowerCase();
        Map<String, List<?>> results = new HashMap<>();

        // Authors (using Trie)
        results.put("authors", authorManager.searchByPrefix(query));

        // Books (basic linear filtering for now, will integrate with new Multi-Index if needed, or by title)
        results.put("books", bookManager.getAll().stream()
                .filter(b -> b.getTitle().toLowerCase().contains(query) || b.getAuthor().toLowerCase().contains(query) || b.getIsbn().toLowerCase().contains(query))
                .collect(Collectors.toList()));

        // Users
        results.put("users", userManager.getAll().stream()
                .filter(u -> u.getName().toLowerCase().contains(query) || u.getEmail().toLowerCase().contains(query))
                .collect(Collectors.toList()));

        // Orders
        results.put("orders", orderManager.getAll().stream()
                .filter(o -> o.getId().toLowerCase().contains(query))
                .collect(Collectors.toList()));

        // Genres
        results.put("genres", genreManager.getAll().stream()
                .filter(g -> g.getName().toLowerCase().contains(query))
                .collect(Collectors.toList()));

        return results;
    }
}
