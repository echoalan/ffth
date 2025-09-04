import React from "react"
import BuscarCliente from "../BuscarCliente/BuscarCliente";

const AgregarCliente = ( { nodo, setModalAgregarClienteVisible } ) => {
  return (
    <div className="agregarClienteModal">
     
        <h2>Agregar Cliente</h2>

         <BuscarCliente nodo={nodo} />
      
      
    </div>
  );
}

export default AgregarCliente;