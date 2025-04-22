import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const isAuthenticated = () => {
  return Boolean(localStorage.getItem("jwtToken"));
};

const RouteProtect = ({ children }) => {
  const location = useLocation();

  return isAuthenticated() ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default RouteProtect;
