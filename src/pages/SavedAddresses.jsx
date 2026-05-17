import React, { useEffect, useState } from "react";
import "../styles/checkout.css";

export default function SavedAddresses() {

  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] =
    useState(null);

  const [editId, setEditId] =
    useState(null);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  // LOAD ADDRESSES
  const loadAddresses = async () => {

    try {

      const response = await fetch(
        "http://localhost:8080/addresses"
      );

      const data = await response.json();

      setAddresses(data);

    } catch (error) {

      console.log(error);

      alert("Backend Not Running");
    }
  };

  useEffect(() => {

    loadAddresses();

  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // SAVE OR UPDATE
  const handleSubmit = async () => {

    try {

      const method =
        editId !== null ? "PUT" : "POST";

      const url =
        editId !== null
          ? `http://localhost:8080/addresses/${editId}`
          : "http://localhost:8080/addresses";

      const response = await fetch(url, {

        method,

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          ...form,
          id:
            editId !== null
              ? editId
              : Date.now(),
        }),
      });

      const message =
        await response.text();

      alert(message);

      setForm({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
      });

      setEditId(null);

      loadAddresses();

    } catch (error) {

      console.log(error);

      alert("Backend Not Running");
    }
  };

  // DELETE
  const handleDelete = async (id) => {

    try {

      await fetch(
        `http://localhost:8080/addresses/${id}`,
        {
          method: "DELETE",
        }
      );

      loadAddresses();

    } catch (error) {

      console.log(error);

      alert("Delete Failed");
    }
  };

  // EDIT
  const handleEdit = (item) => {

    setEditId(item.id);

    setForm({
      fullName: item.fullName,
      phone: item.phone,
      address: item.address,
      city: item.city,
      postalCode: item.postalCode,
    });
  };

  // SELECT ADDRESS
  const selectAddress = (item) => {

    setSelectedAddress(item);

    // SEND TO CHECKOUT PAGE
    localStorage.setItem(
      "selectedAddress",
      JSON.stringify(item)
    );

    alert("Address Selected");
  };

  return (
    <div className="checkout-container">

      {/* LEFT SIDE */}

      <div className="checkout-left">

        <h2>Saved Addresses</h2>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />

        <textarea
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
        />

        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={form.postalCode}
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>

          {editId !== null
            ? "Update Address"
            : "Save Address"}

        </button>

      </div>

      {/* RIGHT SIDE */}

      <div className="checkout-right">

        <h2>Address List</h2>

        {addresses.length === 0 ? (

          <p>No Addresses</p>

        ) : (

          addresses.map((item) => (

            <div
              key={item.id}
              className="address-card"
            >

              <h3>
                {item.fullName}
              </h3>

              <p>
                {item.phone}
              </p>

              <p>
                {item.address}
              </p>

              <p>
                {item.city}
              </p>

              <p>
                {item.postalCode}
              </p>

              <div
                className="button-group"
              >

                <button
                  onClick={() =>
                    selectAddress(item)
                  }
                >
                  Use
                </button>

                <button
                  onClick={() =>
                    handleEdit(item)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(item.id)
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
  );
}