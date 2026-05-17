package com.bookstore.handlers;

import com.bookstore.server.BaseHandler;
import com.bookstore.services.AuthService;
import com.bookstore.storage.FileStorage;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.util.Map;

/**
 * AuthHandler – Member 1 (Athethan)
 *
 * Routes:
 *   POST /api/auth/register       → register
 *   POST /api/auth/login          → login
 *   POST /api/auth/forgot-password → reset password
 */
public class AuthHandler extends BaseHandler {

    private final AuthService authService = new AuthService();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (handlePreflight(exchange)) return;

        String path   = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod().toUpperCase();

        try {
            if ("POST".equals(method)) {
                String body = readBody(exchange);
                Map<String, String> data = FileStorage.parseJsonBody(body);

                if (path.endsWith("/register")) {
                    handleRegister(exchange, data);
                } else if (path.endsWith("/login")) {
                    handleLogin(exchange, data);
                } else if (path.endsWith("/forgot-password")) {
                    handleForgotPassword(exchange, data);
                } else {
                    sendNotFound(exchange, "Auth endpoint");
                }
            } else {
                sendMethodNotAllowed(exchange);
            }
        } catch (Exception e) {
            sendError(exchange, 500, "Internal server error: " + e.getMessage());
        }
    }

    // ── /api/auth/register ────────────────────────────────────────────────────

    private void handleRegister(HttpExchange exchange, Map<String, String> data)
            throws IOException {
        String name     = data.get("name");
        String email    = data.get("email");
        String password = data.get("password");
        String phone    = data.getOrDefault("phone", "");

        Map<String, Object> result = authService.register(name, email, password, phone);

        if (Boolean.TRUE.equals(result.get("success"))) {
            sendCreated(exchange, buildResultJson(result));
        } else {
            sendBadRequest(exchange, (String) result.get("message"));
        }
    }

    // ── /api/auth/login ────────────────────────────────────────────────────────

    private void handleLogin(HttpExchange exchange, Map<String, String> data)
            throws IOException {
        String email    = data.get("email");
        String password = data.get("password");

        Map<String, Object> result = authService.login(email, password);

        if (Boolean.TRUE.equals(result.get("success"))) {
            sendSuccess(exchange, buildResultJson(result));
        } else {
            sendError(exchange, 401, (String) result.get("message"));
        }
    }

    // ── /api/auth/forgot-password ─────────────────────────────────────────────

    private void handleForgotPassword(HttpExchange exchange, Map<String, String> data)
            throws IOException {
        String email       = data.get("email");
        String newPassword = data.get("newPassword");

        Map<String, Object> result = authService.resetPassword(email, newPassword);

        if (Boolean.TRUE.equals(result.get("success"))) {
            sendSuccess(exchange, "{\"success\":true,\"message\":\""
                + result.get("message") + "\"}");
        } else {
            sendBadRequest(exchange, (String) result.get("message"));
        }
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    private String buildResultJson(Map<String, Object> result) {
        Object user = result.get("user");   // already a JSON string from toJson()
        String msg  = (String) result.get("message");
        return "{\"success\":true,\"message\":\"" + msg + "\",\"user\":" + user + "}";
    }
}
