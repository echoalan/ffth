import URL_API from "../API";

export default async function deleteColor(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${URL_API}/colores/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al eliminar el color");
  }

  return await response.json();
}