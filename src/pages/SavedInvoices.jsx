import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/checkout.css";

export default function SavedInvoices() {

  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editNote, setEditNote] = useState("");

  // LOAD RECEIPTS FROM BACKEND
  const loadInvoices = async () => {

    try {

      const response = await fetch(
        "http://localhost:8080/receipts"
      );

      const data = await response.json();

      setInvoices(data);

    } catch (error) {

      console.error(
        "Failed to load invoices",
        error
      );

      setInvoices([]);
    }
  };

  useEffect(() => {

    loadInvoices();

  }, []);

  // DELETE RECEIPT
  const deleteInvoice = async (id) => {

    try {

      await fetch(
        `http://localhost:8080/receipts/${id}`,
        {
          method: "DELETE",
        }
      );

      loadInvoices();

    } catch (error) {

      console.error(
        "Delete failed",
        error
      );
    }
  };

  // START EDIT
  const startEdit = (invoice) => {

    setEditingId(invoice.orderId);

    setEditNote(invoice.note || "");
  };

  // UPDATE RECEIPT NOTE
  const updateInvoice = async (id) => {

    try {

      await fetch(
        `http://localhost:8080/receipts/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            note: editNote,
          }),
        }
      );

      setEditingId(null);

      loadInvoices();

    } catch (error) {

      console.error(
        "Update failed",
        error
      );
    }
  };

  return (

    <div className="checkout-container">

      <div className="checkout-box full-width">

        <h1>Payment Receipts</h1>

        {invoices.length === 0 ? (

          <p>No invoices found.</p>

        ) : (

          invoices.map((invoice) => (

            <div
              key={invoice.orderId}
              className="saved-item"
            >

              <p>
                <strong>Order ID:</strong>{" "}
                {invoice.orderId}
              </p>

              <p>
                <strong>Name:</strong>{" "}
                {invoice.user?.name || "N/A"}
              </p>

              <p>
                <strong>Payment:</strong>{" "}
                {invoice.payment?.method || "N/A"}
              </p>

              <p>
                <strong>Total:</strong>{" "}
                Rs. {invoice.total}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {invoice.createdAt
                  ? new Date(
                      invoice.createdAt
                    ).toLocaleString()
                  : "No Date"}
              </p>

              {/* NOTE SECTION */}
              {editingId === invoice.orderId ? (
                <>

                  <input
                    type="text"
                    value={editNote}
                    onChange={(e) =>
                      setEditNote(
                        e.target.value
                      )
                    }
                    placeholder="Update payment note"
                  />

                  <button
                    onClick={() =>
                      updateInvoice(
                        invoice.orderId
                      )
                    }
                  >
                    Update
                  </button>

                </>
              ) : (
                <>

                  <p>
                    <strong>Note:</strong>{" "}
                    {invoice.note || "No note"}
                  </p>

                  <div className="crud-buttons">

                    <button
                      onClick={() =>
                        startEdit(invoice)
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteInvoice(
                          invoice.orderId
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </>
              )}

            </div>
          ))
        )}

        <button
          className="primary-btn"
          onClick={() =>
            navigate("/checkout")
          }
        >
          Back to Checkout
        </button>

      </div>
    </div>
  );
}