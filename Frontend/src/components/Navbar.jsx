// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./Navbar.css";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <nav className="navbar">
//       <h2>SecurePay</h2>
//       <div>
//         {token ? (
//           <>
//             <Link to="/payment">Make Payment</Link>
//             <button onClick={handleLogout}>Logout</button>
//           </>
//         ) : (
//           <>
//             <Link to="/register">Register</Link>
//             <Link to="/login">Login</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

// Navbar.jsx (logic unchanged)
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Primary">
      <div className="brand">
        <h2>SecurePay</h2>
        <span className="badge">v1.0</span>
      </div>
      <div className="actions">
        {token ? (
          <>
            <Link to="/payment">Make Payment</Link>
            <button onClick={handleLogout} aria-label="Log out">Logout</button>
          </>
        ) : (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}

