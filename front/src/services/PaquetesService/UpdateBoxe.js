import URL_API from "../API";

const updateBoxe = async (data, id) => {
  try {
    const token = localStorage.getItem("token"); // Obtener el token desde localStorage

    const response = await fetch(`${URL_API}/boxes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Incluir el token en la cabecera
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al actualizar la caja:", error);
    throw error;
  }
};

export default updateBoxe;
