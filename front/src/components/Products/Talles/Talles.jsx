import React, { useState, useEffect } from "react";
import addSize from "../../../services/SizeService/addSize";
import getSizes from "../../../services/SizeService/getSizes"
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

const Talles = ({ onClose }) => {
  const [talles, setTalles] = useState([]);
  const [nuevoTalle, setNuevoTalle] = useState("");

  const showTalles = async () => {
    try {
      const data = await getSizes();
      setTalles(data);
    } catch (error) {
      console.log("Error al obtener talles:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoTalle.trim()) return;

    try {
      await addSize(nuevoTalle);
      setNuevoTalle("");
      showTalles();
    } catch (error) {
      console.log("Error al agregar talle:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSize(id);
      showTalles();
    } catch (error) {
      console.log("Error al eliminar talle:", error);
    }
  };

  useEffect(() => {
    showTalles();
  }, []);

  return (
    <div className="containerFormInserProd">
      <div className="containerColores">
        <h2>Talles</h2>

        <form onSubmit={handleSubmit} className="formAgregarColor">
          <div className="formGroup">
            <label htmlFor="talleId">Talle</label>
            <input
              id="talleId"
              type="text"
              placeholder="Nuevo talle"
              value={nuevoTalle}
              required
              onChange={(e) => setNuevoTalle(e.target.value)}
            />
            <button type="submit" className="addVariant mtp">
              AgregarAgregar <FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: "15px", color: "#fff" }} />
            </button>
          </div>
        </form>

        <div className="tableColores">
          <div className="headerTableColores">
            <p>Talles</p>
          </div>
          <div className="bodyTablecolores">
            {talles.map((talle) => (
              <div key={talle.id} className="rowTableColores">
                <p>{talle.size}</p>
              </div>
            ))}
          </div>
        </div>
        <button onClick={onClose} className="btnCloseModalVF">×</button>
      </div>
    </div>
  );
};

export default Talles;
