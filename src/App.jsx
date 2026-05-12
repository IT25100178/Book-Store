// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import PhoneLoginModal from "./components/PhoneLoginModal";
<<<<<<< HEAD
import ProfilePage from "./pages/ProfilePage";
=======
import BookList from "./components/BookList";
import BookDetails from "./components/BookDetails";
>>>>>>> e1c49d2e3e63b365840d78f812c0441322bf6077

import "./assets/App.css";  // Changed from "../App.css" to "./App.css"

function App() {
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
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
<<<<<<< HEAD
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
=======
              path="/books"
              element={
                <ProtectedRoute>
                  <BookList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book/:id"
              element={
                <ProtectedRoute>
                  <BookDetails />
>>>>>>> e1c49d2e3e63b365840d78f812c0441322bf6077
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