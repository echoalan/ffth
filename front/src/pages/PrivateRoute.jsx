import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { verifyToken } from "../services/Login/authService"; // Importamos el servicio de validación

const PrivateRoute = () => {
  const [isValid, setIsValid] = useState(null);  // Estado local para verificar la autenticación

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Si no hay token, no está autenticado
    if (!token) {
      setIsValid(false);
      return;
    }

    const checkAuth = async () => {
      const isTokenValid = await verifyToken(token); // Verificamos el token
      if (isTokenValid) {
        setIsValid(true);
      } else {
        localStorage.removeItem("token"); // Limpiamos el token si no es válido
        setIsValid(false);
      }
    };

    checkAuth();
  }, []);

  // Mientras se está verificando, mostramos un loading.
  if (isValid === null) {
    return <div>Cargando...</div>;
  }

  // Si el token es válido, renderizamos las rutas protegidas, si no, redirigimos al login
  return isValid ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
