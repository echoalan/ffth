import { useState, useEffect } from "react";
import fetchClientesLimite from "../../services/Clientes/ClientesLimite";
import RxIndicator from "../RxIndicator/RxIndicator"; 
import './ClientesAltos.css'

const ClientesAltos = () => {
  const [open, setOpen] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const showClientesAltos = async (page = 1) => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchClientesLimite(page);

      if (!data) {
        setError("No se pudo obtener la información 😢");
        return;
      }

      setClientes(data.data);
      setPagination(data);
      setPage(data.current_page);
    } catch (error) {
      console.log(error);
      setError("No se pudieron cargar los clientes altos 😢");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    showClientesAltos(page);
  }, [page]);

  return (
    <>
      <article className={`articleClientesAltos ${open ? "abierto" : "cerrado"}`}>
        <div className="headerAltos">
          <h2>Clientes Altos {pagination?.total ?? 0}</h2>
       <button className="btnClientesAltos" onClick={() => setOpen(!open)}>
  <svg width="22" height="22" viewBox="0 0 24 24">
    <path 
      d="M1 21h22L12 2 1 21zM12 16h-1v-4h2v4h-1zm0 4h-1v-2h2v2h-1z" 
      fill="currentColor" 
    />
  </svg>
  Rango
</button>

        </div>

        {open && (
          <div className="contenidoAltos">

            {loading && <p>Cargando...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && clientes.length > 0 && (
              <>
                <div className="cardsAltos">
                  {clientes.map((cli) => (
                    <div key={cli.id} className="clienteCard">

                      <div className="info">
                        <p className="pInfoAlto">
                          {cli.usuario}
                        </p>
                        <p className="pInfoAlto">
                          {cli.nombre}
                        </p>
                      </div>

                      {/* 👇 REUTILIZAMOS TU INDICADOR GROSO */}
                      <RxIndicator 
                        rx={cli.rx_power} 
                        status={cli.status ?? "Online"} 
                      />

                    </div>
                  ))}
                </div>

                {/* PAGINACIÓN */}
                {pagination && (
                  <div className="paginacion">
                    {pagination.prev_page_url && (
                      <button onClick={() => setPage(page - 1)}>
                        ◀ Anterior
                      </button>
                    )}

                    <span>
                      Página {pagination.current_page} de {pagination.last_page}
                    </span>

                    {pagination.next_page_url && (
                      <button onClick={() => setPage(page + 1)}>
                        Siguiente ▶
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {!loading && !error && clientes.length === 0 && (
              <p>No se encontraron clientes altos.</p>
            )}
          </div>
        )}
      </article>
    </>
  );
};

export default ClientesAltos;
