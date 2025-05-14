// components/publicroute/PublicRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const userRole = decoded.role;

      const roleToDashboard = {
        Admin: "/admindashboard",
        "Sales Agent": "/salesdashboard",
      };

      // 👇 Redirect authenticated user to their dashboard
      return <Navigate to={roleToDashboard[userRole] || "/unauthorized"} replace />;
    } catch (err) {
      console.error("Token decode failed in PublicRoute:", err);
      localStorage.removeItem("token"); // bad token cleanup
    }
  }

  return children; // 👈 Allow access if no token
};

export default PublicRoute;
