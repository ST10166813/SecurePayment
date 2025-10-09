// import React, { useState } from "react";
// import API from "../api";
// import "./RegisterPage.css";

// export default function RegisterPage() {
//   const [form, setForm] = useState({
//     fullName: "",
//     idNumber: "",
//     accountNumber: "",
//     email: "",
//     password: "",
//   });
//   const [message, setMessage] = useState("");

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await API.post("/auth/register", form);
//       setMessage(res.data.message);
//     } catch (error) {
//       setMessage(error.response?.data?.message || "Error registering user");
//     }
//   };

//   return (
//     <div className="register-container">
//       <h2>Customer Registration</h2>
//       <form onSubmit={handleSubmit}>
//         <input name="fullName" placeholder="Full Name" onChange={handleChange} required />
//         <input name="idNumber" placeholder="ID Number" onChange={handleChange} required />
//         <input name="accountNumber" placeholder="Account Number" onChange={handleChange} required />
//         <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
//         <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
//         <button type="submit">Register</button>
//       </form>
//       {message && <p className="message">{message}</p>}
//     </div>
//   );
// }

// RegisterPage.jsx (logic unchanged)
import React, { useState } from "react";
import API from "../api";
import "./RegisterPage.css";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "", idNumber: "", accountNumber: "", email: "", password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error registering user");
    }
  };

  return (
    <div className="register-container" role="main">
      <h2>Create your account</h2>
      <p className="register-subtitle">Quick setup to start using SecurePay</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="register-grid">
          <div>
            <label htmlFor="fullName">Full Name</label>
            <input id="fullName" name="fullName" placeholder="Jane Doe" onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="idNumber">ID Number</label>
            <input id="idNumber" name="idNumber" placeholder="e.g. 9001015800083" onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="accountNumber">Account Number</label>
            <input id="accountNumber" name="accountNumber" placeholder="123456789" onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" onChange={handleChange} required />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Create a strong password" onChange={handleChange} required />
          </div>
        </div>

        <button type="submit">Create account</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
