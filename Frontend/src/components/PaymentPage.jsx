// import React, { useState } from "react";
// import API from "../api";
// import "./PaymentPage.css";

// export default function PaymentPage() {
//   const [form, setForm] = useState({
//     amount: "",
//     currency: "",
//     provider: "SWIFT",
//     recipientAccount: "",
//     swiftCode: "",
//   });
//   const [message, setMessage] = useState("");

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   // Clean and normalize input
//   const payload = {
//     amount: form.amount.trim(),
//     currency: form.currency.trim().toUpperCase(),
//     provider: form.provider.trim(),
//     recipientAccount: form.recipientAccount.trim(),
//     swiftCode: form.swiftCode.trim().toUpperCase(),
//   };

//   try {
//     const res = await API.post("/payments", payload);
//     setMessage(res.data.message);
//   } catch (error) {
//     setMessage(error.response?.data?.message || "Payment failed");
//   }
// };


//   return (
//     <div className="payment-container">
//       <h2>Make an International Payment</h2>
//       <form onSubmit={handleSubmit}>
//         <input name="amount" placeholder="Amount" onChange={handleChange} required />
//         <input name="currency" placeholder="Currency (e.g. USD, EUR, GBP)" onChange={handleChange} required />
//         <input name="recipientAccount" placeholder="Recipient Account" onChange={handleChange} required />
//         <input name="swiftCode" placeholder="SWIFT Code" onChange={handleChange} required />
//         <button type="submit">Pay Now</button>
//       </form>
//       {message && <p className="message">{message}</p>}
//     </div>
//   );
// }

// PaymentPage.jsx (logic unchanged except markup labels)
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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      amount: form.amount.trim(),
      currency: form.currency.trim().toUpperCase(),
      provider: form.provider.trim(),
      recipientAccount: form.recipientAccount.trim(),
      swiftCode: form.swiftCode.trim().toUpperCase(),
    };

    try {
      const res = await API.post("/payments", payload);
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
            {/* You can swap the input above with a <select> if you prefer */}
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="recipientAccount">Recipient Account</label>
            <input id="recipientAccount" name="recipientAccount" placeholder="Account number or IBAN" onChange={handleChange} required />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="swiftCode">SWIFT Code</label>
            <input id="swiftCode" name="swiftCode" placeholder="e.g. ABSAZAJJ" onChange={handleChange} required />
          </div>
        </div>

        <button type="submit">Pay now</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
