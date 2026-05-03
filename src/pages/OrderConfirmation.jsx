const order = JSON.parse(localStorage.getItem("latestOrder") || "{}");
import { useEffect, useState } from "react";
import "../styles/checkout.css";

export default function OrderConfirmation() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("latestOrder");
    if (data) {
      setOrder(JSON.parse(data));
    }
  }, []);

  if (!order) {
    return <div className="checkout-container">No Order Found</div>;
  }

  return (
    <>
      <header className="checkout-header">
        <div className="logo">
          LUXURY<span>BOOKS</span>
        </div>
      </header>

      <div className="checkout-container confirmation-center">

        <div className="confirmation-card">
          <h2>Order Placed Successfully!</h2>
          <p><strong>Order ID:</strong> #{order.orderId}</p>

          <p><strong>Name:</strong> {order.user?.name}</p>
          <p><strong>Phone:</strong> {order.user?.phone}</p>
          <p><strong>Address:</strong> {order.user?.address}</p>
          <p><strong>Payment:</strong> {order.payment?.method}</p>
          <p><strong>Delivery:</strong> {order.delivery?.type}</p>

          <h3 className="section-title">Items</h3>

          {order.items?.map((item, index) => (
            <p key={index}>
              {item.title} × {item.quantity}
            </p>
          ))}

          <h3 className="total-text">
          <p><strong>Total:</strong> Rs. {order.total ?? 0}</p>
          </h3>

          <p className="status-text">
            Status: Your Order has been <strong>PLACED</strong>
          </p>

          <p className="note-text">
            Expect your order the day after tomorrow.
          </p>

          <button onClick={() => window.open("/order-history", "_blank")}>
          Order History
          </button>

        </div>

      </div>
    </>
  );
}