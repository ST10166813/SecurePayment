import React, { useState } from "react";
import API from "../api";
import "./RegisterPage.css";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    idNumber: "",
    accountNumber: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
    <div className="register-container">
      <h2>Customer Registration</h2>
      <form onSubmit={handleSubmit}>
        <input name="fullName" placeholder="Full Name" onChange={handleChange} required />
        <input name="idNumber" placeholder="ID Number" onChange={handleChange} required />
        <input name="accountNumber" placeholder="Account Number" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
