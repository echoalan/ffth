import React from "react"
import BuscarCliente from "../BuscarCliente/BuscarCliente";
import './AgregarCliente.css'

const AgregarCliente = ( { nodo, setModalAgregarClienteVisible, onSuccess } ) => {
  return (
    <div className="agregarClienteModal">
      <h2>Agregar Cliente</h2>
      <BuscarCliente nodo={nodo} onSuccess={onSuccess} />
    </div>
  );
}

export default AgregarCliente;