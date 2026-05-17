import { useEffect, useState } from "react";

export default function TaxPage() {

  const [records, setRecords] = useState([]);

  // LOAD TAXES
  const loadTaxes = async () => {

    try {

      const response = await fetch(
        "http://localhost:8080/tax"
      );

      const data = await response.json();

      setRecords(data);

    } catch (error) {

      console.log(error);

      alert("Backend Not Running");
    }
  };

  useEffect(() => {

    loadTaxes();

  }, []);

  // DELETE TAX
  const deleteRecord = async (index) => {

    try {

      const response = await fetch(
        `http://localhost:8080/tax/${index}`,
        {
          method: "DELETE",
        }
      );

      const message =
        await response.text();

      alert(message);

      loadTaxes();

    } catch (error) {

      console.log(error);

      alert("Delete Failed");
    }
  };

  return (

    <div
      style={{
        padding: 40,
        color: "white",
        background: "black",
        minHeight: "100vh",
      }}
    >

      <h1>Saved Tax Records</h1>

      {records.length === 0 ? (

        <p>No records</p>

      ) : (

        records.map((item, index) => (

          <div
            key={index}
            style={{
              marginBottom: 30,
              padding: 20,
              border: "1px solid #333",
              borderRadius: 10,
              background: "#111",
            }}
          >

            <p>
              <strong>Subtotal:</strong>
              {" "}Rs. {item.subtotal}
            </p>

            <p>
              <strong>Tax:</strong>
              {" "}Rs. {item.tax}
            </p>

            <p>
              <strong>Date:</strong>
              {" "}
              {item.date || "No Date"}
            </p>

            <button
              onClick={() =>
                deleteRecord(index)
              }
              style={{
                marginTop: 10,
                padding: 10,
                width: "100%",
                background: "gold",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Delete
            </button>

          </div>
        ))
      )}

    </div>
  );
}