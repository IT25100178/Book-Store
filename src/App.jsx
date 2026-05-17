// src/App.jsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import BookList from "./components/BookList";

// My BookStore Component Pages (DSA + OOP)
import BookDetailPage from "./pages/BookDetailPage";
import AuthorPage from "./pages/AuthorPage";
import ReviewsPage from "./pages/ReviewsPage";

import "./assets/App.css";

function App() {
  const [cartItems, setCartItems] = useState([]);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home cartItems={cartItems} setCartItems={setCartItems} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/books"
              element={
                <ProtectedRoute>
                  <BookList />
                </ProtectedRoute>
              }
            />

            {/* ===== MY BOOKSTORE COMPONENT (Book Details Section) ===== */}
            {/* Page 1: Book Detail - info, description, author, publisher, price, availability, rating, reviews */}
            <Route
              path="/book/:id"
              element={
                <ProtectedRoute>
                  <BookDetailPage cartItems={cartItems} setCartItems={setCartItems} />
                </ProtectedRoute>
              }
            />
            {/* Page 2: Author Profile - bio, books under this author */}
            <Route
              path="/author/:authorId"
              element={
                <ProtectedRoute>
                  <AuthorPage cartItems={cartItems} setCartItems={setCartItems} />
                </ProtectedRoute>
              }
            />
            {/* Page 3: Reviews - view, post, sort reviews with DSA */}
            <Route
              path="/reviews/:id"
              element={
                <ProtectedRoute>
                  <ReviewsPage cartItems={cartItems} setCartItems={setCartItems} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;