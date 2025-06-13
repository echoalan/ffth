import URL_API from "../API";

const getSizes = async () => {
  try {
    const token = localStorage.getItem("token"); // Obtener el token desde localStorage

    const response = await fetch(`${URL_API}/talles`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Incluir el token en los encabezados
      }
    });

    const data = await response.json();

    return data;

  } catch (error) {
    console.log(error);
  }
}

export default getSizes;
