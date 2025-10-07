import React, { useState } from "react";
import API from "../api";
import "./PaymentPage.css";

export default function PaymentPage() {
  const [form, setForm] = useState({
    amount: "",
    currency: "",
    provider: "SWIFT",
    recipientAccount: "",
    swiftCode: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/payments", form);
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div className="payment-container">
      <h2>Make an International Payment</h2>
      <form onSubmit={handleSubmit}>
        <input name="amount" placeholder="Amount" onChange={handleChange} required />
        <input name="currency" placeholder="Currency (e.g. USD, EUR, GBP)" onChange={handleChange} required />
        <input name="recipientAccount" placeholder="Recipient Account" onChange={handleChange} required />
        <input name="swiftCode" placeholder="SWIFT Code" onChange={handleChange} required />
        <button type="submit">Pay Now</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
