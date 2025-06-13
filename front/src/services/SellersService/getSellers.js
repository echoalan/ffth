import URL_API from "../API";

const getAllSellers = async () => {
  try {
    const token = localStorage.getItem("token"); // Obtener el token desde localStorage

    const response = await fetch(`${URL_API}/sellers`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Incluir el token en los encabezados
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener los vendedores');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    return { message: error.message };
  }
}

export default getAllSellers;
