import URL_API from "../API";

// Servicio para crear un nuevo paquete
const createBox = async (packageData) => {
  try {
    const token = localStorage.getItem("token"); // Obtener el token desde localStorage

    const response = await fetch(URL_API + '/boxes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Añadir el token en el encabezado
      },
      body: JSON.stringify(packageData),
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

export default createBox;