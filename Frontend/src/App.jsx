import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import PaymentPage from "./components/PaymentPage";
import StaffPortal from "./components/StaffPortal";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const handleStorageChange = () => setRole(localStorage.getItem("role"));
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={() => setRole(localStorage.getItem("role"))} />}
        />
        <Route path="/payment" element={<PaymentPage />} />
        <Route
          path="/portal"
          element={
            role === "employee" ? <StaffPortal /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
