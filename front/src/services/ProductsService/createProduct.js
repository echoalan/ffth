import URL_API from "../API";

const createProduct = async (formData) => {

  try {
    const token = localStorage.getItem("token"); // Obtenemos el token
    const headers = {
      Authorization: `Bearer ${token}`, // Incluimos el token en el encabezado
    };

    const response = await fetch(`${URL_API}/products`, {
      method: "POST",
      headers: headers,
      body: formData,
      
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al crear el producto.");
    }

    return data;
  } catch (error) {
    console.error("Error al crear el producto:", error);
    throw error;
  }
};

export default createProduct;
