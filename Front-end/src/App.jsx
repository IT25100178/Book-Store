// src/App.jsx
// Full routing for all 7 members' components
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider }    from "./context/AuthContext";
import { CartProvider }    from "./context/CartContext";

// Member 1 – Athethan
import Login           from "./components/auth/Login";
import Register        from "./components/auth/Register";
import ForgotPassword  from "./components/auth/ForgotPassword";
import Home            from "./components/home/Home";

// Member 2 – Deepika
import BookListPage    from "./components/books/BookListPage";

// Member 3 – Yuvaniya
import BookDetailsPage from "./components/bookdetails/BookDetailsPage";

// Member 4 – Lojeni
import CartPage        from "./components/cart/CartPage";

// Member 5 – Vishnu
import CheckoutPage    from "./components/checkout/CheckoutPage";
import OrderConfirmation from "./components/checkout/OrderConfirmation";

// Member 6 – Vishok
import UserProfilePage from "./components/profile/UserProfilePage";

// Member 7 – Vishahan
import AdminDashboard  from "./components/admin/AdminDashboard";

import ProtectedRoute  from "./components/shared/ProtectedRoute";
import AdminRoute      from "./components/shared/AdminRoute";

import "./assets/App.css";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* ── Public routes ─────────────────────────────────────────── */}
              <Route path="/login"           element={<Login />} />
              <Route path="/register"        element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* ── Protected user routes ─────────────────────────────────── */}
              <Route path="/"
                element={<ProtectedRoute><Home /></ProtectedRoute>} />

              <Route path="/books"
                element={<ProtectedRoute><BookListPage /></ProtectedRoute>} />

              <Route path="/books/:id"
                element={<ProtectedRoute><BookDetailsPage /></ProtectedRoute>} />

              <Route path="/cart"
                element={<ProtectedRoute><CartPage /></ProtectedRoute>} />

              <Route path="/checkout"
                element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />

              <Route path="/order-confirmation/:orderId"
                element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />

              <Route path="/profile"
                element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />

              {/* ── Admin routes ──────────────────────────────────────────── */}
              <Route path="/admin"
                element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/*"
                element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
