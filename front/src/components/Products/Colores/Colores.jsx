import React, { useState, useEffect } from "react";
import getColores from "../../../services/ColorService/getColor";
import addColor from "../../../services/ColorService/addColor";
import deleteColor from "../../../services/ColorService/deleteColor"; // nuevo
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPenToSquare,
  faBoxOpen,
  faPlus,
  faPaperPlane,
  faImages,
  faImage,
  faEye,
  faPalette,
  faShirt,
  faShareFromSquare,
  faSquarePlus
} from "@fortawesome/free-solid-svg-icons";

const Colores = ({ onClose }) => {
  const [colores, setColores] = useState([]);
  const [nuevoColor, setNuevoColor] = useState("");

  const showColores = async () => {
    try {
      const data = await getColores();
      setColores(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoColor.trim()) return;

    try {
      await addColor(nuevoColor);
      setNuevoColor("");
      showColores();
    } catch (error) {
      console.log("Error al agregar color:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteColor(id);
      showColores();
    } catch (error) {
      console.log("Error al eliminar color:", error);
    }
  };

  useEffect(() => {
    showColores();
  }, []);

  return (
    <div className="containerFormInserProd">
      
      <div className="containerColores">
        <h2>Colores</h2>
        <form onSubmit={handleSubmit} className="formAgregarColor">
          <div className="formGroup">
            <label htmlFor="colorId">Color</label>
            <input
              id="colorId"
              type="text"
              placeholder="Nuevo color"
              value={nuevoColor}
              required
              onChange={(e) => setNuevoColor(e.target.value)}
            />
            <button type="submit" className="addVariant mtp">
              Agregar <FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: "15px", color: "#fff" }} />
            </button>
          </div>
        </form>

        <div className="containerTableColores">
          <div className="tableColores">
            <div className="headerTableColores">
              <p>Colores</p>
            </div>
            <div className="bodyTablecolores">
              {colores.map((color) => (
                <div key={color.id} className="rowTableColores">
                  <p>{color.color}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button onClick={onClose} className="btnCloseModalVF">×</button>
        
      </div>
    </div>
  );
};

export default Colores;
