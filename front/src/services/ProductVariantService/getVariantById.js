import URL_API from "../API";

const getVariantById = async (id) => {
  try {
    const token = localStorage.getItem("token"); // Obtener el token desde localStorage

    const response = await fetch(`${URL_API}/product-variants/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`, // Incluir el token en los encabezados
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al obtener la variante");
    }

    return data;

  } catch (error) {
    console.log("Error en getVariantById:", error);
    throw error; // Lanza el error para que el frontend lo capture
  }
};

export default getVariantById;
