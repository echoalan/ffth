import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { verifyToken } from "../services/Login/authService";

const PrivateRoute = () => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsValid(false);
      return;
    }

    const checkAuth = async () => {
      const isTokenValid = await verifyToken(token);
      if (isTokenValid) {
        setIsValid(true);
      } else {
        localStorage.removeItem("token");
        setIsValid(false);
      }
    };

    checkAuth();
  }, []);

  if (isValid === null) {
    return <div>Cargando...</div>;
  }

  return isValid ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
