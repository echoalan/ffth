import React from "react"
import BuscarCliente from "../BuscarCliente/BuscarCliente";

const AgregarCliente = ( { setModalAgregarClienteVisible } ) => {
  return (
    <div className="agregarClienteModal">
     
        <h2>Agregar Cliente</h2>


         <BuscarCliente />
      
        <button className="cancelarCaja" onClick={() => setModalAgregarClienteVisible(false)}>Cerrar</button>
      
    </div>
  );
}

export default AgregarCliente;