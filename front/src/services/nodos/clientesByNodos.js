const API_URL = "http://127.0.0.1:8000/api/nodos"; // ajustalo según tu backend

export async function clientesByNodos(cajaId) {
  try {
    const response = await fetch(`${API_URL}/${cajaId}/clientes`);

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
