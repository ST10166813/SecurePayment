import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import PaymentPage from "./components/PaymentPage";
import StaffPortal from "./components/StaffPortal"; // 👈 We'll create this next

function App() {
  const role = localStorage.getItem("role"); // 👈 get user role from storage

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/payment" element={<PaymentPage />} />

        {/* Only employees can access the Staff Portal */}
        <Route
          path="/portal"
          element={
            role === "employee" ? (
              <StaffPortal />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;