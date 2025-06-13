import URL_API from "../API";

export const loginUser = async (email, password) => {
    const url = `${URL_API}/login`;  // Cambiar a la URL de tu API
    const headers = {
      "Content-Type": "application/json",
    };
  
    const body = JSON.stringify({
      email,
      password,
    });
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: body,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }
  
      return data.token; // Retorna el token si todo sale bien
    } catch (error) {
      throw new Error(error.message || "Error de red");
    }
  };