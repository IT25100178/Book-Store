import { useEffect, useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/checkout.css";

export default function CheckoutPage() {

  const navigate = useNavigate();

  // =========================
  // AUTH
  // =========================
  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  // =========================
  // CART
  // =========================
  const cart = useContext(CartContext);

  const fallbackCart = [
    {
      id: 1,
      title: "Atomic Habits 📘",
      price: 2500,
      quantity: 1,
    },
  ];

  const cartItems =
    cart?.cartItems &&
    cart.cartItems.length > 0
      ? cart.cartItems
      : fallbackCart;

  // =========================
  // FORM
  // =========================
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",

    payment: "cod",

    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  // =========================
  // AUTO LOAD USER
  // =========================
  useEffect(() => {

    if (user) {

      setForm((prev) => ({
        ...prev,
        fullName:
          user.displayName ||
          user.name ||
          "",
      }));
    }

  }, [user]);

  // =========================
  // LOAD ADDRESS FROM BACKEND
  // =========================
  useEffect(() => {

    loadAddresses();

  }, []);

  const loadAddresses = async () => {

    try {

      const response = await fetch(
        "http://localhost:8080/addresses"
      );

      if (!response.ok) {
        return;
      }

      const data =
        await response.json();

      if (data.length > 0) {

        const latestAddress =
          data[data.length - 1];

        setForm((prev) => ({
          ...prev,

          fullName:
            latestAddress.fullName || "",

          phone:
            latestAddress.phone || "",

          address:
            latestAddress.address || "",

          city:
            latestAddress.city || "",

          postalCode:
            latestAddress.postalCode || "",
        }));
      }

    } catch (error) {

      console.log(error);
    }
  };

  // =========================
  // LOAD PAYMENT FROM BACKEND
  // =========================
  useEffect(() => {

    loadPayments();

  }, []);

  const loadPayments = async () => {

    try {

      const response = await fetch(
        "http://localhost:8080/payments"
      );

      if (!response.ok) {
        return;
      }

      const data =
        await response.json();

      if (data.length > 0) {

        const latestPayment =
          data[data.length - 1];

        setForm((prev) => ({
          ...prev,

          cardNumber:
            latestPayment.cardNumber || "",

          expiry:
            latestPayment.expiry || "",

          cvv:
            latestPayment.cvv || "",
        }));
      }

    } catch (error) {

      console.log(error);
    }
  };

  // =========================
  // CALCULATIONS
  // =========================
  const deliveryCharge = 0;

  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      item.price *
      item.quantity,
    0
  );

  const tax = subtotal * 0.02;

  const total =
    subtotal +
    deliveryCharge +
    tax;

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {

    logout();

    navigate("/login");
  };

  // =========================
  // SAVE ADDRESS
  // =========================
  const saveAddress = async () => {

    if (
      !form.fullName ||
      !form.phone ||
      !form.address
    ) {

      alert(
        "Please fill all address fields"
      );

      return;
    }

    try {

      const addressData = {

        id: Date.now(),

        fullName:
          form.fullName,

        phone:
          form.phone,

        address:
          form.address,

        city:
          form.city,

        postalCode:
          form.postalCode,
      };

      const response = await fetch(
        "http://localhost:8080/addresses",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(addressData),
        }
      );

      if (!response.ok) {

        alert(
          "Failed To Save Address ❌"
        );

        return;
      }

      const message =
        await response.text();

      alert(message);

      loadAddresses();

    } catch (error) {

      console.log(error);

      alert(
        "Backend Not Running ❌"
      );
    }
  };

  // =========================
  // SAVE PAYMENT
  // =========================
  const savePayment = async () => {

    if (form.payment !== "online") {
      return;
    }

    try {

      const paymentData = {

        id: Date.now(),

        cardNumber:
          form.cardNumber,

        expiry:
          form.expiry,

        cvv:
          form.cvv,
      };

      const response = await fetch(
        "http://localhost:8080/payments",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(paymentData),
        }
      );

      if (!response.ok) {

        alert(
          "Failed To Save Payment ❌"
        );

        return;
      }

      const message =
        await response.text();

      alert(message);

      loadPayments();

    } catch (error) {

      console.log(error);

      alert(
        "Backend Not Running ❌"
      );
    }
  };

  // =========================
  // SAVE TAX
  // =========================
  const saveTax = async () => {

    try {

      const response = await fetch(
        "http://localhost:8080/tax",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              subtotal,
              tax,
              date:
                new Date().toLocaleString(),
            }),
        }
      );

      if (!response.ok) {

        alert(
          "Failed To Save Tax ❌"
        );

        return;
      }

      const message =
        await response.text();

      alert(message);

    } catch (error) {

      console.log(error);

      alert(
        "Backend Not Running ❌"
      );
    }
  };

  // =========================
  // PLACE ORDER
  // =========================
  const placeOrder = async () => {

    // LOGIN VALIDATION
    if (!isAuthenticated || !user) {

      alert("Please login first");

      navigate("/login");

      return;
    }

    // VALIDATION
    if (!form.fullName.trim()) {

      alert(
        "Please enter full name"
      );

      return;
    }

    if (!form.phone.trim()) {

      alert(
        "Please enter phone number"
      );

      return;
    }

    if (
      !/^[0-9]{10}$/.test(
        form.phone
      )
    ) {

      alert(
        "Phone number must contain exactly 10 digits"
      );

      return;
    }

    if (!form.address.trim()) {

      alert(
        "Please enter address"
      );

      return;
    }

    if (
      form.payment === "online"
    ) {

      if (
        !form.cardNumber ||
        !form.expiry ||
        !form.cvv
      ) {

        alert(
          "Please fill payment details"
        );

        return;
      }

      await savePayment();
    }

    // SAVE TAX BEFORE ORDER
    await saveTax();

    // ORDER OBJECT
    const order = {

      orderId: Date.now(),

      customerName:
        form.fullName,

      phone:
        form.phone,

      address:
        form.address,

      city:
        form.city,

      postalCode:
        form.postalCode,

      paymentMethod:
        form.payment === "cod"
          ? "Cash On Delivery"
          : "Online Payment",

      subtotal,

      tax,

      total,

      status: "PLACED",

      items: cartItems,

      createdAt:
        new Date().toLocaleString(),
    };

    // =========================
    // SEND TO BACKEND
    // =========================
    try {

      const response = await fetch(
        "http://localhost:8080/orders",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(order),
        }
      );

      // BACKEND FAILED
      if (!response.ok) {

        alert(
          "Backend Server Error ❌"
        );

        return;
      }

      const message =
        await response.text();

      console.log(message);

      alert(
        "Order Placed Successfully 🎉"
      );

      navigate(
        "/order-confirmation"
      );

    } catch (error) {

      console.log(
        "Backend connection failed"
      );

      console.error(error);

      alert(
        "Backend Not Running ❌"
      );
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className="checkout-header">

        <div className="logo">
          LUXURY
          <span>BOOKS</span>
        </div>

        <div className="user-info">

          {user ? (
            <>
              <span>
                Hi,{" "}
                {user.displayName ||
                  user.name}
              </span>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <span className="guest">
              Guest
            </span>
          )}

        </div>

      </header>

      {/* MAIN */}
      <div className="checkout-container">

        {/* LEFT */}
        <div className="checkout-left">

          <h2>
            Shipping Details 
          </h2>

          <input
            type="text"
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) =>
              setForm({
                ...form,
                fullName:
                  e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone:
                  e.target.value,
              })
            }
          />

          <textarea
            placeholder="Full Address"
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address:
                  e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="City"
            value={form.city}
            onChange={(e) =>
              setForm({
                ...form,
                city:
                  e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Postal Code"
            value={form.postalCode}
            onChange={(e) =>
              setForm({
                ...form,
                postalCode:
                  e.target.value,
              })
            }
          />

          <div className="button-group">

            <button onClick={saveAddress}>
              Save Address
            </button>

            <button
              onClick={() =>
                navigate(
                  "/saved-addresses"
                )
              }
            >
              Manage Addresses
            </button>

          </div>

          <h3>
            Delivery Method 
          </h3>

          <label className="option-row">

            <input
              type="radio"
              checked
              readOnly
            />

            <span>
              Standard Delivery (Free)
            </span>

          </label>

          <h3>
            Payment Method 
          </h3>

          <label className="option-row">

            <input
              type="radio"
              checked={
                form.payment ===
                "cod"
              }
              onChange={() =>
                setForm({
                  ...form,
                  payment:
                    "cod",
                })
              }
            />

            <span>
              Cash on Delivery
            </span>

          </label>

          <label className="option-row">

            <input
              type="radio"
              checked={
                form.payment ===
                "online"
              }
              onChange={() =>
                setForm({
                  ...form,
                  payment:
                    "online",
                })
              }
            />

            <span>
              Online Payment
            </span>

          </label>

          {form.payment ===
            "online" && (
            <>
              <input
                type="text"
                placeholder="Card Number"
                value={
                  form.cardNumber
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    cardNumber:
                      e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="MM/YY"
                value={
                  form.expiry
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    expiry:
                      e.target.value,
                  })
                }
              />

              <input
                type="password"
                placeholder="CVV"
                value={form.cvv}
                onChange={(e) =>
                  setForm({
                    ...form,
                    cvv:
                      e.target.value,
                  })
                }
              />

              <button
                onClick={savePayment}
              >
                Add Payment
              </button>

              <button
                onClick={() =>
                  navigate(
                    "/saved-payments"
                  )
                }
              >
                Manage Payments
              </button>
            </>
          )}

        </div>

        {/* RIGHT */}
        <div className="checkout-right">

          <h2>
            Order Summary 🛒
          </h2>

          {cartItems.map(
            (item) => (
              <div
                key={item.id}
                className="address-card"
              >
                <h3>
                  {item.title}
                </h3>

                <p>
                  Price:
                  Rs. {item.price}
                </p>

                <p>
                  Quantity:
                  {item.quantity}
                </p>
              </div>
            )
          )}

          <p>
            Subtotal:
            Rs. {subtotal}
          </p>

          <p>
            Delivery:
            Rs. 0
          </p>

          <p>
            Tax (2%):
            Rs. {tax.toFixed(2)}
          </p>

          <h3>
            Total:
            Rs. {total.toFixed(2)}
          </h3>

          <div className="action-buttons-row">

            <button onClick={saveTax}>
              Add Tax
            </button>

            <button
              onClick={() =>
                navigate("/tax")
              }
            >
              View Tax
            </button>

            <button onClick={placeOrder}>
              Place Order
            </button>

            <button
              onClick={() =>
                navigate(
                  "/order-history"
                )
              }
            >
              Orders
            </button>

          </div>

          <button
            className="receipt-btn"
            onClick={() =>
              navigate(
                "/saved-invoices"
              )
            }
          >
            Payment Receipts 
          </button>

        </div>

      </div>
    </>
  );
}