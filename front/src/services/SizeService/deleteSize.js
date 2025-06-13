import URL_API from "../API";

export default async function deleteSize(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${URL_API}/sizes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al eliminar el talle");
  }

  return await response.json();
}
