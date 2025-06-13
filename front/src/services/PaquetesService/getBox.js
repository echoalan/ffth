import URL_API from "../API";

const getBox = async () => {
  try {
    const token = localStorage.getItem("token"); // Obtener el token desde localStorage

    const response = await fetch(URL_API + '/boxes', {
      headers: {
        'Authorization': `Bearer ${token}`, // Añadir el token en el encabezado
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener la caja');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.log(error);
  }
};

export default getBox;
