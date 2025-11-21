import { useEffect, useState } from "react";
import RxIndicator from "../RxIndicator/RxIndicator";
import URL_API from "../../services/API";

const VerClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [modalClientes, setModalClientes] = useState(false);
  const [pagination, setPagination] = useState({});
  const [busqueda, setBusqueda] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [filtroRx, setFiltroRx] = useState("todos");


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
      <article className="articleVerCliente">
      
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
