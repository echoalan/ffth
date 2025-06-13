import React, { useEffect, useState } from "react";
import getBox from "../../services/PaquetesService/getBox";
import createBox from "../../services/PaquetesService/createBox";
import deleteBox from "../../services/PaquetesService/deleteBox";
import { ToastContainer, toast } from "react-toastify";
import ModalPaquete from "./ModalPaquete/ModalPaquete";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPenToSquare, faBoxOpen, faPlus, faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons'

const Paquetes = () => {
  const [paquetes, setPaquetes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openCreatePod, setOpenCreatePod] = useState(false);
  const [idBox, setIdBox] = useState("");
  
  const [formData, setFormData] = useState({
    name: '',
    weight: '',
    dimensions: ''
  });
  
  const showBox = async () => {
    const data = await getBox();
    setPaquetes(data);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await createBox(formData);
      if (data) {
        showBox();
        setFormData({ name: '', weight: '', dimensions: '' });
        toast.success("Paquete creado con éxito");
      } else {
        toast.error("Hubo un problema al crear el paquete. Intenta nuevamente.");
      }
    } catch (error) {
      toast.error("Error al crear el paquete. Por favor, intente más tarde.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (box) => {
    setIsModalOpen(true); 

    setIdBox(box);
  };

  const closeModal = () => {
    setIsModalOpen(false); 
  };


  const handleOpenModalCreateProduct = () => {
    setOpenCreatePod(!openCreatePod);
  };

  const closeModalCreateProduct = () => { 
    setOpenCreatePod(false);
  };

  useEffect(() => {
    showBox();
  }, []);

  // Ejecutar este useEffect cada vez que selectedBox cambia

  return (
    <article className="articlePaquetes">
      <div className="containerCreatePaquetes">
        <div className="casperFormTitleAddBox">
          <h2 className="btnCreateBox">
            <FontAwesomeIcon icon={faPlus} style={{ fontSize: '20px', color: '#fff' }} />
            Agregar un nuevo paquete
          </h2>
          <form className="formCreatePackage" onSubmit={handleSubmit}>
            <div className="formGroup">
              <label htmlFor="name">Nombre del Paquete</label>
              <input
                type="text"
                id="name"
                name="name"
                className="inputField"
                required
                maxLength="255"
                placeholder="Ingrese el nombre del paquete"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="formGroup">
              <label htmlFor="weight">Peso (KG)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                className="inputField"
                step="0.01"
                placeholder="Ingrese el peso del paquete"
                value={formData.weight}
                onChange={handleChange}
              />
            </div>

            <div className="formGroup">
              <label htmlFor="dimensions">Dimensiones (alto X ancho)</label>
              <input
                type="text"
                id="dimensions"
                name="dimensions"
                className="inputField"
                maxLength="255"
                placeholder="Ingrese las dimensiones del paquete"
                value={formData.dimensions}
                onChange={handleChange}
              />
            </div>

            <div>
              <button type="submit" className="btnSubmit">
                Guardar Paquete
                <FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: '20px', color: '#fff' }} />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="containerPaquetes">
        <h2 className="titleBox">Empaques
          <FontAwesomeIcon icon={faBoxOpen} style={{ fontSize: '20px', color: '#fff' }} />
        </h2>
        <div className="casperBox">
          {paquetes.map((box, index) => (
            <div
              key={index}
              className="paqueteBox"
              onClick={() => openModal(box.id)}
            >
              <h4>Nombre: <span className="boldText">{box.name}</span></h4>
              <h4>Productos: <span className="boldText">{box.products_count}</span></h4>
              <h4>Peso: <span className="boldText">{box.weight}</span></h4>
              <h4>Dimensiones: <span className="boldText">{box.dimensions}</span></h4>
            </div>
          ))}
        </div>
      </div>
          {
            isModalOpen && (
              <ModalPaquete
                isOpen={isModalOpen}
                onClose={closeModal}
                boxId={idBox}
                onDelete={showBox}
                onAssignSeller={showBox}
                refetchBox={showBox}
              />
            )
          }
      <ToastContainer />
    </article>
  );
};

export default Paquetes;
