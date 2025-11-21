// src/pages/Products.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";  
import { verifyToken } from "../services/Login/authService"; 
import Header from "../components/Header";
import MapaComponent from "../components/Mapa/MapaComponent";
import Aside from "../components/Aside/Aside";
import VerClientes from "../components/Clientes/VerClientes";
import ClientesAltos from "../components/ClientesAltos/ClientesAltos";

const Products = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/"); 
      return;
    }

    const checkAuth = async () => {
      const isTokenValid = await verifyToken(token);  
      if (!isTokenValid) {
        localStorage.removeItem("token"); 
        navigate("/"); 
        window.location.reload(); 
      }
    };

    checkAuth();
  }, [navigate]);  

  return (
    <>
      <Header />
      <section className="containerContent">
        <VerClientes />
        <ClientesAltos/>
        <MapaComponent />
      </section>
    
    </>
  );
};

export default Products;
