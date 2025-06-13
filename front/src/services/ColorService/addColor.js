import URL_API from "../API";

export default async function addColor(color) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(`${URL_API}/colores`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ color }),
  });

  if (!response.ok) {
    throw new Error("Error al agregar el color");
  }

  return await response.json();
}