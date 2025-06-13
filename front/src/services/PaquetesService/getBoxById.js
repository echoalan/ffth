import URL_API from "../API";

const getBoxById = async (id) => {
  try {
    const token = localStorage.getItem("token"); // Obtener el token desde localStorage

    const response = await fetch(`${URL_API}/boxes/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Añadir el token en el encabezado
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener la caja.");
    }

    return await response.json();

  } catch (error) {
    console.log(error);
  }
};

export default getBoxById;
