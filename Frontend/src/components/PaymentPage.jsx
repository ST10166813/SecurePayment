import React, { useState } from "react";
import API from "../api";
import "./PaymentPage.css";

export default function PaymentPage() {
  const [form, setForm] = useState({
    amount: "",
    currency: "",
    provider: "SWIFT",
    beneficiaryAccount: "",
    beneficiarySwift: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      amount: form.amount.trim(),
      currency: form.currency.trim().toUpperCase(),
      provider: form.provider.trim(),
      beneficiaryAccount: form.beneficiaryAccount.trim(),
      beneficiarySwift: form.beneficiarySwift.trim().toUpperCase(),
    };

    try {
      const res = await API.post("/payments/create", payload);
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div className="payment-container" role="main">
      <h2>International Payment</h2>
      <p className="payment-subtitle">Secure cross-border transfer via SWIFT</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="payment-grid">
          <div>
            <label htmlFor="amount">Amount</label>
            <input id="amount" name="amount" placeholder="1000.00" onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="currency">Currency</label>
            <input id="currency" name="currency" placeholder="USD / EUR / GBP" onChange={handleChange} required />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="beneficiaryAccount">Recipient Account</label>
            <input id="beneficiaryAccount" name="beneficiaryAccount" placeholder="Account number or IBAN" onChange={handleChange} required />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="beneficiarySwift">SWIFT Code</label>
            <input id="beneficiarySwift" name="beneficiarySwift" placeholder="e.g. ABSAZAJJ" onChange={handleChange} required />
          </div>
        </div>

        <button type="submit">Pay now</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
