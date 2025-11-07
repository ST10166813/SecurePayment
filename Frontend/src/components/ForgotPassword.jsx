// import React, { useState } from "react";
// import API from "../api";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [msg, setMsg] = useState("");

//   const submit = async (e) => {
//     e.preventDefault();
//     setMsg("");

//     try {
//       const res = await API.post("/auth/request-password-reset", { email });
//       setMsg(res.data.message);
//     } catch (err) {
//       setMsg("Error sending reset link");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>Password Reset</h2>
//       <p>Enter your email to receive a reset link.</p>

//       <form onSubmit={submit}>
//         <input
//           type="email"
//           placeholder="Enter your email"
//           value={email}
//           required
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <button type="submit">Send Reset Link</button>
//       </form>

//       <p className="msg">{msg}</p>

//       <p><a href="/login">Back to Login</a></p>
//     </div>
//   );
// }


import React, { useState } from "react";
import API from "../api";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(""); // "success" | "error" | ""

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setStatus("");

    try {
      const res = await API.post("/auth/request-password-reset", { email });
      const message = res?.data?.message || "Reset link sent to your email.";
      setMsg(message);
      setStatus("success");
    } catch (err) {
      setMsg("Error sending reset link");
      setStatus("error");
    }
  };

  return (
    <div className="login-container" role="main" aria-labelledby="reset-title">
      <h2 id="reset-title">Reset Password</h2>
      <p className="login-subtitle">
        Enter your email address and we’ll send you a reset link.
      </p>

      <form onSubmit={submit} noValidate>
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          inputMode="email"
        />

        <button type="submit">Send Reset Link</button>
      </form>

      {msg && (
        <p className={`message ${status === "success" ? "success" : "error"}`}>
          {msg}
        </p>
      )}

      <p className="form-footer">
        Remembered it? <a href="/login">Back to login</a>
      </p>
    </div>
  );
}