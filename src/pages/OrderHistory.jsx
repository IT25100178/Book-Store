import { useEffect, useState } from "react";

export default function OrderHistory() {

  const [orders, setOrders] = useState([]);

  // LOAD ORDERS FROM BACKEND
  const loadOrders = async () => {

    try {

      const response = await fetch(
        "http://localhost:8080/orders"
      );

      const data = await response.json();

      setOrders(data);

    } catch (error) {

      console.error("Failed to load orders", error);

      setOrders([]);
    }
  };

  useEffect(() => {

    loadOrders();

  }, []);

  // DELETE ORDER
  const handleDelete = async (id) => {

    try {

      await fetch(
        `http://localhost:8080/orders/${id}`,
        {
          method: "DELETE",
        }
      );

      loadOrders();

    } catch (error) {

      console.error("Delete failed", error);
    }
  };

  return (

    <div className="checkout-container">

      <div
        className="checkout-left"
        style={{ width: "100%" }}
      >

        <h2>Order History</h2>

        {orders.length === 0 ? (

          <p>No orders yet</p>

        ) : (

          orders.map((order) => (

            <div
              key={order.orderId}
              className="order-card"
            >

              <p>
                <strong>Order ID:</strong>
                {" "}
                #{order.orderId}
              </p>

              <p>
                <strong>Date:</strong>
                {" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "No Date"}
              </p>

              <p>
                <strong>Total:</strong>
                {" "}
                Rs. {order.total}
              </p>

              <p>
                <strong>Payment:</strong>
                {" "}
                {order.payment?.method || "N/A"}
              </p>

              <p>
                <strong>Delivery:</strong>
                {" "}
                {order.delivery?.type || "N/A"}
              </p>

              <hr />

              <h4>Items</h4>

              {order.items?.map((item, i) => (

                <p key={i}>
                  {item.title} × {item.quantity}
                </p>

              ))}

              <button
                onClick={() =>
                  handleDelete(order.orderId)
                }
              >
                Delete History
              </button>

            </div>
          ))
        )}
      </div>
    </div>
  );
}