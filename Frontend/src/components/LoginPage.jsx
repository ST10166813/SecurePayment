// import React, { useState } from "react";
// import API from "../api";
// import "./LoginPage.css";
// import { useNavigate } from "react-router-dom";

// export default function LoginPage() {
//   const [form, setForm] = useState({
//     email: "",
//     accountNumber: "",
//     password: "",
//   });
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await API.post("/auth/login", form);
//       localStorage.setItem("token", res.data.token);
//       setMessage("Login successful!");
//       navigate("/payment");
//     } catch (error) {
//       setMessage(error.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Customer Login</h2>
//       <form onSubmit={handleSubmit}>
//         <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
//         <input name="accountNumber" placeholder="Account Number" onChange={handleChange} required />
//         <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
//         <button type="submit">Login</button>
//       </form>
//       {message && <p className="message">{message}</p>}
//     </div>
//   );
// }

// LoginPage.jsx (only markup structure updated – same logic)
import React, { useState } from "react";
import API from "../api";
import "./LoginPage.css";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage({ onLoginSuccess }) {
  const [form, setForm] = useState({ email: "", accountNumber: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      setMessage("Login successful!");
      if (onLoginSuccess) onLoginSuccess(); // 👈 update App state

      if (res.data.role === "employee") {
        navigate("/portal");
      } else {
        navigate("/payment");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container" role="main">
      <h2>Welcome back</h2>
      <p className="login-subtitle">Sign in to continue to SecurePay</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="accountNumber">Account Number</label>
            <input id="accountNumber" name="accountNumber" placeholder="e.g. 123456789" onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
          </div>
        </div>

        <button type="submit">Sign in</button>
        <p style={{ marginTop: "10px" }}>
  <a href="/forgot-password" style={{ color: "#007bff" }}>
    Forgot Password?
  </a>
</p>
      </form>

      {message && (
        <p className={`message ${/success/i.test(message) ? "success" : "error"}`}>
          {message}
        </p>
      )}

      <p className="form-footer">
        New to SecurePay? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}

