import URL_API from "../API";

const editVariante = async (id, data) => {
  try {
    const token = localStorage.getItem("token"); // Obtener el token desde localStorage

    const response = await fetch(`${URL_API}/variant/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Incluir el token en los encabezados
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error al actualizar la variante");
    }

    return result;

  } catch (error) {
    console.error("Error en editVariante:", error);
    throw error; // Lanza el error para que el frontend lo capture
  }
};

export default editVariante;
