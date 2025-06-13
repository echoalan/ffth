import URL_API from "../API";

// Servicio para eliminar un paquete
const deleteBox = async (boxId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${URL_API}/boxes/${boxId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    // Tiramos el error real que manda el servidor
    throw new Error(data.message || 'Error al eliminar el paquete');
  }

  return data;
};


export default deleteBox;
