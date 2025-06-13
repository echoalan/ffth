import React, { useState } from "react";
import { loginUser } from "../services/Login/Login";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  // Hook de navegación

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");  // Resetea el error en cada intento

    try {
      const token = await loginUser(email, password);
      localStorage.setItem("token", token);  // Guardamos el token
      setLoading(false);
      navigate("/products");  // Redirige a /products o la página principal
    } catch (error) {
      setLoading(false);
      setError(error.message); // Mostrar el error en caso de fallo
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Ingresar"}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
