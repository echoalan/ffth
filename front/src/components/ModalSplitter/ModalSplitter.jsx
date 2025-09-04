import { useEffect, useState } from 'react';
import { clientesByNodos } from '../../services/nodos/clientesByNodos';
import AgregarCliente from '../AgregarCliente/AgregarCliente';

const ModalSplitter = ({ onClose, nodo }) => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await clientesByNodos(nodo.id); // 🔹 pedir clientes de la caja
        setClientes(data);
      } catch (err) {
        console.error("Error cargando clientes:", err);
      } finally {
        setLoading(false);
      }
    };

    if (nodo?.id) fetchClientes();
  }, [nodo]);

  return (
    <article className="articleSplitters">
      <div className="containterBtnClose">
        <h2>{nodo.tipo}</h2>
        <button className="btnCloseModal" onClick={onClose}>Cerrar</button>
      </div>
      <div className="containerClientesSplitter">
        
      {nodo.tipo === 'Splitter1x4' && (
        <div>
          <p>Este es un splitter 1x4.</p>
        </div>
      )}



      {loading ? (
        <p>Cargando clientes...</p>
      ) : clientes.length > 0 ? (
        <div className="clientesConectados">
          <h2>Clientes Conectados:</h2>
          {loading ? (
            <p>Cargando clientes...</p>
          ) : clientes.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "5px" }}>
              {clientes.map((c) => {
                const rx = parseFloat(c.rx_power);
                let color;

                if (c.status !== "Online") color = "#f28c8c"; // rojo offline
                else if (rx >= -29 && rx <= -19) color = "#4CAF50"; // verde óptimo
                else if ((rx >= -31 && rx < -29) || (rx > -19 && rx <= -17)) color = "#FFC107"; // amarillo cercano
                else color = "#FF9800"; // naranja fuera de rango

                return (
                  <li
                    key={c.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 15px",
                      margin: "5px 0",
                      borderRadius: "8px",
                      backgroundColor: "#f5f5f5",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0f7fa")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                  >
                    <span style={{ fontWeight: 500, marginRight: "10px" }}>{c.nombre}</span>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          backgroundColor: color,
                          border: "2px solid #ccc",
                        }}
                        title={`RX: ${c.rx_power} dBm`}
                      ></div>
                      <span style={{ fontSize: "0.9rem", color: "#555" }}>
                        {c.rx_power} dBm
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>Sin clientes</p>
          )}
        </div>


      ) : (
        <p>Sin clientes</p>
      )}


      {nodo.tipo === 'Splitter1x8' && (
        <div className="modalAgregarCliente">
          <AgregarCliente nodo={nodo} />
        </div>
      )}
      </div>
    </article>
  );
};

export default ModalSplitter;
