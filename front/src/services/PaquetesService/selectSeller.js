import URL_API from "../API";

const assignSellerToBox = async (box_id, seller_id) => {
  try {
    const token = localStorage.getItem("token"); // Obtener el token desde localStorage

    const response = await fetch(`${URL_API}/boxes/${box_id}/assignSeller`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Añadir el token en los encabezados
      },
      body: JSON.stringify({ seller_id }), // Enviamos el seller_id en el cuerpo de la solicitud
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al asignar el vendedor al box');
    }

    return data;

  } catch (error) {
    throw new Error(error.message || 'Error al asignar el vendedor al box');
  }
};

export default assignSellerToBox;
