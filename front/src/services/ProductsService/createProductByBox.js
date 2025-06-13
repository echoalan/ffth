import URL_API from "../API";

const createProductByBox = async (prodData) => {

  try {

    const token = localStorage.getItem("token"); // Obtenemos el token
    const headers = {
      Authorization: `Bearer ${token}`, // Incluimos el token en el encabezado
    };


    const response = await fetch(URL_API + '/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        headers,
      },
      body: JSON.stringify(prodData),
    });

    if (!response.ok) {
      throw new Error('Error al crear el paquete');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al crear el paquete:", error);
  }
};

export default createProductByBox;
