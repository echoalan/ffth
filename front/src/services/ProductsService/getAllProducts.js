import URL_API from "../API";

const getAllProducts = async () => {
  try {
    const token = localStorage.getItem("token"); // Obtenemos el token
    const headers = {
      Authorization: `Bearer ${token}`, // Incluimos el token en el encabezado
    };

    const response = await fetch(`${URL_API}/products`, {
      method: 'GET',
      headers: headers, // Añadimos los encabezados a la solicitud
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener los productos');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    return { message: error.message }; // Retornamos el error si algo falla
  }
};

export default getAllProducts;
