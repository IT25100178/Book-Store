package com.bookstore.server;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.*;
import java.nio.charset.StandardCharsets;

/**
 * BaseHandler – shared utilities for all HTTP handlers.
 *
 * Provides CORS header injection, JSON response helpers, and
 * request body reading so each specific handler stays concise.
 */
public abstract class BaseHandler implements HttpHandler {

    // ── CORS ──────────────────────────────────────────────────────────────────

    /**
     * Add CORS headers so the React app on :5173 can call this server on :8080.
     */
    protected void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin",  "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        exchange.getResponseHeaders().set("Content-Type",                 "application/json; charset=UTF-8");
    }

    // ── Pre-flight ────────────────────────────────────────────────────────────

    /**
     * Handle OPTIONS pre-flight requests from the browser.
     * Returns 200 immediately with no body.
     */
    protected boolean handlePreflight(HttpExchange exchange) throws IOException {
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            addCorsHeaders(exchange);
            exchange.sendResponseHeaders(200, -1);
            return true;
        }
        return false;
    }

    // ── Response helpers ──────────────────────────────────────────────────────

    protected void sendJson(HttpExchange exchange, int statusCode, String json) throws IOException {
        addCorsHeaders(exchange);
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    protected void sendSuccess(HttpExchange exchange, String json) throws IOException {
        sendJson(exchange, 200, json);
    }

    protected void sendCreated(HttpExchange exchange, String json) throws IOException {
        sendJson(exchange, 201, json);
    }

    protected void sendError(HttpExchange exchange, int code, String message) throws IOException {
        sendJson(exchange, code, "{\"success\":false,\"message\":\"" + esc(message) + "\"}");
    }

    protected void sendNotFound(HttpExchange exchange, String entity) throws IOException {
        sendError(exchange, 404, entity + " not found");
    }

    protected void sendBadRequest(HttpExchange exchange, String message) throws IOException {
        sendError(exchange, 400, message);
    }

    protected void sendMethodNotAllowed(HttpExchange exchange) throws IOException {
        sendError(exchange, 405, "Method not allowed");
    }

    // ── Request body ──────────────────────────────────────────────────────────

    protected String readBody(HttpExchange exchange) throws IOException {
        try (InputStream is = exchange.getRequestBody()) {
            return new String(is.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    // ── Query string ──────────────────────────────────────────────────────────

    /**
     * Parse a query string like "search=java&category=Fiction&page=2"
     * into a Map.
     */
    protected java.util.Map<String, String> parseQuery(String query) {
        java.util.Map<String, String> map = new java.util.LinkedHashMap<>();
        if (query == null || query.isBlank()) return map;
        for (String pair : query.split("&")) {
            int eq = pair.indexOf('=');
            if (eq > 0) {
                String key   = java.net.URLDecoder.decode(pair.substring(0, eq), StandardCharsets.UTF_8);
                String value = java.net.URLDecoder.decode(pair.substring(eq + 1), StandardCharsets.UTF_8);
                map.put(key, value);
            }
        }
        return map;
    }

    // ── Path segment ─────────────────────────────────────────────────────────

    /**
     * Extract the segment at {@code index} from a request path.
     * e.g. /api/books/42 → segments = ["api","books","42"], index 2 → "42"
     */
    protected String pathSegment(HttpExchange exchange, int index) {
        String[] parts = exchange.getRequestURI().getPath().split("/");
        return (index < parts.length) ? parts[index] : null;
    }

    // ── JSON helpers ──────────────────────────────────────────────────────────

    /** Build a simple JSON array string from a list of JSON strings */
    protected String toJsonArray(java.util.List<String> jsonItems) {
        return "[" + String.join(",", jsonItems) + "]";
    }

    private String esc(String s) {
        return s == null ? "" : s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
