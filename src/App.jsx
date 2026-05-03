import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CheckoutPage from "./pages/CheckoutPage";
import SavedCards from "./pages/SavedCards";
import SavedAddresses from "./pages/SavedAddresses";
import TaxPage from "./pages/TaxPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderHistory from "./pages/OrderHistory";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/saved-addresses" element={<SavedAddresses />} />
        <Route path="/saved-cards" element={<SavedCards />} />
        <Route path="/tax" element={<TaxPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/order-history" element={<OrderHistory />} />
      </Routes>
    </Router>
  );
}

export default App;