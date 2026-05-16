package com.bookstore.admin.service;

import com.bookstore.admin.model.Book;
import com.bookstore.admin.model.Order;
import com.bookstore.admin.model.User;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.bookstore.admin.model.Author;
import com.bookstore.admin.model.Genre;
import com.bookstore.admin.model.ActivityLog;
import com.bookstore.admin.model.Publisher;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

/**
 * JsonStorageUtil - Utility class for JSON persistence.
 * Uses Jackson ObjectMapper to read and write data files.
 */
@Component
public class JsonStorageUtil {
    private final ObjectMapper mapper;
    private final String dataPath;

    public JsonStorageUtil() {
        this.mapper = new ObjectMapper();
        this.mapper.enable(SerializationFeature.INDENT_OUTPUT);
        
        // Path to the data directory in resources
        String userDir = System.getProperty("user.dir");
        this.dataPath = Paths.get(userDir, "src", "main", "resources", "data").toString();
        
        // Ensure directory exists
        File directory = new File(this.dataPath);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }

    public List<Book> readBooks() throws IOException {
        return readFile("books.json", new TypeReference<List<Book>>() {});
    }

    public void writeBooks(List<Book> books) throws IOException {
        writeFile("books.json", books);
    }

    public List<User> readUsers() throws IOException {
        return readFile("users.json", new TypeReference<List<User>>() {});
    }

    public void writeUsers(List<User> users) throws IOException {
        writeFile("users.json", users);
    }

    public List<Order> readOrders() throws IOException {
        return readFile("orders.json", new TypeReference<List<Order>>() {});
    }

    public void writeOrders(List<Order> orders) throws IOException {
        writeFile("orders.json", orders);
    }

    public List<Author> readAuthors() throws IOException {
        return readFile("authors.json", new TypeReference<List<Author>>() {});
    }

    public void writeAuthors(List<Author> authors) throws IOException {
        writeFile("authors.json", authors);
    }

    public List<Genre> readGenres() throws IOException {
        return readFile("genres.json", new TypeReference<List<Genre>>() {});
    }

    public void writeGenres(List<Genre> genres) throws IOException {
        writeFile("genres.json", genres);
    }

    public List<ActivityLog> readLogs() throws IOException {
        return readFile("activity_log.json", new TypeReference<List<ActivityLog>>() {});
    }

    public void writeLogs(List<ActivityLog> logs) throws IOException {
        writeFile("activity_log.json", logs);
    }

    public List<Publisher> readPublishers() throws IOException {
        return readFile("publishers.json", new TypeReference<List<Publisher>>() {});
    }

    public void writePublishers(List<Publisher> publishers) throws IOException {
        writeFile("publishers.json", publishers);
    }

    private <T> List<T> readFile(String fileName, TypeReference<List<T>> typeReference) throws IOException {
        File file = new File(dataPath, fileName);
        if (!file.exists() || file.length() == 0) {
            return new ArrayList<>();
        }
        return mapper.readValue(file, typeReference);
    }

    private void writeFile(String fileName, Object data) throws IOException {
        File file = new File(dataPath, fileName);
        mapper.writeValue(file, data);
    }
}
