import React, { useEffect, useState } from "react";
import getAllSellers from "../../services/SellersService/getSellers";
import createSeller from "../../services/SellersService/createSeller"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPenToSquare, faBoxOpen, faPlus, faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons'

const SellersComponent = () => {
  const [sellers, setSellers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    cuit: "",
    city: "",
    phone: "",
  });

  const showSellers = async () => {
    const dataSellers = await getAllSellers();
    setSellers(dataSellers);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newSeller = await createSeller(formData);
      if (newSeller) {
      
        setSellers((prevSellers) => [...prevSellers, newSeller]);
        setFormData({
          name: "",
          address: "",
          cuit: "",
          city: "",
          phone: "",
        });

       
        toast.success("Vendedor creado con éxito!");
      }
    } catch (error) {
     
      toast.error("Hubo un error al crear el vendedor. Intente nuevamente.");
    }
  };
  useEffect(() => {
    showSellers();
  }, []);

  return (
    <>
      <article className="containerSellers">
        <div className="containerTableSellers">
          <div className="containerFormCreateSeller">
            <h2 className="btnCreateBox">Agregar un nuevo vendedor</h2>
            <form className="formCreatePackage" onSubmit={handleSubmit}>
              <div className="formGroup">
                <label htmlFor="name">Nombre del Vendedor</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="inputField"
                  required
                  maxLength="255"
                  placeholder="Ingrese el nombre del vendedor"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="formGroup">
                <label htmlFor="name">Direccion</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="inputField"
                  required
                  maxLength="255"
                  placeholder="Ingrese la direccion del vendedor"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="formGroup">
                <label htmlFor="city">Ciudad</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="inputField"
                  required
                  placeholder="Ingrese la ciudad del vendedor"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="formGroup">
                <label htmlFor="city">Cuit</label>
                <input
                  type="text"
                  id="cuit"
                  name="cuit"
                  className="inputField"
                  required
                  placeholder="Ingrese el cuit del vendedor"
                  maxLength={11}
                  value={formData.cuit}
                  onChange={handleChange}
                />
              </div>

              <div className="formGroup">
                <label htmlFor="phone">Teléfono</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="inputField"
                  required
                  placeholder="Ingrese el teléfono del vendedor"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <button type="submit" className="btnSubmit">
                  Crear Vendedor
                  <FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: '20px', color: '#fff' }} />
                </button>
              </div>
            </form>
          </div>

          <div className="tableSellers">
            <div className="headerTableSellers">
              <p>Nombre</p>
              <p>Direccion</p>
              <p>Ciudad</p>
              <p>Cuit</p>
              <p>Telefono</p>
              <p>Fecha ingreso</p>
            </div>
            <div className="bodyTableSellers">
              {sellers.map((seller) => (
                <div key={seller.id} className="rowSeller">
                  <p><span className="spanMobileTableS">Nombre: </span>{seller.name}</p>
                  <p><span className="spanMobileTableS">Direccion: </span>{seller.address}</p>
                  <p><span className="spanMobileTableS">Ciudad: </span>{seller.city}</p>
                  <p><span className="spanMobileTableS">Cuit: </span>{seller.cuit}</p>
                  <p><span className="spanMobileTableS">Celular: </span>{seller.phone}</p>
                  <p><span className="spanMobileTableS">Fecha de ingreso: </span>{new Date(seller.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ToastContainer
        position="top-right" // Posición en la pantalla
        autoClose={2000} // Duración del toast en milisegundos
        hideProgressBar={false} // Mostrar barra de progreso
        newestOnTop={false} // Si quieres que el toast más reciente aparezca arriba
        closeOnClick={true} // Si al hacer clic sobre el toast se cierra
        rtl={false} // Dirección del texto (derecha o izquierda)
        pauseOnFocusLoss={false} // Pausar si se pierde el foco
        draggable={true} // Hacer que el toast sea arrastrable
        pauseOnHover={true} // Pausar el toast al pasar el ratón sobre él
      />
      </article>
    </>
  );
};

export default SellersComponent;
