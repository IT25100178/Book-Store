import { useState } from "react";

export default function TaxPage() {
  const [records, setRecords] = useState(
    JSON.parse(localStorage.getItem("taxRecords") || "[]")
  );

  const deleteRecord = (index) => {
    const updated = records.filter((_, i) => i !== index);
    localStorage.setItem("taxRecords", JSON.stringify(updated));
    setRecords(updated);
  };

  return (
    <div style={{ padding: 40, color: "white", background: "black", minHeight: "100vh" }}>
      <h2>Saved Tax Records</h2>

      {records.length === 0 ? (
        <p>No records</p>
      ) : (
        records.map((item, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <p>Subtotal: Rs. {item.subtotal}</p>
            <p>Tax: Rs. {item.tax}</p>
            <p>{item.date}</p>

            <button onClick={() => deleteRecord(i)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}