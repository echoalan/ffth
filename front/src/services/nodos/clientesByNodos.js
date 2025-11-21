import API_URL from "../API.js";

export async function clientesByNodos(cajaId) {
  try {
    const response = await fetch(`${API_URL}/nodos/${cajaId}/clientes`);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // lista de clientes
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    throw error;
  }
}
