package com.bookstore.admin.service;

import com.bookstore.admin.model.Book;
import com.bookstore.admin.model.Order;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.PriorityQueue;

/**
 * OrderManager - Service class for Order operations.
 * DSA Implementation:
 * - HashMap for O(1) lookups.
 * - PriorityQueue to surface PENDING orders first.
 * - Manual QuickSort for sorting by date or price.
 */
@Service
public class OrderManager {
    private final JsonStorageUtil storage;
    private final BookManager bookManager;
    private HashMap<String, Order> orderMap = new HashMap<>();

    public OrderManager(JsonStorageUtil storage, BookManager bookManager) {
        this.storage = storage;
        this.bookManager = bookManager;
    }

    @PostConstruct
    public void init() throws IOException {
        List<Order> orders = storage.readOrders();
        for (Order order : orders) {
            orderMap.put(order.getId(), order);
        }
    }

    public List<Order> getAll() {
        return new ArrayList<>(orderMap.values());
    }

    public Order getById(String id) {
        return orderMap.get(id);
    }

    public Order updateStatus(String id, String newStatus) throws IOException {
        Order order = orderMap.get(id);
        if (order != null) {
            String oldStatus = order.getStatus();
            order.setStatus(newStatus);
            
            // Stock Deduction Logic
            if ("SHIPPED".equalsIgnoreCase(newStatus) && !"SHIPPED".equalsIgnoreCase(oldStatus)) {
                for (String bookId : order.getBookIds()) {
                    Book book = bookManager.getById(bookId);
                    if (book != null && book.getStockQuantity() > 0) {
                        book.setStockQuantity(book.getStockQuantity() - 1);
                        bookManager.update(bookId, book);
                    }
                }
            }
            
            // Stock Restoration Logic (if cancelled after shipped)
            if ("CANCELLED".equalsIgnoreCase(newStatus) && "SHIPPED".equalsIgnoreCase(oldStatus)) {
                for (String bookId : order.getBookIds()) {
                    Book book = bookManager.getById(bookId);
                    if (book != null) {
                        book.setStockQuantity(book.getStockQuantity() + 1);
                        bookManager.update(bookId, book);
                    }
                }
            }
            
            save();
            return order;
        }
        return null;
    }

    /**
     * PriorityQueue for Dashboard
     * DSA: PENDING orders have higher priority.
     */
    public List<Order> getPendingFirstOrders() {
        // Custom comparator: PENDING status comes first
        PriorityQueue<Order> pq = new PriorityQueue<>(new Comparator<Order>() {
            @Override
            public int compare(Order o1, Order o2) {
                boolean p1 = "PENDING".equalsIgnoreCase(o1.getStatus());
                boolean p2 = "PENDING".equalsIgnoreCase(o2.getStatus());
                if (p1 && !p2) return -1;
                if (!p1 && p2) return 1;
                // Secondary sort by date (descending, newest first)
                return o2.getOrderDate().compareTo(o1.getOrderDate());
            }
        });

        pq.addAll(orderMap.values());

        List<Order> result = new ArrayList<>();
        while (!pq.isEmpty()) {
            result.add(pq.poll());
        }
        return result;
    }

    /**
     * Manual QuickSort for Orders
     * DSA: O(n log n) average time complexity.
     */
    public List<Order> getSorted(String sortBy) {
        List<Order> orders = new ArrayList<>(orderMap.values());
        if (orders.isEmpty()) return orders;
        
        quickSort(orders, 0, orders.size() - 1, sortBy);
        return orders;
    }

    private void quickSort(List<Order> list, int low, int high, String key) {
        if (low < high) {
            int pi = partition(list, low, high, key);
            quickSort(list, low, pi - 1, key);
            quickSort(list, pi + 1, high, key);
        }
    }

    private int partition(List<Order> list, int low, int high, String key) {
        Order pivot = list.get(high);
        int i = (low - 1);
        for (int j = low; j < high; j++) {
            boolean condition = false;
            if ("price".equalsIgnoreCase(key)) {
                condition = list.get(j).getTotalPrice() <= pivot.getTotalPrice();
            } else { // default to date
                condition = list.get(j).getOrderDate().compareTo(pivot.getOrderDate()) <= 0;
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
        storage.writeOrders(new ArrayList<>(orderMap.values()));
    }
}
