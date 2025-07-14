import URL_API from "../API";


export const verifyToken = async (token) => {
  if (!token) {
    return false;
  }

  try {
    const response = await fetch(`${URL_API}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return false; 
    }

    return true; 
  } catch (error) {
    console.error("Error verificando el token:", error);
    return false; 
  }
};
