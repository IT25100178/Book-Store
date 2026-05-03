import { useEffect, useState } from "react";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);

  // LOAD ORDERS
  const loadOrders = () => {
    const data = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(data);
  };

  useEffect(() => {
    loadOrders();


    window.addEventListener("storage", loadOrders);

    return () => {
      window.removeEventListener("storage", loadOrders);
    };
  }, []);

  // DELETE ORDER
  const handleDelete = (id) => {
    const updated = orders.filter((o) => o.orderId !== id);
    localStorage.setItem("orders", JSON.stringify(updated));
    setOrders(updated);
  };

  return (
    <div className="checkout-container">
      <div className="checkout-left" style={{ width: "100%" }}>
        <h2>Order History</h2>

        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          orders.map((order) => (
            <div key={order.orderId} className="order-card">
              <p><strong>Order ID:</strong> #{order.orderId}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Total:</strong> Rs. {order.total}</p>
              <p><strong>Payment:</strong> {order.payment?.method}</p>
              <p><strong>Delivery:</strong> {order.delivery?.type}</p>

              <hr />

              <h4>Items</h4>
              {order.items.map((item, i) => (
                <p key={i}>
                  {item.title} × {item.quantity}
                </p>
              ))}

              <button onClick={() => handleDelete(order.orderId)}>
                Delete History
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}