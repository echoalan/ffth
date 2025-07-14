import URL_API from "../API";

export const loginUser = async (email, password) => {
    const url = `${URL_API}/login`; 
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
  
      return data.token; 
    } catch (error) {
      throw new Error(error.message || "Error de red");
    }
  };