import URL_API from "../API";

const getColores = async () => {
  try {
    const token = localStorage.getItem("token"); // Obtenemos el token

    // Preparamos los encabezados con el token
    const headers = {
      Authorization: `Bearer ${token}`, // Incluimos el token en el encabezado
    };

    // Realizamos la solicitud con los encabezados
    const response = await fetch(`${URL_API}/colores`, {
      method: 'GET',
      headers: headers, // Añadimos los encabezados a la solicitud
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener los colores');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.log(error); // Imprimimos el error si algo falla
    return { message: error.message }; // Retornamos el mensaje de error
  }
}

export default getColores;