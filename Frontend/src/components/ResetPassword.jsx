// import React, { useState, useEffect } from "react";
// import API from "../api";
// import { useSearchParams, useNavigate } from "react-router-dom";

// export default function ResetPassword() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//  const token = searchParams?.get("token") || "";
//  const email = searchParams?.get("email") || "";

//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [msg, setMsg] = useState("");

//   const submit = async (e) => {
//     e.preventDefault();

//     if (password !== confirm) {
//       return setMsg("Passwords do not match");
//     }

//     try {
//       const res = await API.post("/auth/reset-password", {
//         token,
//         email,
//         newPassword: password,
//       });
//       setMsg(res.data.message);
//       setTimeout(() => navigate("/login"), 2000);
//     } catch (err) {
//       setMsg(err.response?.data?.message || "Reset failed");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>Create New Password</h2>
//       <form onSubmit={submit}>
//         <input
//           type="password"
//           placeholder="New Password"
//           required
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Confirm New Password"
//           required
//           value={confirm}
//           onChange={(e) => setConfirm(e.target.value)}
//         />
//         <button type="submit">Reset Password</button>
//       </form>

//       <p className="msg">{msg}</p>

//       <p><a href="/login">Back to Login</a></p>
//     </div>
//   );
// }

import React, { useState } from "react";
import API from "../api";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./ResetPassword.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams?.get("token") || "";
  const email = searchParams?.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(""); // "success" | "error" | ""

  const submit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setMsg("Passwords do not match");
      setStatus("error");
      return;
    }

    try {
      const res = await API.post("/auth/reset-password", {
        token,
        email,
        newPassword: password,
      });
      setMsg(res.data.message || "Password reset successfully!");
      setStatus("success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Reset failed");
      setStatus("error");
    }
  };

  return (
    <div className="login-container" role="main" aria-labelledby="reset-title">
      <h2 id="reset-title">Create New Password</h2>
      <p className="login-subtitle">
        Choose a strong password you haven’t used before.
      </p>

      <form onSubmit={submit}>
        <label htmlFor="password">New password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter new password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="confirm">Confirm password</label>
        <input
          id="confirm"
          type="password"
          placeholder="Re-enter new password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button type="submit">Reset Password</button>
      </form>

      {msg && (
        <p className={`message ${status === "success" ? "success" : "error"}`}>
          {msg}
        </p>
      )}

      <p className="form-footer">
        <a href="/login">← Back to login</a>
      </p>
    </div>
  );
}