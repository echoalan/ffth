import React, { useState, useEffect } from "react";
import getSizes from "../../../services/SizeService/getSizes";
import getColores from "../../../services/ColorService/getColor";
import addVariant from "../../../services/ProductVariantService/ProductVariantService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPenToSquare,
  faBoxOpen,
  faPlus,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const FormAddVariant = ({ idProd, onClose, refetch }) => {

  //states of sizes 
  const [sizes, setSizes] = useState([]);

  //state of colores

  const [colores, setColors] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
  });

  const [variants, setVariants] = useState([
    { model:"", weight: "", color: "", size: "", stock: "", retail_price: "", wholesale_price: "" }
  ]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };


  const removeVariant = (index) => {
    const filtered = variants.filter((_, i) => i !== index);
    setVariants(filtered);
  };

  const handleSubmit = async () => {
    const payload = {
      product_id: idProd,
      variants: variants.map((v) => ({
        size_id: v.size || null,
        color_id: v.color || null,
        quantity: v.stock || null,
        model: v.model || null,
        weight: v.weight || null,
        retail_price: v.retail_price || null,
        wholesale_price: v.wholesale_price || null,
      }))
    };

    try {
      await addVariant(payload);
      toast.success("Variante creada con exito!");
      refetch()
    } catch (error) {
      toast.error(error.message);
    }
  };

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


  useEffect(() => {

    showSizes();
    showColores();

  }, [])

  return (

    <div className="containerFormAddVariant">
      <div className="headerFormInserProd">
        <h2 className="btnCreateBox">
          <FontAwesomeIcon icon={faPlus} style={{ fontSize: "20px", color: "#fff" }} />
          Agregar una nueva variante
        </h2>
        <button className="btnCloseModal" onClick={() => { onClose() }}>Cerrar</button>
      </div>
      <form className="formAddVariant">
        <div className="casperAddVariant">
          <label>Variantes</label>
          {variants.map((variant, index) => (
            <div className="variantRow addv" key={index}>
              <div className="formGroup">
                <p className="pVRFG">Modelo</p>
                <input
                  type="text"
                  placeholder="Modelo"
                  value={variant.model}
                  onChange={(e) => handleVariantChange(index, "model", e.target.value)}
                  required
                />
              </div>
              <div className="formGroup">
                <p className="pVRFG">Peso</p>
                <input
                  type="number"
                  placeholder="Peso"
                  value={variant.weight}
                  onChange={(e) => handleVariantChange(index, "weight", e.target.value)}
                  required
                />
              </div>

              <div className="formGroup">
                <p className="pVRFG">Talle</p>
                <select
                  value={variant.size}
                  onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                  required
                >
                  <option value="">Seleccionar talle</option>
                  {sizes.map((size) => (
                    <option key={size.id} value={size.id}>{size.size}</option>
                  ))}
                </select>
              </div>

              <div className="formGroup">
                <p className="pVRFG">Color</p>
                <select
                  value={variant.color}
                  onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                  required
                >
                  <option value="">Seleccionar color</option>
                  {colores.map((colorc) => (
                    <option key={colorc.id} value={colorc.id}>{colorc.color}</option>
                  ))}
                </select>

              </div>
              <div className="formGroup">
                <p className="pVRFG">Precio minorista</p>
                <input
                  type="number"
                  placeholder="Precio minorista"
                  value={variant.retail_price}
                  onChange={(e) => handleVariantChange(index, "retail_price", e.target.value)}
                  required
                />
              </div>
              <div className="formGroup">
                <p className="pVRFG">Precio mayorista</p>
                <input
                  type="number"
                  placeholder="Precio mayorista"
                  value={variant.wholesale_price}
                  onChange={(e) => handleVariantChange(index, "wholesale_price", e.target.value)}
                  required
                />
              </div>
              <div className="formGroup">
                <p className="pVRFG">Cantidad</p>
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={variant.stock}
                  onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                  required
                />
              </div>

            </div>
          ))}
          <div>
            <button type="button" onClick={handleSubmit} className="btnSubmit">
              Guardar producto{" "}
              <FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: "20px", color: "#fff" }} />
            </button>
          </div>
        </div>
      </form>
    </div>

  )

}


export default FormAddVariant;