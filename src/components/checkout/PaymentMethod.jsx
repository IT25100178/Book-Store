const PaymentMethod = ({ payment = "", setPayment = () => {} }) => {
  return (
    <div>
      <h2>Payment Method</h2>

      <label>
        <input
          type="radio"
          checked={payment === "COD"}
          onChange={() => setPayment("COD")}
        />
        Cash on Delivery
      </label>

      <label>
        <input
          type="radio"
          checked={payment === "Online"}
          onChange={() => setPayment("Online")}
        />
        Online Payment
      </label>
    </div>
  );
};

export default PaymentMethod;