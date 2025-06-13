import URL_API from "../API";

const createSeller = async (sellerData) => {
  try {
    const token = localStorage.getItem("token"); // Obtener el token desde localStorage

    const response = await fetch(`${URL_API}/sellers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Incluir el token en los encabezados
      },
      body: JSON.stringify(sellerData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear el vendedor');
    }

    const data = await response.json();
    return data.seller; // Asegúrate de que la respuesta contenga el objeto del vendedor creado
  } catch (error) {
    return { message: error.message };
  }
}

export default createSeller;
