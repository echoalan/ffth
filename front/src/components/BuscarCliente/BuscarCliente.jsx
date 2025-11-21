import React, { useState } from "react";
import RxIndicator from "../RxIndicator/RxIndicator";
import URL_API from "../../services/API";


const BuscarCliente = ({ nodo, onSuccess }) => {
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
      const response = await fetch(`${URL_API}/clientes/buscar?nombre=${nombre}`, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();

      console.log(data)

      console.log('aver')

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
                <div className="dataONU">
                  <p><strong>Serial ONU:</strong> {cliente.serial_number || "No asignada, o cambiada sin registrar"}</p>

                  {/* 🚦 Aquí va tu RxIndicator genérico */}
                  <RxIndicator rx={cliente.rx_power} status={cliente.status} />

                  <p><strong>Tx Power:</strong> {cliente.tx_power || "-"}</p>
                  <p><strong>Temperatura ONU:</strong> {cliente.temperature + " °C" || "No disponible"}</p>
                  <p><strong>Status ONU:</strong> {cliente.status || "Offline"}</p>
                </div>

                <button
                  className="agregarCliente mb"
                  onClick={async () => {
                    const token = localStorage.getItem("token");

                    try {
                      const response = await fetch(`${URL_API}/clientes/asignar-caja`, {
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
                        if (onSuccess) onSuccess();
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
