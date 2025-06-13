import URL_API from "../API";

const editProduct = async (idProduct, name, description) => {
  try {

    const token = localStorage.getItem("token"); // Obtenemos el token
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${URL_API}/products/${idProduct}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // este va directamente acá
      },
      body: JSON.stringify({ name, description }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al actualizar el producto");
    }

    return data; // devolvés la respuesta al componente que lo llamó
  } catch (error) {
    console.error("Error al actualizar:", error.message);
    throw error; // para que el componente pueda manejar el error
  }
};

export default editProduct;