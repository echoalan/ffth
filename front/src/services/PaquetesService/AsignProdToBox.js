import URL_API from "../API";

const assignProductToBox = async (boxId, productId, quantity, priceType) => {
  try {
    const token = localStorage.getItem("token"); // Obtenemos el token

    const response = await fetch(`${URL_API}/boxes/${boxId}/assign-product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Añadimos el token en los encabezados
      },
      body: JSON.stringify({
        product_variant_id: productId,
        quantity: quantity,
        price_type: priceType,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al asignar el producto a la caja");
    }

    return data;
  } catch (error) {
    console.error("Error en assignProductToBox:", error);
    throw error;
  }
};

export default assignProductToBox;