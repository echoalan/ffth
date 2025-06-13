// src/pages/Empaques.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";  // Usamos useNavigate para redirigir
import Header from "../components/Header/Header";
import Paquetes from "../components/Paquetes/Paquetes";
import { verifyToken } from "../services/Login/authService"; // Servicio para verificar el token

const Empaques = () => {
  const navigate = useNavigate(); // Hook de React Router para redirigir

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");  // Si no hay token, redirigir al login
      return;
    }

    const checkAuth = async () => {
      const isTokenValid = await verifyToken(token);  // Verificamos el token
      if (!isTokenValid) {
        localStorage.removeItem("token"); // Limpiamos el token si no es válido
        navigate("/");  // Redirigimos al login si el token no es válido
        window.location.reload();  // Forzamos una recarga de la página
      }
    };

    checkAuth();
  }, [navigate]);  // Dependencia de `navigate` para asegurarnos de que se ejecute solo una vez

  return (
    <>
      <Header />
      <Paquetes />
    </>
  );
};

export default Empaques;
