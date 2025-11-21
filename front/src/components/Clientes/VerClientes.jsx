import { useEffect, useState } from "react";
import RxIndicator from "../RxIndicator/RxIndicator";
import URL_API from "../../services/API";
import './VerCliente.css'

const VerClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [modalClientes, setModalClientes] = useState(false);
  const [pagination, setPagination] = useState({});
  const [busqueda, setBusqueda] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [filtroRx, setFiltroRx] = useState("todos");

  const [abierto, setAbierto] = useState(false);

  const togglePanel = () => {
    setAbierto(!abierto);
  };


  const handleModalClientes = () => {
    setModalClientes(!modalClientes);
  };

  // 🔍 Búsqueda
  const buscarClientes = async (nombre) => {
    try {
      const response = await fetch(
        `${URL_API}/clientes/buscar?nombre=${nombre}`
      );
      const data = await response.json();
      setClientes(data.data); // array directo
      setPagination({});
    } catch (error) {
      console.error("Error en búsqueda:", error);
    }
  };

  // 📄 Lista con paginación
  const fetchClientes = async (page = 1) => {
    try {
      const response = await fetch(
        `${URL_API}/clientes?page=${page}`
      );
      const data = await response.json();
      setClientes(data.data.data);
      setPagination(data.data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
    }
  };

  // Cada vez que el usuario escribe algo
  const handleBuscar = (e) => {
    setBusqueda(e.target.value);
  };

  // ⏳ DEBOUNCE: espera 400ms antes de buscar
  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(() => {
      if (busqueda.trim() === "") {
        fetchClientes(); // vuelve a paginado
      } else {
        buscarClientes(busqueda);
      }
    }, 400);

    setDebounceTimer(timer);

    return () => clearTimeout(timer);
  }, [busqueda]);

  useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <>
      <article className={`articleVerCliente ${abierto ? "abierto" : "cerrado"}`}>
        <button className="btnVer" onClick={togglePanel}>
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zM6 11c1.66 0 3-1.34 3-3S7.66 5 6 5 3 6.34 3 8s1.34 3 3 3zm10 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5c0-2.33-4.67-3.5-7-3.5zM6 13c-2.33 0-7 1.17-7 3.5V20h7v-3.5C6 14.17 8.33 13 6 13z" fill="currentColor" />
          </svg>
          <p>Clientes</p>
        </button>
        <div className="modalClientesOverlay">
          <div className="modalClientesPanel">
            <div className="modalClientesHeader">
              <h2>Clientes Conectados</h2>
            </div>

            {/* 🔍 BUSCADOR */}
            <input
              type="text"
              placeholder="Buscar cliente por nombre..."
              value={busqueda}
              onChange={handleBuscar}
              className="inputBuscar"
            />

            <div className="listaClientes">
              {clientes.map((cliente) => (
                <div key={cliente.id} className="clienteCard">
                  <h3>{cliente.nombre}</h3>
                  <div className="clienteUsuario">{cliente.usuario}</div>

                  {/* 🚦 Indicador universal */}
                  <RxIndicator rx={cliente.rx_power} status={cliente.status} />
                </div>
              ))}
            </div>



            {/* Solo mostrar paginación si NO estamos buscando */}
            {busqueda.trim() === "" && (
              <div className="paginacion">
                {pagination.prev_page_url && (
                  <button
                    onClick={() =>
                      fetchClientes(pagination.current_page - 1)
                    }
                  >
                    ◀ Anterior
                  </button>
                )}

                <span>
                  Página {pagination.current_page} de {pagination.last_page}
                </span>

                {pagination.next_page_url && (
                  <button
                    onClick={() =>
                      fetchClientes(pagination.current_page + 1)
                    }
                  >
                    Siguiente ▶
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

      </article>
    </>
  );
};

export default VerClientes;
