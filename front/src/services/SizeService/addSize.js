import URL_API from "../API";

export default async function addSize(size) {

  const token = localStorage.getItem("token");

  const response = await fetch(`${URL_API}/talles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ size }),
  });

  if (!response.ok) {
    throw new Error("Error al agregar el talle");
  }

  return await response.json();
}
