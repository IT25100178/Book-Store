import { useEffect, useState } from "react";
import "../styles/checkout.css";

export default function OrderConfirmation() {

  const [orders, setOrders] = useState([]);

  // =========================
  // LOAD ORDERS
  // =========================
  useEffect(() => {

    loadOrders();

  }, []);

  const loadOrders = async () => {

    try {

      const response = await fetch(
        "http://localhost:8080/orders"
      );

      if (!response.ok) {

        alert("Failed To Load Orders");

        return;
      }

      const data = await response.json();

      setOrders(data);

    } catch (error) {

      console.log(error);

      alert("Backend Not Running");
    }
  };

  // =========================
  // DELETE ORDER
  // =========================
  const deleteOrder = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this order?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      const response = await fetch(
        `http://localhost:8080/orders/${id}`,
        {
          method: "DELETE",
        }
      );

      const message =
        await response.text();

      alert(message);

      loadOrders();

    } catch (error) {

      console.log(error);

      alert("Delete Failed");
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

      </header>

      {/* MAIN */}
      <div className="advanced-orders-container">

        <div className="advanced-orders-header">

          <h1>
            📦 Order History
          </h1>

          <p>
            View all your placed
            orders with complete
            details
          </p>

        </div>

        {orders.length === 0 ? (

          <div className="empty-orders">

            <h2>
              No Orders Found
            </h2>

            <p>
              Your placed orders
              will appear here.
            </p>

          </div>

        ) : (

          <div className="advanced-orders-grid">

            {orders.map((item) => (

              <div
                key={item.orderId}
                className="advanced-order-card"
              >

                {/* TOP */}
                <div className="order-top">

                  <div>

                    <h2>
                      Order #
                      {item.orderId}
                    </h2>

                    <span className="order-status">
                      COMPLETED
                    </span>

                  </div>

                  <div className="order-date">

                    {item.createdAt}

                  </div>

                </div>

                {/* CUSTOMER */}
                <div className="order-section">

                  <h3>
                    👤 Customer Details
                  </h3>

                  <div className="info-grid">

                    <div>
                      <span>
                        Full Name
                      </span>

                      <strong>
                        {
                          item.customerName
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        Phone
                      </span>

                      <strong>
                        {item.phone}
                      </strong>
                    </div>

                    <div>
                      <span>
                        City
                      </span>

                      <strong>
                        {item.city}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Postal Code
                      </span>

                      <strong>
                        {
                          item.postalCode
                        }
                      </strong>
                    </div>

                  </div>

                  <div className="full-address">

                    <span>
                      Address
                    </span>

                    <strong>
                      {item.address}
                    </strong>

                  </div>

                </div>

                {/* PAYMENT */}
                <div className="order-section">

                  <h3>
                    💳 Payment
                  </h3>

                  <div className="payment-box">

                    {
                      item.paymentMethod
                    }

                  </div>

                </div>

                {/* ITEMS */}
                <div className="order-section">

                  <h3>
                    📚 Ordered Books
                  </h3>

                  {item.items &&
                  item.items.length >
                    0 ? (

                    item.items.map(
                      (
                        book,
                        index
                      ) => (

                        <div
                          key={index}
                          className="book-item"
                        >

                          <div>

                            <h4>
                              {
                                book.title
                              }
                            </h4>

                            <p>
                              Quantity:
                              {
                                book.quantity
                              }
                            </p>

                          </div>

                          <div className="book-price">

                            Rs.
                            {
                              book.price
                            }

                          </div>

                        </div>
                      )
                    )

                  ) : (

                    <div className="no-items">

                      No Items Found

                    </div>

                  )}

                </div>

                {/* TOTAL */}
                <div className="price-summary">

                  <div>

                    <span>
                      Subtotal
                    </span>

                    <strong>
                      Rs.
                      {
                        item.subtotal
                      }
                    </strong>

                  </div>

                  <div>

                    <span>
                      Tax
                    </span>

                    <strong>
                      Rs.
                      {item.tax}
                    </strong>

                  </div>

                  <div className="grand-total">

                    <span>
                      Total
                    </span>

                    <h1>
                      Rs.
                      {
                        item.total
                      }
                    </h1>

                  </div>

                </div>

                {/* ACTION */}
                <button
                  className="advanced-delete-btn"
                  onClick={() =>
                    deleteOrder(
                      item.orderId
                    )
                  }
                >
                  Delete This Order History
                </button>

              </div>
            ))}

          </div>
        )}

      </div>
    </>
  );
}