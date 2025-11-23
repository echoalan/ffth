import { useState } from 'react';
import './NuevoCliente.css';
import URL_API from "../../services/API";

const NuevoCliente = ({ onClose }) => {

  const [form, setForm] = useState({
    nombre: '',
    usuario: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ok, setOk] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOk(null);

    try {
      const res = await fetch(`${URL_API}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Error al crear cliente');

      setOk('Cliente creado correctamente');
      setForm({ nombre: '', usuario: '' });

      // OPCIONAL: cerrar el modal automáticamente
      // onClose();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="articleNuevoCliente">
      <div className="modalNuevoCliente">

        <div className="headerNuevoCliente">
          <h2>Nuevo Cliente</h2>
          <button onClick={onClose}>cerrar</button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="usuario">Usuario</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={form.usuario}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}
          {ok && <p className="ok">{ok}</p>}

          <button type="submit" className="btnConfirmar" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>

        </form>
      </div>
    </article>
  );
};

export default NuevoCliente;
