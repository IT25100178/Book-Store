package com.bookstore.admin.controller;

import com.bookstore.admin.model.Book;
import com.bookstore.admin.model.Order;
import com.bookstore.admin.service.BookManager;
import com.bookstore.admin.service.OrderManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * ReportsController — generates real analytics from live order and book data.
 *
 * DSA used:
 * - HashMap for category/author revenue aggregation — O(N)
 * - PriorityQueue (max-heap) for top-N best sellers — O(N log K)
 * - TreeMap for chronological revenue trend (auto-sorted by month key) — O(N log N)
 */
@RestController
@RequestMapping("/api/admin/reports")
@CrossOrigin(origins = "*")
public class ReportsController {

    private final BookManager bookManager;
    private final OrderManager orderManager;

    public ReportsController(BookManager bookManager, OrderManager orderManager) {
        this.bookManager = bookManager;
        this.orderManager = orderManager;
    }

    /**
     * GET /api/admin/reports/summary
     * Returns: totalRevenue, totalOrders, unitsSold, avgOrderValue,
     *          monthlyTrend, topBooks, revenueByCategory
     */
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        List<Order> allOrders = orderManager.getAll();
        List<Book>  allBooks  = bookManager.getAll();

        // ─── Build a book-id → Book map for O(1) lookups ──────────────────
        HashMap<String, Book> bookMap = new HashMap<>();
        for (Book b : allBooks) bookMap.put(b.getId(), b);

        // ─── Consider only completed (non-cancelled) orders ───────────────
        List<Order> completed = allOrders.stream()
                .filter(o -> !"CANCELLED".equalsIgnoreCase(o.getStatus()))
                .collect(Collectors.toList());

        double totalRevenue = completed.stream().mapToDouble(Order::getTotalPrice).sum();
        int    totalOrders  = completed.size();
        double avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // ─── Unit sales: count every bookId across every delivered/shipped order ─
        HashMap<String, Integer> unitsSoldMap = new HashMap<>();
        int totalUnits = 0;
        for (Order o : completed) {
            if (o.getBookIds() != null) {
                for (String bId : o.getBookIds()) {
                    unitsSoldMap.put(bId, unitsSoldMap.getOrDefault(bId, 0) + 1);
                    totalUnits++;
                }
            }
        }

        // ─── Monthly revenue trend via TreeMap (auto-sorted by YYYY-MM key) ──
        TreeMap<String, Double> trendMap = new TreeMap<>();
        for (Order o : completed) {
            try {
                String month = o.getOrderDate().substring(0, 7); // YYYY-MM
                trendMap.put(month, trendMap.getOrDefault(month, 0.0) + o.getTotalPrice());
            } catch (Exception ignored) {}
        }
        // Build list of last 6 months in chronological order
        List<Map<String, Object>> monthlyTrend = new ArrayList<>();
        int limit = 0;
        for (Map.Entry<String, Double> e : trendMap.descendingMap().entrySet()) {
            if (limit++ >= 6) break;
            Map<String, Object> pt = new HashMap<>();
            pt.put("month", e.getKey()); // YYYY-MM
            pt.put("revenue", Math.round(e.getValue() * 100.0) / 100.0);
            monthlyTrend.add(pt);
        }
        Collections.reverse(monthlyTrend);

        // ─── Top 10 best-selling books — max-heap by units sold ──────────
        PriorityQueue<Map.Entry<String, Integer>> maxHeap = new PriorityQueue<>(
                (a, b) -> b.getValue().compareTo(a.getValue())
        );
        maxHeap.addAll(unitsSoldMap.entrySet());

        List<Map<String, Object>> topBooks = new ArrayList<>();
        for (int i = 0; i < 10 && !maxHeap.isEmpty(); i++) {
            Map.Entry<String, Integer> entry = maxHeap.poll();
            Book bk = bookMap.get(entry.getKey());
            if (bk != null) {
                Map<String, Object> bMap = new LinkedHashMap<>();
                bMap.put("id",           bk.getId());
                bMap.put("title",        bk.getTitle());
                bMap.put("author",       bk.getAuthor());
                bMap.put("category",     bk.getCategory());
                bMap.put("coverImageUrl",bk.getCoverImageUrl());
                bMap.put("unitsSold",    entry.getValue());
                bMap.put("revenue",      Math.round(entry.getValue() * bk.getPrice() * 100.0) / 100.0);
                topBooks.add(bMap);
            }
        }

        // ─── Revenue by category — HashMap aggregation ────────────────────
        HashMap<String, Double> categoryRevMap = new HashMap<>();
        for (Order o : completed) {
            if (o.getBookIds() == null) continue;
            for (String bId : o.getBookIds()) {
                Book bk = bookMap.get(bId);
                if (bk != null && bk.getCategory() != null) {
                    categoryRevMap.put(bk.getCategory(),
                            categoryRevMap.getOrDefault(bk.getCategory(), 0.0) + bk.getPrice());
                }
            }
        }
        // Sort by revenue descending
        List<Map<String, Object>> revenueByCategory = categoryRevMap.entrySet().stream()
                .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
                .map(e -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("category", e.getKey());
                    m.put("revenue",  Math.round(e.getValue() * 100.0) / 100.0);
                    return m;
                })
                .collect(Collectors.toList());

        // ─── Assemble response ────────────────────────────────────────────
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("totalRevenue",      Math.round(totalRevenue * 100.0) / 100.0);
        report.put("totalOrders",       totalOrders);
        report.put("totalUnitsSold",    totalUnits);
        report.put("avgOrderValue",     Math.round(avgOrderValue * 100.0) / 100.0);
        report.put("monthlyTrend",      monthlyTrend);
        report.put("topBooks",          topBooks);
        report.put("revenueByCategory", revenueByCategory);

        return ResponseEntity.ok(report);
    }
}
