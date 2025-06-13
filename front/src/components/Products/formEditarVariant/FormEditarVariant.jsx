import React, { useState, useEffect } from "react";
import getSizes from "../../../services/SizeService/getSizes";
import getColores from "../../../services/ColorService/getColor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import getVariantById from "../../../services/ProductVariantService/getVariantById"
import editVariante from "../../../services/ProductVariantService/editVariante";
import { toast } from "react-toastify";

const FormEditarVariant = ({ idProdUpdate, close, refetch }) => {


  //states actuallity data
  const [dataPrevia, setDataPrevia] = useState({
    model:"", 
    weight: "",
    size_id: "",
    color_id: "",
    quantity: "",
    retail_price: "",
    wholesale_price: ""
  });

  //states of sizes 
  const [sizes, setSizes] = useState([]);

  //state of colores
  const [colores, setColors] = useState([]);


  //datos previos

  const showDatosPrevios = async () => {

    const dataPrevia = await getVariantById(idProdUpdate);

    console.log(dataPrevia.data);

    setDataPrevia(dataPrevia.data);

  }

  //talles
  const showSizes = async () => {
    const sizesDate = await getSizes();
    setSizes(sizesDate);
  }

  //colores
  const showColores = async () => {
    const colorDate = await getColores();
    setColors(colorDate);
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await editVariante(idProdUpdate, dataPrevia);
      toast.success("Variante actualizada con éxito");
      refetch();
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {

    showSizes();
    showColores();

    showDatosPrevios();

  }, [])

  return (
    <div className="containerEditVariant">
      <div className="headerFormInserProd">
        <h2 className="btnCreateBox">
          <FontAwesomeIcon icon={faPlus} style={{ fontSize: "20px", color: "#fff" }} />
          Editar variante
        </h2>
        <button className="btnCloseModal" onClick={close}>Cerrar</button>
      </div>

      <form className="editProd" onSubmit={handleSubmit}>
          <div className="variantRow addv">
          <div className="formField">
              <label>Modelo</label>
              <input
                type="text"
                placeholder="Precio minorista"
                value={dataPrevia.model}
                onChange={(e) => setDataPrevia({ ...dataPrevia, model: e.target.value })}
                required
              />
            </div>
            <div className="formField">
              <label>Peso</label>
              <input
                type="number"
                placeholder="Precio minorista"
                value={dataPrevia.weight}
                onChange={(e) => setDataPrevia({ ...dataPrevia, weight: e.target.value })}
                required
              />
            </div>

            <div className="formField">
              <label>Talle</label>
              <select
                value={dataPrevia.size_id}
                onChange={(e) => setDataPrevia({ ...dataPrevia, size_id: e.target.value })}
                required
              >
                <option value="">Seleccionar talle</option>
                {sizes.map((size) => (
                  <option key={size.id} value={size.id}>
                    {size.size}
                  </option>
                ))}
              </select>
            </div>

            <div className="formField">
              <label>Color</label>
              <select
                value={dataPrevia.color_id}
                onChange={(e) => setDataPrevia({ ...dataPrevia, color_id: e.target.value })}
                required
              >
                <option value="">Seleccionar color</option>
                {colores.map((colorc) => (
                  <option key={colorc.id} value={colorc.id}>
                    {colorc.color}
                  </option>
                ))}
              </select>
            </div>



            <div className="formField">
              <label>Precio minorista</label>
              <input
                type="number"
                placeholder="Precio minorista"
                value={dataPrevia.retail_price}
                onChange={(e) => setDataPrevia({ ...dataPrevia, retail_price: e.target.value })}
                required
              />
            </div>

            <div className="formField">
              <label>Precio mayorista</label>
              <input
                type="number"
                placeholder="Precio mayorista"
                value={dataPrevia.wholesale_price}
                onChange={(e) => setDataPrevia({ ...dataPrevia, wholesale_price: e.target.value })}
                required
              />
            </div>

            <div className="formField">
              <label>Cantidad</label>
              <input
                type="number"
                placeholder="Stock"
                value={dataPrevia.quantity}
                onChange={(e) => setDataPrevia({ ...dataPrevia, quantity: e.target.value })}
                required
              />
            </div>
          </div>

        <div>
          <button type="submit" className="btnSubmit">
            Actualizar variante{" "}
            <FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: "20px", color: "#fff" }} />
          </button>
        </div>
      </form>

    </div>
  )

}

export default FormEditarVariant;