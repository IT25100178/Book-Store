const user = JSON.parse(localStorage.getItem("user"));
import { useEffect } from "react";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import "../styles/checkout.css";

export default function CheckoutPage() {
  const cart = useContext(CartContext);
  const cartItems = cart?.cartItems || [];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    payment: "cod",
    delivery: "standard",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  const deliveryCharge = form.delivery === "express" ? 50 : 0;

  const subtotal = cartItems.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );

  const tax = subtotal * 0.02;
  const total = subtotal + deliveryCharge + tax;

  /*  ADDRESS  */
  const saveAddress = () => {
    const list = JSON.parse(localStorage.getItem("addresses") || "[]");
    list.push({
      address: form.address,
      createdAt: new Date().toLocaleString()
    });
    localStorage.setItem("addresses", JSON.stringify(list));
    alert("Address saved");
  };

  /*  CARD  */
  const saveCard = () => {
    const list = JSON.parse(localStorage.getItem("cards") || "[]");
    list.push({
      number: form.cardNumber,
      expiry: form.expiry,
      createdAt: new Date().toLocaleString()
    });
    localStorage.setItem("cards", JSON.stringify(list));
    alert("Card saved");
  };

  /*  TAX  */
  const saveTax = () => {
    const list = JSON.parse(localStorage.getItem("taxRecords") || "[]");
    list.push({
      subtotal,
      tax,
      createdAt: new Date().toLocaleString()
    });
    localStorage.setItem("taxRecords", JSON.stringify(list));
    alert("Tax saved!");
  };

  return (
    <>
      <header className="checkout-header">
       <div className="logo">
         LUXURY<span>BOOKS</span>
       </div>

       <div className="user-info">
         {user ? (
         <span>{user.name}</span>
         ) : (
         <span className="guest">Guest</span>
         )}
       </div>
      </header>

      <div className="checkout-container">

        {/* LEFT */}
        <div className="checkout-left">
          <h2>Shipping Details</h2>

          <input
            placeholder="Full Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Phone Number"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <textarea
            placeholder="Full Address"
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <div className="button-group">
            <button onClick={saveAddress}>Save Address</button>
            <button onClick={() => window.open("/saved-addresses", "_blank")}>
              Saved Address
            </button>
          </div>

          <h3>Delivery Options</h3>

          <label className="option-row">
            <input
              type="radio"
              checked={form.delivery === "standard"}
              onChange={() => setForm({ ...form, delivery: "standard" })}
            />
            <span>Standard (Free)</span>
          </label>

          <label className="option-row">
            <input
              type="radio"
              checked={form.delivery === "express"}
              onChange={() => setForm({ ...form, delivery: "express" })}
            />
            <span>Express (+ Rs.50)</span>
          </label>

          <h3>Payment Method</h3>

          <label className="option-row">
            <input
              type="radio"
              checked={form.payment === "cod"}
              onChange={() => setForm({ ...form, payment: "cod" })}
            />
            <span>Cash on Delivery</span>
          </label>

          <label className="option-row">
            <input
              type="radio"
              checked={form.payment === "online"}
              onChange={() => setForm({ ...form, payment: "online" })}
            />
            <span>Online Payment</span>
          </label>

          {form.payment === "online" && (
            <>
              <input
                placeholder="Card Number"
                onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
              />
              <input
                placeholder="MM/YY"
                onChange={(e) => setForm({ ...form, expiry: e.target.value })}
              />
              <input
                placeholder="CVV"
                onChange={(e) => setForm({ ...form, cvv: e.target.value })}
              />

              <div className="button-group">
                <button onClick={saveCard}>Save Card</button>
                <button onClick={() => window.open("/saved-cards", "_blank")}>
                  Saved Cards
                </button>
              </div>
            </>
          )}
        </div>

        {/* RIGHT */}
        <div className="checkout-right">
          <h2>Order Summary</h2>

          <p>Subtotal: Rs. {subtotal}</p>
          <p>Delivery: Rs. {deliveryCharge}</p>
          <p>Tax (2%): Rs. {tax.toFixed(2)}</p>

          <h3>Total: Rs. {total.toFixed(2)}</h3>

          <div className="button-group">
            <button onClick={saveTax}>
              Apply Tax & Build our Nation
            </button>

            <button onClick={() => window.open("/tax", "_blank")}>
              View Your Tax Details
            </button>

            <button
              onClick={() => {
                if (!cartItems.length) {
                  alert("Cart is empty");
                  return;
                }

                if (!form.name.trim()) {
                  alert("Enter your name");
                  return;
                }

                if (!form.phone.trim()) {
                  alert("Enter your phone number");
                  return;
                }

                const phone = form.phone.trim();

                if (!/^[0-9]+$/.test(phone)) {
                  alert("Phone must contain only numbers");
                  return;
                }

                if (phone.length !== 10) {
                  alert("Phone must be 10 digits");
                  return;
                }

                if (!form.address.trim()) {
                  alert("Enter your address");
                  return;
                }

                const user = JSON.parse(localStorage.getItem("user"));

                if (!user) {
                  alert("Please login first");
                  return;
                }

                const orderId = Date.now();

                const order = {
                  orderId,
                  user: {
                    name: form.name,
                    phone: form.phone,
                    address: form.address,
                  },
                    items: cartItems,
                    payment: {
                    method: form.payment,
                  },

                  delivery: {
                    type: form.delivery,
                    charge: deliveryCharge,
                  },

                  charges: {
                    subtotal,
                    tax,
                    delivery: deliveryCharge,
                  },
                  total,
                    status: "PLACED",
                    createdAt: new Date().toISOString(),
                  };


                const existingOrders =
                  JSON.parse(localStorage.getItem("orders")) || [];

                existingOrders.push(order);


                localStorage.setItem("orders", JSON.stringify(existingOrders));

                localStorage.setItem("latestOrder", JSON.stringify(order));

                window.location.href = "/order-confirmation";
              }}
            >
              Place Order
            </button>

            <button onClick={() => window.open("/order-history", "_blank")}>
              Order History
            </button>
          </div>
        </div>

      </div>
    </>
  );
}