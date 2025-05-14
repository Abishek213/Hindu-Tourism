import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  // Redirect to login if no token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role;

    // If user is allowed, show the page
    if (allowedRoles.includes(userRole)) {
      return children;
    }

    // Redirect unauthorized user to their respective dashboard
    const roleToDashboard = {
      Admin: "/admindashboard",
      "Sales Agent": "/salesdashboard",
    };

    return <Navigate to={roleToDashboard[userRole] || "/login"} replace />;
  } catch (error) {
    console.error("Token decoding failed:", error);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
