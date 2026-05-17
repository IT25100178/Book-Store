import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "./components/Register";
import Login from "./components/Login";
import HomePage from "./components/Home";
import CheckoutPage from "./pages/CheckoutPage";
import SavedAddresses from "./pages/SavedAddresses";
import SavedPayments from "./pages/SavedPayments";
import TaxPage from "./pages/TaxPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderHistory from "./pages/OrderHistory";
import SavedInvoices from "./pages/SavedInvoices";
import Searchbooks from "./components/Searchbooks";
import BookCard from "./components/BookCard";
import BookDetails from "./components/BookDetails";
import BookImage from "./components/BookImage";
import BookList from "./components/BookList";
import Pagination from "./components/Pagination";
import ProtectedRoute from "./components/ProtectedRoute";
import FilterByCategory from "./components/FilterByCategory";
import SortByPrice from "./components/SortByPrice";
import SortByRating from "./components/SortByRating";




function App() {

  return (

    <Router>

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<HomePage />}
        />

        {/* AUTH */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/search"
          element={<Searchbooks />}
        />

        <Route
          path="/book/:id"
          element={<BookDetails />}
        />

        <Route
          path="/filter-category"
          element={<FilterByCategory />}
        />  

        <Route
          path="/sort-price"
          element={<SortByPrice />}
        />

        <Route
          path="/sort-rating"
          element={<SortByRating />}
        />

        

        <Route
          path="/books"
          element={<BookList />}
        />

        <Route
          path="/pagination"
          element={<Pagination />}
        />

        <Route
          path="/book-image/:id"
          element={<BookImage />}
        />

        <Route
          path="/book-card/:id"
          element={<BookCard />}
        />

        <Route
          path="/protected"
          element={<ProtectedRoute />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* CHECKOUT */}
        <Route
          path="/checkout"
          element={<CheckoutPage />}
        />

        {/* SAVED ADDRESSES */}
        <Route
          path="/saved-addresses"
          element={<SavedAddresses />}
        />

        {/* SAVED PAYMENTS */}
        <Route
          path="/saved-payments"
          element={<SavedPayments />}
        />

        {/* TAX */}
        <Route
          path="/tax"
          element={<TaxPage />}
        />

        {/* ORDER CONFIRMATION */}
        <Route
          path="/order-confirmation"
          element={<OrderConfirmation />}
        />

        {/* ORDER HISTORY */}
        <Route
          path="/order-history"
          element={<OrderHistory />}
        />

        {/* INVALID ROUTES */}
        <Route
          path="*"
          element={<HomePage />}
        />

        <Route
           path="/saved-invoices"
           element={<SavedInvoices />}
        />

      </Routes>

    </Router>
  );
}

export default App;