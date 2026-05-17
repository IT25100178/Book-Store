package com.bookstore;

import com.bookstore.handlers.*;
import com.bookstore.storage.FileStorage;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

/**
 * Main – Java HTTP Server entry point.
 *
 * Starts a lightweight HTTP server on port 8080 using the JDK's
 * built-in com.sun.net.httpserver package (no external libraries).
 *
 * Run with:
 *   javac -d out -sourcepath src src/com/bookstore/Main.java
 *   java  -cp out com.bookstore.Main
 */
public class Main {

    private static final int PORT = 8080;

    public static void main(String[] args) throws IOException {

        // ── Ensure all data files exist ───────────────────────────────────────
        FileStorage.ensureFile("users.txt");
        FileStorage.ensureFile("books.txt");
        FileStorage.ensureFile("cart.txt");
        FileStorage.ensureFile("orders.txt");
        FileStorage.ensureFile("reviews.txt");
        FileStorage.ensureFile("wishlist.txt");

        // ── Seed data if files are empty ──────────────────────────────────────
        DataSeeder.seed();

        // ── Start HTTP server ─────────────────────────────────────────────────
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

        // Register route contexts
        server.createContext("/api/auth",   new AuthHandler());
        server.createContext("/api/books",  new BookHandler());
        server.createContext("/api/cart",   new CartHandler());
        server.createContext("/api/orders", new OrderHandler());
        server.createContext("/api/users",  new UserHandler());

        // Thread pool to handle concurrent requests
        server.setExecutor(Executors.newFixedThreadPool(10));
        server.start();

        System.out.println("╔═══════════════════════════════════════════════╗");
        System.out.println("║   📚 Luxury Books API Server                  ║");
        System.out.println("║   Running at http://localhost:" + PORT + "            ║");
        System.out.println("╠═══════════════════════════════════════════════╣");
        System.out.println("║  Endpoints:                                   ║");
        System.out.println("║  POST  /api/auth/register                     ║");
        System.out.println("║  POST  /api/auth/login                        ║");
        System.out.println("║  POST  /api/auth/forgot-password              ║");
        System.out.println("║  GET   /api/books                             ║");
        System.out.println("║  GET   /api/books/{id}                        ║");
        System.out.println("║  GET   /api/books/{id}/reviews                ║");
        System.out.println("║  POST  /api/books/{id}/reviews                ║");
        System.out.println("║  GET   /api/cart/{userId}                     ║");
        System.out.println("║  POST  /api/cart/add                          ║");
        System.out.println("║  PUT   /api/cart/update                       ║");
        System.out.println("║  DELETE /api/cart/remove                      ║");
        System.out.println("║  POST  /api/cart/discount                     ║");
        System.out.println("║  POST  /api/orders/place                      ║");
        System.out.println("║  GET   /api/orders/{userId}                   ║");
        System.out.println("║  GET   /api/users/{id}                        ║");
        System.out.println("║  PUT   /api/users/{id}                        ║");
        System.out.println("║  GET   /api/users/{id}/wishlist               ║");
        System.out.println("║  POST  /api/users/{id}/wishlist               ║");
        System.out.println("╚═══════════════════════════════════════════════╝");
    }
}
