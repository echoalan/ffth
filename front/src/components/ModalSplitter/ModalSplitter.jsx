import { useEffect, useState } from 'react';
import { clientesByNodos } from '../../services/nodos/clientesByNodos';
import AgregarCliente from '../AgregarCliente/AgregarCliente';
import RxIndicator from '../RxIndicator/RxIndicator';
import './ModalSplitter.css'

const ModalSplitter = ({ onClose, nodo }) => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);



  const fetchClientes = async () => {
    try {
      const data = await clientesByNodos(nodo.id);
      setClientes(data);
    } catch (err) {
      console.error("Error cargando clientes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
          <div className="clientesConectados">
            <h2>Clientes Conectados:</h2>

            <ul className="UserList">
              {Array.from({ length: 6 }).map((_, i) => (
                <li className="user skeletonUser" key={i}>
                  <span className="nameUser skeletonText"></span>
                  <span className="skeletonRx"></span>
                </li>
              ))}
            </ul>
          </div>
        ) : clientes.length > 0 ? (
          <div className="clientesConectados">
            <h2>Clientes Conectados:</h2>

            <ul className="UserList">
              {clientes.map((c) => (
                <li className="user" key={c.id}>
                  <span className="nameUser">{c.nombre}</span>
                  <RxIndicator rx={c.rx_power} status={c.status} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="emptyFancy">
            <div className="iconBox">🙈</div>
            <h3>Sin clientes</h3>
            <p>Este splitter todavía no tiene usuarios conectados.</p>
          </div>
        )}
        {nodo.tipo === 'Splitter1x8' && (
          <AgregarCliente nodo={nodo} onSuccess={fetchClientes} />
        )}
      </div>
    </article>
  );
};

export default ModalSplitter;
