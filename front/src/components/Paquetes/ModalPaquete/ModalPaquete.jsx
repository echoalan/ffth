import React, { useState, useEffect, useRef } from "react";
import jsPDF from 'jspdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import getAllSellers from "../../../services/SellersService/getSellers";
import getProductByBox from "../../../services/ProductsService/getProductByBox";
import deleteBox from "../../../services/PaquetesService/deleteBox";
import getBoxById from "../../../services/PaquetesService/getBoxById";
import assignSellerToBox from "../../../services/PaquetesService/selectSeller"
import { faTrash, faPenToSquare, faBoxOpen, faPlus, faPaperPlane, faXmark, faFilePdf } from '@fortawesome/free-solid-svg-icons'
import updateBoxe from "../../../services/PaquetesService/UpdateBoxe";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";

const ModalPaquete = ({ isOpen, onClose, boxId, refetchBox }) => {

  const [sellers, setSellers] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalActualizarPaquete, setModalActualizarPaquete] = useState(false);
  const [boxById, setBoxById] = useState(null);
  const [productsByBox, setProductsByBox] = useState([]);

  const [formDataActualizarPaquete, setFormDataActualizarPaquete] = useState({
    name: "",
    weight: "",
    dimensions: "",
  });

  //productos por caja

  const showProductsByBox = async () => {
    const dataProdByBox = await getProductByBox(boxId);
    setProductsByBox(dataProdByBox)
  }

  const generarPDF = () => {
    const doc = new jsPDF();
  
    // Título centrado
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Remito de Paquete", doc.internal.pageSize.getWidth() / 2, 15, { align: "center" });
  
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
  
    const marginLeft = 10;
    const blockWidth = 90;
    const blockHeight = 35;
    const secondColumnX = marginLeft + blockWidth + 10;
    const blockY = 25;
  
    // Línea divisoria entre bloques
    doc.setDrawColor(150);
    doc.line(marginLeft + blockWidth + 5, blockY, marginLeft + blockWidth + 5, blockY + blockHeight);
  
    // Fondo gris y borde para ambos bloques
    doc.setFillColor(230);
    doc.rect(marginLeft, blockY, blockWidth, blockHeight, "F"); // Vendedor
    doc.rect(secondColumnX, blockY, blockWidth, blockHeight, "F"); // Empaque
  
    doc.setDrawColor(180);
    doc.rect(marginLeft, blockY, blockWidth, blockHeight); // Borde vendedor
    doc.rect(secondColumnX, blockY, blockWidth, blockHeight); // Borde empaque
  
    // ----- Contenido del bloque vendedor -----
    let yVendedor = blockY + 6;
    doc.setFont("helvetica", "bold");
    doc.text("Datos del Vendedor", marginLeft + 2, yVendedor);
    yVendedor += 6;
  
    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${boxById.seller.name}`, marginLeft + 2, yVendedor);
    yVendedor += 5;
    doc.text(`CUIT: ${boxById.seller.cuit}`, marginLeft + 2, yVendedor);
    yVendedor += 5;
    doc.text(`Dirección: ${boxById.seller.address}`, marginLeft + 2, yVendedor);
    yVendedor += 5;
    doc.text(`Ciudad: ${boxById.seller.city}`, marginLeft + 2, yVendedor);
    yVendedor += 5;
    doc.text(`Teléfono: ${boxById.seller.phone}`, marginLeft + 2, yVendedor);
  
    // ----- Contenido del bloque empaque -----
    let yEmpaque = blockY + 6;
    doc.setFont("helvetica", "bold");
    doc.text("Datos del Empaque", secondColumnX + 2, yEmpaque);
    yEmpaque += 6;
  
    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${boxById.name}`, secondColumnX + 2, yEmpaque);
    yEmpaque += 5;
    doc.text(`Peso: ${boxById.weight} KG`, secondColumnX + 2, yEmpaque);
    yEmpaque += 5;
    doc.text(`Dimensiones: ${boxById.dimensions}`, secondColumnX + 2, yEmpaque);
  
    // Nueva Y base para tabla
    let currentY = blockY + blockHeight + 10;
  
    const startX = marginLeft;
    let startY = currentY;
    const rowHeight = 8;
  
    // Calcular el ancho total de la página (210mm) y el espacio disponible para la tabla
    const totalWidth = doc.internal.pageSize.getWidth() - 20; // 20mm de márgenes
    const colWidths = {
      producto: totalWidth * 0.25, // 25% del ancho total
      talle: totalWidth * 0.15,    // 15% del ancho total
      color: totalWidth * 0.2,     // 20% del ancho total
      cantidad: totalWidth * 0.1,  // 10% del ancho total
      precio: totalWidth * 0.15,   // 15% del ancho total
      tipoPrecio: totalWidth * 0.15, // 15% del ancho total
    };
  
    const totalTableWidth = Object.values(colWidths).reduce((a, b) => a + b, 0);
  
    // Encabezado
    doc.setFillColor(200, 200, 200);
    doc.rect(startX, startY, totalTableWidth, rowHeight, 'F');
  
    doc.setFont("helvetica", "bold");
    let colX = startX;
    doc.text("Producto", colX + 2, startY + 6);
    colX += colWidths.producto;
    doc.text("Talle", colX + 2, startY + 6);
    colX += colWidths.talle;
    doc.text("Color", colX + 2, startY + 6);
    colX += colWidths.color;
    doc.text("Cant.", colX + 2, startY + 6);
    colX += colWidths.cantidad;
    doc.text("Precio", colX + 2, startY + 6);
    colX += colWidths.precio;
    doc.text("May/Min", colX + 2, startY + 6); // Cambié "Tipo" por "Mayorista/Minorista"
  
    startY += rowHeight;
    doc.setFont("helvetica", "normal");
  
    let total = 0;
    let totalCantidad = 0;
  
    productsByBox.forEach(product => {
      const precio = parseFloat(product.precio_unitario);
      const cantidad = parseInt(product.cantidad_en_caja);
      const subtotal = precio * cantidad;
  
      total += subtotal;
      totalCantidad += cantidad;
  
      let x = startX;
  
      doc.rect(x, startY, colWidths.producto, rowHeight);
      doc.text(product.producto.toString(), x + 2, startY + 6);
      x += colWidths.producto;
  
      doc.rect(x, startY, colWidths.talle, rowHeight);
      doc.text(product.talle.toString(), x + 2, startY + 6);
      x += colWidths.talle;
  
      doc.rect(x, startY, colWidths.color, rowHeight);
      doc.text(product.color.toString(), x + 2, startY + 6);
      x += colWidths.color;
  
      doc.rect(x, startY, colWidths.cantidad, rowHeight);
      doc.text(product.cantidad_en_caja.toString(), x + 2, startY + 6);
      x += colWidths.cantidad;
  
      doc.rect(x, startY, colWidths.precio, rowHeight);
      doc.text(`$${precio.toFixed(2)}`, x + 2, startY + 6);
      x += colWidths.precio;
  
      doc.rect(x, startY, colWidths.tipoPrecio, rowHeight);
      doc.text(product.tipo_precio === 'wholesale' ? 'Mayorista' : 'Minorista', x + 2, startY + 6); // Esto muestra 'Mayorista' o 'Minorista'
  
      startY += rowHeight;
  
      if (startY + rowHeight > 280) {
        doc.addPage();
        startY = 20;
      }
    });
  
    // Totales
    startY += 5;
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL DE PRODUCTOS: ${totalCantidad}`, startX, startY + 6);
    doc.text(`PRECIO FINAL: $${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`, startX, startY + 12);
  
    doc.save("remito-manual.pdf");
  };  

  const showBoxBydId = async (id) => {
    const dataBox = await getBoxById(id);
    setBoxById(dataBox);

  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataActualizarPaquete((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateBoxe(formDataActualizarPaquete, boxId);
      toast.success("Paquete actualizado correctamente.");
      showBoxBydId(boxId);
      refetchBox();

      setFormDataActualizarPaquete({
        name: "",
        weight: "",
        dimensions: "",
      });
    } catch (error) {
      toast.error("Error al actualizar el paquete.");
      console.error(error);
    }
  };


  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);

  const handleDelete = async () => {
    try {
      const result = await deleteBox(boxId);
        if (result) {
          toast.success("Paquete eliminado con exito");
          refetchBox();
          onClose();
        }
      } catch (error) {
         toast.error(`${error}`);
      }
    };

  const showSellers = async () => {
    const dataSellers = await getAllSellers();
    setSellers(dataSellers);
  };

  const handleSelectSeller = async (seller_id) => {
  
    try{

      await assignSellerToBox(boxById.id, seller_id);
      toast.success('exito');
      await showBoxBydId(boxById.id);

    }catch{

      toast.error('error')
      
    }

  }

  const closeModal = () => {
    setModalActualizarPaquete(false);
  }

  const openModal = () => {
    setModalActualizarPaquete(true);
  }

  useEffect(() => {
    showBoxBydId(boxId)
    showSellers();
    showProductsByBox()
  }, [isOpen]);

  useEffect(() => {
    if (boxById) {
      setFormDataActualizarPaquete({
        name: boxById.name || "",
        weight: boxById.weight || "",
        dimensions: boxById.dimensions || "",
      });
    }
  }, [boxById]);

  return (
    <>
      <div className={`modal-overlay`} >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="containerInfoBox">
            <div className="containerDtailsPaquete">
              <div className="containerBtnCloseM">
                <button className="btnCloseM" onClick={onClose}>
                  <p>Cerrar</p>
                  <FontAwesomeIcon icon={faXmark} style={{ fontSize: '20px', color: '#fff' }} />
                </button>
              </div>
            </div>
            <div className="actionDeleteAct">
              <button className="deleteProduct" onClick={openConfirmModal}>
                <p>Eliminar</p>
                <FontAwesomeIcon icon={faTrash} style={{ fontSize: '20px', color: '#fff' }} />
              </button>
              <button className="actualizarProduct" onClick={openModal}>
                <p>Actualizar</p>
                <FontAwesomeIcon icon={faPenToSquare} style={{ fontSize: '20px', color: '#fff' }} />
              </button>
              <button className="btnCreateProd" onClick={generarPDF}>
                <p>Remito</p>
                <FontAwesomeIcon icon={faFilePdf} style={{ fontSize: '20px', color: '#fff' }} />
              </button>
            </div>
          </div>
          <div className="containerProductsByBox">
            <div className="containerTextHeadM">
              <p>
                <strong className="strongTH">Vendedor: </strong>
                {boxById === null ? (
                  <span>Cargando vendedor...</span>
                ) : boxById.seller ? (
                  boxById.seller.name
                ) : (
                  <select className="selectSeller" onChange={(e) => handleSelectSeller(e.target.value)}>
                    <option value="">Seleccionar Vendedor</option>
                    {sellers.map((seller) => (
                      <option key={seller.id} value={seller.id}>{seller.name}</option>
                    ))}
                  </select>
                )}
              </p>
              {boxById && (
                <>
                  <p><strong className="strongTH">Nombre:</strong> {boxById.name}</p>
                  <p><strong className="strongTH">Peso:</strong> {boxById.weight} KG</p>
                  <p><strong className="strongTH">Dimensiones:</strong> {boxById.dimensions}</p>
                </>
              )}
            </div>
            <div className="containerFormproductsByBox">
              <h2 className="titleBox">Empaques
                <FontAwesomeIcon icon={faBoxOpen} style={{ fontSize: '20px', color: '#fff' }} />
              </h2>
              <div className="headerTableProducts">
                <div className="headerItem">Nombre</div>
                <div className="headerItem">Talle</div>
                <div className="headerItem">Color</div>
                <div className="headerItem">Cantidad</div>
                <div className="headerItem">Precio</div>
              </div>
              <div className="casperPBB">
                {productsByBox?.length > 0 ? (
                  productsByBox.map((product) => (
                    <div key={`${product.id}-${product.tipo_precio}`} className="product-item">
                      <p>{product.producto}</p>
                      <p>{product.talle}</p>
                      <p>{product.color}</p>
                      <p>{product.cantidad_en_caja}</p>
                      <p>{product.precio_unitario}</p>
                    </div>
                  ))
                ) : (
                  <p>No hay productos en esta caja.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {modalActualizarPaquete && (
          <div className="modalActualizarPaquete">
            <div className="casperModalActualizarPaquete">
              <div className="containerBtnCloseM">
                <h2 className="titleActualizarPaquete">Actualizar Paquete</h2>
                <button className="btnCloseM" onClick={closeModal}>
                  <p>Cerrar</p>
                  <FontAwesomeIcon icon={faXmark} style={{ fontSize: '20px', color: '#fff' }} />
                </button>
              </div>
              <form className="formActualizarPaquete" onSubmit={handleSubmit}>
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
                    onChange={handleChange}
                    value={formDataActualizarPaquete.name || ''}
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
                    onChange={handleChange}
                    value={formDataActualizarPaquete.weight}
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
                    onChange={handleChange}
                    value={formDataActualizarPaquete.dimensions}
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
        )

        }

        {isConfirmModalOpen && (
          <div className="overlayConfirmDelete">
            <div className="containerModalCD">
              <div className="headercloseModalCD">
                <h3>¿Estás seguro de que deseas eliminar este empaque?</h3>
                <button className="btnCloseM" onClick={closeConfirmModal}>Cerrar</button>
              </div>
              <div className="containerBtnDeleteBox">
                <button onClick={handleDelete} className="deleteProduct">Eliminar<FontAwesomeIcon icon={faTrash} style={{ fontSize: '20px', color: '#fff' }} /></button>
              </div>
            </div>
          </div>
        )}
      </div>

    </>
  )

}


export default ModalPaquete; 