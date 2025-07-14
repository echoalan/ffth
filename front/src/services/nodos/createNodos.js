import API_URL  from '../API.js';

const createNodo = async (nodoData) => {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${API_URL}/nodos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(nodoData)
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error al crear nodo');
    }

    return await res.json();
  } catch (error) {
    console.error('Error al crear nodo:', error);
    throw error;
  }
};

export default createNodo;