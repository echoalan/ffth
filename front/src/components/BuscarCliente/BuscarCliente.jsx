import React, { useState } from "react";

const BuscarCliente = ({ nodo }) => {
  const [nombre, setNombre] = useState("");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  const buscarCliente = async () => {

    console.log(nodo.id)

    if (!nombre.trim()) {
      setError("Debes ingresar un nombre.");
      setResultado(null);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/clientes/buscar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre }),
      });

      const data = await response.json();

      console.log(data)

      if (!response.ok) {
        setError(data.error || data.message || "Error desconocido.");
        setResultado(null);
      } else {
        setResultado(data.data);
        setError("");
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
      setResultado(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      buscarCliente();
    }
  };

  return (
    <div className="casperFormAdddClient">
      <div className="formGroupBuscarCliente">
        <input
          type="text"
          placeholder="Nombre del cliente"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              buscarCliente();
            }
          }}
        />
        <button className="buscarClientBtn" onClick={buscarCliente}>
          Buscar
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {resultado && (
        <div className="containerResultadoBuscarCliente">
          <h3 className="totalEncontrados">Total encontrados: {resultado.length}</h3>

          <div className="resultadoBuscarCliente">
            {resultado.map((cliente, index) => (
              <div
                className="dataClient"
                key={index}
              >
                <p><strong>Nombre:</strong> {cliente.nombre}</p>
                <p><strong>Dirección:</strong> {cliente.direccion || "No disponible"}</p>
                <p><strong>Plan:</strong> {cliente.plan || "No disponible"}</p>
                <p><strong>Usuario:</strong> {cliente.usuario}</p>
                <p><strong>Fecha de inicio:</strong> {cliente.fecha_inicio || "No disponible"}</p>

                {/* Datos de la ONU */}
                <div
                className="dataONU"
                  style={{

                    
                    backgroundColor: (() => {
                      if (cliente.status !== "Online") return "#f28c8c"; // rojo si está offline
                      const rx = parseFloat(cliente.rx_power);
                      if (rx >= -29 && rx <= -19) return "#d4f8d4"; // verde óptimo
                      if ((rx >= -31 && rx < -29) || (rx > -19 && rx <= -17)) return "#fff4c2"; // naranja cercano
                      return "#ffe5b4"; // naranja fuera del rango
                    })(),
                    color: "#333"
                  }}
                >
                  <p><strong>Serial ONU:</strong> {cliente.serial_number || "No asignada, o cambiada sin registrar"}</p>
                  <p><strong>Rx Power:</strong> {cliente.rx_power || "-"}</p>
                  <p><strong>Tx Power:</strong> {cliente.tx_power || "-"}</p>
                  <p><strong>Temperatura ONU:</strong> {cliente.temperature + " °C" || "No disponible"}</p>
                  <p><strong>Status ONU:</strong> {cliente.status || "Offline"}</p>
                </div>

                <button
                  className="agregarCliente mb"
                  onClick={async () => {
                    const token = localStorage.getItem("token");

                    try {
                      const response = await fetch("http://127.0.0.1:8000/api/clientes/asignar-caja", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          cliente_id: cliente.id, // asumimos que cada cliente tiene id
                          caja_id: nodo.id
                        }),
                      });

                      const data = await response.json();

                      if (response.ok) {
                        alert("Caja vinculada correctamente.");
                        // opcional: actualizar el estado local para reflejar el cambio
                        setResultado(prev => prev.map(c =>
                          c.id === cliente.id ? { ...c, caja_id: nodo.id } : c
                        ));
                      } else {
                        alert(data.error || "Error al vincular la caja.");
                      }
                    } catch (err) {
                      alert("Error de conexión con el servidor.");
                    }
                  }}
                >
                  Vincular a la caja
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default BuscarCliente;
