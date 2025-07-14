import React, { useState } from "react";

const BuscarCliente = () => {
    const [nombre, setNombre] = useState("");
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState("");

    const buscarCliente = async () => {
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
        <div>
            <div className="formGroupBuscarCliente">
                <input
                    type="text"
                    placeholder="Nombre del cliente"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
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
                        {resultado.map((cliente) => (
                            <div
                                className="dataClient"
                                key={cliente.id}
                                style={{ border: "1px solid #ccc", marginBottom: "10px", padding: "10px" }}
                            >
                                <p><strong>Nombre:</strong> {cliente.nombre}</p>
                                <p><strong>Dirección:</strong> {cliente.direccion}</p>
                                <p><strong>Plan:</strong> {cliente.plan}</p>
                                <p><strong>Usuario:</strong> {cliente.usuario}</p>
                                <p><strong>Fecha de inicio:</strong> {cliente.fecha_inicio}</p>
                                <p><strong>Caja ID:</strong> {cliente.caja_id !== null ? cliente.caja_id : "Sin caja asignada"}</p>
                                <button className="agregarCliente mb">Vincular a la caja</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default BuscarCliente;
