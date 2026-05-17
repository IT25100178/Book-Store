# 📚 Luxury Books – University OOP Module Project

A full-stack book store application built for the Object-Oriented Programming module.

---

## 👥 Team Members & Responsibilities

| # | Member       | Area                        |
|---|-------------|------------------------------|
| 1 | **Athethan**  | Authentication + Home Page  |
| 2 | **Deepika**   | Book Listing + Search       |
| 3 | **Yuvaniya**  | Book Details Section        |
| 4 | **Lojeni**    | Cart System                 |
| 5 | **Vishnu**    | Checkout System             |
| 6 | **Vishok**    | User Profile                |
| 7 | **Vishahan**  | Admin Panel                 |

---

## 📁 Project Structure

```
Book-Store/
├── Front-end/          ← React (Vite) Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/         (M1 – Athethan)
│   │   │   ├── home/         (M1 – Athethan)
│   │   │   ├── books/        (M2 – Deepika)
│   │   │   ├── bookdetails/  (M3 – Yuvaniya)
│   │   │   ├── cart/         (M4 – Lojeni)
│   │   │   ├── checkout/     (M5 – Vishnu)
│   │   │   ├── profile/      (M6 – Vishok)
│   │   │   ├── admin/        (M7 – Vishahan)
│   │   │   └── shared/       (Shared components)
│   │   ├── context/          (AuthContext, CartContext)
│   │   ├── services/         (api.js – Java API calls)
│   │   └── assets/           (Global CSS)
│   ├── package.json
│   └── vite.config.js
│
└── Back-end/           ← Java HTTP Server (No framework)
    ├── src/com/bookstore/
    │   ├── models/           (User, Book, CartItem, Order, Review, WishlistItem)
    │   ├── storage/          (FileStorage – TXT file I/O)
    │   ├── services/         (AuthService, BookService, CartService, OrderService, UserService)
    │   ├── handlers/         (AuthHandler, BookHandler, CartHandler, OrderHandler, UserHandler)
    │   ├── server/           (BaseHandler)
    │   ├── DataSeeder.java
    │   └── Main.java
    ├── data/                 ← TXT file storage (auto-created)
    │   ├── users.txt
    │   ├── books.txt
    │   ├── cart.txt
    │   ├── orders.txt
    │   ├── reviews.txt
    │   └── wishlist.txt
    └── run.bat               ← Build & run script
```

---

## 🚀 How to Run

### 1. Start the Java Backend

```bash
cd Back-end
run.bat
```

The server starts at **http://localhost:8080**

> **Default Admin Account:**
> - Email: `admin@luxurybooks.com`
> - Password: `admin123`

### 2. Start the React Frontend

```bash
cd Front-end
npm install
npm run dev
```

The app opens at **http://localhost:5173**

---

## 💾 Data Storage (TXT Files)

All data is stored in `Back-end/data/` as pipe-delimited text files:

| File           | Contents |
|---------------|----------|
| `users.txt`   | User accounts (id\|name\|email\|password\|...) |
| `books.txt`   | Book catalogue |
| `cart.txt`    | Shopping cart items per user |
| `orders.txt`  | Placed orders |
| `reviews.txt` | Book reviews |
| `wishlist.txt`| User wishlists |

---

## 🌐 REST API Endpoints

| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| POST   | `/api/auth/register`              | Register new user        |
| POST   | `/api/auth/login`                 | Login                    |
| POST   | `/api/auth/forgot-password`       | Reset password           |
| GET    | `/api/books`                      | List/search/filter books |
| GET    | `/api/books/{id}`                 | Book details             |
| GET    | `/api/books/{id}/reviews`         | Book reviews             |
| POST   | `/api/books/{id}/reviews`         | Add review               |
| GET    | `/api/cart/{userId}`              | Get cart                 |
| POST   | `/api/cart/add`                   | Add to cart              |
| PUT    | `/api/cart/update`                | Update quantity          |
| DELETE | `/api/cart/remove`                | Remove from cart         |
| POST   | `/api/cart/discount`              | Apply discount code      |
| POST   | `/api/orders/place`               | Place order              |
| GET    | `/api/orders/{userId}`            | Order history            |
| GET    | `/api/users/{id}`                 | User profile             |
| PUT    | `/api/users/{id}`                 | Update profile           |
| GET    | `/api/users/{id}/wishlist`        | Wishlist                 |
| POST   | `/api/users/{id}/wishlist`        | Add to wishlist          |
| GET    | `/api/admin/users` (via GET /api/users) | Admin: all users  |
| GET    | `/api/orders/all`                 | Admin: all orders        |
| GET    | `/api/orders/summary`             | Admin: sales summary     |
| POST   | `/api/books`                      | Admin: add book          |
| PUT    | `/api/books/{id}`                 | Admin: edit book         |
| DELETE | `/api/books/{id}`                 | Admin: delete book       |

---

## 🎁 Discount Codes (Demo)

| Code          | Discount |
|--------------|----------|
| `LUXBOOKS10` | 10%      |
| `OOP2024`    | 15%      |
| `STUDENT20`  | 20%      |
| `WELCOME5`   | 5%       |

---

## 🛠 Technology Stack

| Layer     | Technology |
|-----------|-----------|
| Frontend  | React 19, Vite, React Router v7 |
| Backend   | Java SE (com.sun.net.httpserver) |
| Database  | Plain text files (.txt) |
| Auth      | Custom token (localStorage session) |
| Styling   | Vanilla CSS, CSS Variables |

---

## 📞 Contact

**132/1 Thalaiyadi Lane, Jaffna**
📞 (+94) 742-624-977
✉️ hello@luxurybooks.com
