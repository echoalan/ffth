import React, { useState, useEffect } from "react";
import editProduct from "../../../services/ProductsService/editProduct";
import { ToastContainer, toast } from "react-toastify";

const FormEditProduct = ({ productAct, closeModalEP, refetch }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");


  useEffect(() => {
    if (productAct) {
      setName(productAct.name);
      setDescription(productAct.description);
    }
  }, [productAct]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await editProduct(productAct.id, name, description);

      await refetch();

      toast.success('Producto actualizado con exito');

    } catch (error) {
      console.error("Error al actualizar:", error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="containerFormInserProd">
      
      <div className="containerFormEditProd">
        <button className="btnCloseModalVF" type="button" onClick={closeModalEP}>×</button>
        <h2>Editar Producto</h2>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label>Nombre:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="inputFormPBB"
            />
          </div>
          <div className="formGroup">
            <label>Descripción:</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="inputFormPBB"
            />
            
          </div>
          <div className="containerButtonsActProd">
            <button className="sendActualizarProd" type="submit">Guardar cambios</button>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormEditProduct;
