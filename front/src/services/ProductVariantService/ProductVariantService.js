import URL_API from "../API";

const addVariant = async (data) => {
  try {
    const token = localStorage.getItem("token"); // Obtener el token desde localStorage

    const response = await fetch(`${URL_API}/product-variants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Incluir el token en los encabezados
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors || "Error al agregar variante.");
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Error en addVariant:", error.message);
    throw error;
  }
};

export default addVariant;
