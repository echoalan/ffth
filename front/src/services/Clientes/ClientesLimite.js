import URL_API from "../API";

const fetchClientesLimite = async (page = 1) => {
  try {
    const response = await fetch(`${URL_API}/clientes/limite?page=${page}`);

    if (!response.ok) {
      throw new Error("Error al obtener clientes al límite");
    }

    const data = await response.json();
    return data.data; // 👈 acá viene: data, current_page, last_page, etc.
  } catch (error) {
    console.log("Error en fetchClientesLimite:", error);
    return null;
  }
};

export default fetchClientesLimite;
