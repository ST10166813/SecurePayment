import React, { useState } from "react";
import API from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await API.post("/auth/request-password-reset", { email });
      setMsg(res.data.message);
    } catch (err) {
      setMsg("Error sending reset link");
    }
  };

  return (
    <div className="auth-container">
      <h2>Password Reset</h2>
      <p>Enter your email to receive a reset link.</p>

      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Send Reset Link</button>
      </form>

      <p className="msg">{msg}</p>

      <p><a href="/login">Back to Login</a></p>
    </div>
  );
}
