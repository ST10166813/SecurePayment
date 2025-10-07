import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import PaymentPage from "./components/PaymentPage";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
         <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
