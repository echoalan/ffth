import React, { useState, useEffect } from "react";
import getAllBox from "../../../services/PaquetesService/getAllBox";
import { ToastContainer, toast } from "react-toastify";
import assignProductToBox from "../../../services/PaquetesService/AsignProdToBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxesPacking,
} from "@fortawesome/free-solid-svg-icons";
const Empaquetar = ({ id_product, refetchProd, onClose }) => {
  const [allBox, setAllBox] = useState([]);
  const [selectedBox, setSelectedBox] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [priceType, setPriceType] = useState("retail");

  const showAllBox = async () => {
    try {
      const data = await getAllBox();
      setAllBox(data);
    } catch (error) {
      console.error("Error al obtener cajas:", error);
    }
  };
  const handleAssign = async () => {
    if (!selectedBox || quantity <= 0) {
      toast.error("Seleccioná una caja y una cantidad válida");
      return;
    }

    try {
      const response = await assignProductToBox(selectedBox, id_product, quantity, priceType);
      toast.success(response.message || "Producto asignado correctamente");
      refetchProd();
    } catch (error) {
      toast.error(error.message || "Error al asignar el producto");
    }
  };
  useEffect(() => {
    showAllBox();
  }, []);

  return (
    <div className="overlayModalEmpaquetar">
      <div className="containerEmpaquetar">
      <h2>Empaquetar</h2>
      <div className="containerSelectBox">
        <label>Paquete:</label>
        <select value={selectedBox} onChange={(e) => setSelectedBox(e.target.value)}>
          <option value="">Seleccionar paquete</option>
          {allBox.map((box) => (
            <option key={box.id} value={box.id}>
              {box.name}
            </option>
          ))}
        </select>
      </div>
      <div className="containerQuantity">
        <label>Cantidad:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>
      <div className="containerPriceType">
        <label>Tipo de precio:</label>
        <select value={priceType} onChange={(e) => setPriceType(e.target.value)}>
          <option value="retail">Minorista</option>
          <option value="wholesale">Mayorista</option>
        </select>
      </div>
      <div className="containerButtons">
        <button onClick={handleAssign}>
          Asignar
          <FontAwesomeIcon icon={faBoxesPacking} />
        </button>
        <button onClick={onClose} style={{ marginLeft: "1rem" }}>Cancelar</button>
      </div>
      </div>
    </div>
  );
};

export default Empaquetar;