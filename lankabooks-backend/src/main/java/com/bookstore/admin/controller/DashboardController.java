package com.bookstore.admin.controller;

import com.bookstore.admin.model.Book;
import com.bookstore.admin.model.Genre;
import com.bookstore.admin.model.Order;
import com.bookstore.admin.service.BookManager;
import com.bookstore.admin.service.GenreManager;
import com.bookstore.admin.service.OrderManager;
import com.bookstore.admin.service.UserManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final BookManager bookManager;
    private final UserManager userManager;
    private final OrderManager orderManager;
    private final GenreManager genreManager;

    public DashboardController(BookManager bookManager, UserManager userManager, OrderManager orderManager, GenreManager genreManager) {
        this.bookManager = bookManager;
        this.userManager = userManager;
        this.orderManager = orderManager;
        this.genreManager = genreManager;
    }

    @GetMapping("/dashboardStats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        List<Order> allOrders = orderManager.getAll();
        double totalRevenue = allOrders.stream()
                .filter(o -> !"CANCELLED".equalsIgnoreCase(o.getStatus()))
                .mapToDouble(Order::getTotalPrice)
                .sum();
                
        List<Order> pendingFirst = orderManager.getPendingFirstOrders();
        List<Order> top5Pending = pendingFirst.stream()
                .filter(o -> "PENDING".equalsIgnoreCase(o.getStatus()))
                .limit(5)
                .toList();

        // ─── UPGRADE: Revenue Trend (TreeMap for auto-sorting by Month) ────────────
        // Groups completed orders by month (e.g. "2026-03")
        // O(N log N) insertion overall due to TreeMap property
        TreeMap<String, Double> revenueTrend = new TreeMap<>();
        for (Order o : allOrders) {
            if ("DELIVERED".equalsIgnoreCase(o.getStatus()) || "SHIPPED".equalsIgnoreCase(o.getStatus())) {
                try {
                    String month = o.getOrderDate().substring(0, 7); // YYYY-MM
                    revenueTrend.put(month, revenueTrend.getOrDefault(month, 0.0) + o.getTotalPrice());
                } catch (Exception e) { /* ignore parse errors */ }
            }
        }
        
        // Output last 6 keys (or all available if < 6)
        List<Map<String, Object>> trendList = new ArrayList<>();
        int count = 0;
        for (Map.Entry<String, Double> entry : revenueTrend.descendingMap().entrySet()) {
            if (count++ >= 6) break;
            Map<String, Object> map = new HashMap<>();
            map.put("month", entry.getKey());
            map.put("revenue", entry.getValue());
            trendList.add(map);
        }
        Collections.reverse(trendList); // Return chronological order

        // ─── UPGRADE: Top 5 Best-Selling Books (PriorityQueue Max-Heap) ────────────
        HashMap<String, Integer> bookSales = new HashMap<>();
        for (Order o : allOrders) {
            if ("DELIVERED".equalsIgnoreCase(o.getStatus()) || "SHIPPED".equalsIgnoreCase(o.getStatus())) {
                if (o.getBookIds() != null) {
                    for (String bId : o.getBookIds()) {
                        bookSales.put(bId, bookSales.getOrDefault(bId, 0) + 1);
                    }
                }
            }
        }
        // Max-heap: O(K log N) where K is number of unique books sold
        PriorityQueue<Map.Entry<String, Integer>> maxHeap = new PriorityQueue<>(
                (a, b) -> b.getValue().compareTo(a.getValue())
        );
        maxHeap.addAll(bookSales.entrySet());

        List<Map<String, Object>> bestSellers = new ArrayList<>();
        for (int i = 0; i < 5 && !maxHeap.isEmpty(); i++) {
            Map.Entry<String, Integer> entry = maxHeap.poll();
            Book b = bookManager.getById(entry.getKey());
            if (b != null) {
                Map<String, Object> bMap = new HashMap<>();
                bMap.put("id", b.getId());
                bMap.put("title", b.getTitle());
                bMap.put("coverImageUrl", b.getCoverImageUrl());
                bMap.put("sales", entry.getValue());
                bestSellers.add(bMap);
            }
        }

        // ─── UPGRADE: Low Stock Alert (Binary Search threshold analysis logic) ────────────
        List<Book> allBooks = bookManager.getAll();
        allBooks.sort(Comparator.comparingInt(Book::getStockQuantity));
        
        // Find threshold index using binary search (first book >= 5 stock)
        int low = 0, high = allBooks.size() - 1, thresholdIdx = allBooks.size();
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (allBooks.get(mid).getStockQuantity() >= 5) {
                thresholdIdx = mid;
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        List<Book> lowStockBooks = allBooks.subList(0, thresholdIdx);

        // ─── UPGRADE: Genre Distribution (HashMap counting) ────────────
        Map<String, Integer> genreCount = new HashMap<>();
        for (Genre g : genreManager.getAll()) {
            genreCount.put(g.getName(), g.getBookIds() != null ? g.getBookIds().size() : 0);
        }
        List<Map<String, Object>> genreList = new ArrayList<>();
        for(Map.Entry<String, Integer> entry : genreCount.entrySet()) {
            if(entry.getValue() > 0) {
                Map<String, Object> map = new HashMap<>();
                map.put("name", entry.getKey());
                map.put("count", entry.getValue());
                
                // Fetch color tag
                Genre g = genreManager.getAll().stream().filter(ge -> ge.getName().equals(entry.getKey())).findFirst().orElse(null);
                map.put("color", g != null ? g.getColorTag() : "#3B82F6");
                
                genreList.add(map);
            }
        }


        stats.put("totalBooks", allBooks.size());
        stats.put("totalUsers", userManager.getAll().size());
        stats.put("totalOrders", allOrders.size());
        stats.put("totalRevenue", totalRevenue);
        stats.put("topPendingOrders", top5Pending);
        stats.put("revenueTrend", trendList);
        stats.put("bestSellers", bestSellers);
        stats.put("lowStockBooks", lowStockBooks);
        stats.put("genreDistribution", genreList);

        return ResponseEntity.ok(stats);
    }
}
