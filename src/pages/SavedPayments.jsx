import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/checkout.css";

export default function SavedPayments() {

  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);

  const [form, setForm] = useState({
    cardHolder: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [editId, setEditId] = useState(null);

  // =========================
  // LOAD PAYMENTS FROM BACKEND
  // =========================
  const loadPayments = async () => {

    try {

      const response = await fetch(
        "http://localhost:8080/payments"
      );

      const data = await response.json();

      setPayments(data);

      // AUTO LOAD FIRST PAYMENT
      if (data.length > 0) {

        const latestPayment = data[0];

        setForm({
          cardHolder:
            latestPayment.cardHolder || "",

          cardNumber:
            latestPayment.cardNumber || "",

          expiry:
            latestPayment.expiry || "",

          cvv:
            latestPayment.cvv || "",
        });

        setEditId(latestPayment.id);
      }

    } catch (error) {

      console.error(
        "Failed to load payments",
        error
      );

      setPayments([]);
    }
  };

  useEffect(() => {

    loadPayments();

  }, []);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  // =========================
  // SAVE OR UPDATE PAYMENT
  // =========================
  const handleSubmit = async () => {

    // VALIDATION
    if (
      !form.cardHolder.trim() ||
      !form.cardNumber.trim() ||
      !form.expiry.trim() ||
      !form.cvv.trim()
    ) {

      alert("Fill all fields");

      return;
    }

    // CARD NUMBER VALIDATION
    if (
      !/^[0-9]+$/.test(
        form.cardNumber
      )
    ) {

      alert(
        "Card number must contain only numbers"
      );

      return;
    }

    // CVV VALIDATION
    if (
      !/^[0-9]+$/.test(
        form.cvv
      )
    ) {

      alert(
        "CVV must contain only numbers"
      );

      return;
    }

    try {

      // =========================
      // UPDATE
      // =========================
      if (editId !== null) {

        await fetch(
          `http://localhost:8080/payments/${editId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              ...form,
              id: editId,
            }),
          }
        );

        alert("Payment Updated");
      }

      // =========================
      // CREATE
      // =========================
      else {

        await fetch(
          "http://localhost:8080/payments",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              id: Date.now(),
              ...form,
            }),
          }
        );

        alert("Payment Added");
      }

      // RELOAD FROM BACKEND
      loadPayments();

      // RESET FORM
      setForm({
        cardHolder: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
      });

      setEditId(null);

    } catch (error) {

      console.error(
        "Save failed",
        error
      );
    }
  };

  // =========================
  // DELETE PAYMENT
  // =========================
  const handleDelete = async (id) => {

    try {

      await fetch(
        `http://localhost:8080/payments/${id}`,
        {
          method: "DELETE",
        }
      );

      alert("Payment Deleted");

      loadPayments();

    } catch (error) {

      console.error(
        "Delete failed",
        error
      );
    }
  };

  // =========================
  // EDIT PAYMENT
  // =========================
  const handleEdit = (payment) => {

    setForm({

      cardHolder:
        payment.cardHolder,

      cardNumber:
        payment.cardNumber,

      expiry:
        payment.expiry,

      cvv:
        payment.cvv,
    });

    setEditId(payment.id);
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

          <button
            onClick={() =>
              navigate("/checkout")
            }
            className="logout-btn"
          >
            Back to Checkout
          </button>

        </div>

      </header>

      {/* MAIN */}
      <div className="checkout-container">

        {/* LEFT SIDE */}
        <div className="checkout-left">

          <h2>
            Saved Payments
          </h2>

          <input
            type="text"
            name="cardHolder"
            placeholder="Card Holder Name"
            value={
              form.cardHolder
            }
            onChange={handleChange}
          />

          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={
              form.cardNumber
            }
            onChange={handleChange}
          />

          <input
            type="text"
            name="expiry"
            placeholder="MM/YY"
            value={
              form.expiry
            }
            onChange={handleChange}
          />

          <input
            type="password"
            name="cvv"
            placeholder="CVV"
            value={
              form.cvv
            }
            onChange={handleChange}
          />

          <button
            onClick={handleSubmit}
          >
            {editId !== null
              ? "Update Payment"
              : "Add Payment"}
          </button>

        </div>

        {/* RIGHT SIDE */}
        <div className="checkout-right">

          <h2>
            Payment Methods
          </h2>

          {payments.length === 0 ? (

            <p>
              No saved payments
            </p>

          ) : (

            payments.map((item) => (

              <div
                key={item.id}
                className="address-card"
              >

                <h3>
                  {
                    item.cardHolder
                  }
                </h3>

                <p>
                  **** **** ****{" "}
                  {
                    item.cardNumber?.slice(
                      -4
                    )
                  }
                </p>

                <p>
                  Expiry:
                  {" "}
                  {
                    item.expiry
                  }
                </p>

                <div className="button-group">

                  <button
                    onClick={() =>
                      handleEdit(item)
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        item.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))
          )}

        </div>

      </div>
    </>
  );
}