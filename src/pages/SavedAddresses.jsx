import { useEffect, useState } from "react";
import "../styles/checkout.css";

export default function SavedAddresses() {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("addresses")) || [];
    setAddresses(Array.isArray(data) ? data : []);
  }, []);

  const deleteAddress = (id) => {
    const updated = addresses.filter((item) => item.id !== id);
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
  };

  return (
    <div className="tax-container">
      <h2>Saved Addresses</h2>

      {addresses.length === 0 ? (
        <p>No saved addresses</p>
      ) : (
        addresses.map((item) => (
          <div key={item.id} className="tax-item">

            <p><strong>Address:</strong> {item.address}</p>
            

            <button
              className="tax-delete"
              onClick={() => deleteAddress(item.id)}
            >
              Delete
            </button>

          </div>
        ))
      )}
    </div>
  );
}