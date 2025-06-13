import React, { useState, useEffect } from "react";
import createProduct from "../../../services/ProductsService/createProduct";
import getSizes from "../../../services/SizeService/getSizes";
import getColores from "../../../services/ColorService/getColor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPaperPlane,faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";


const FormCreateProduct = ({ refetch, onClose }) => {

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

  const [newImages, setNewImages] = useState(null);

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

  const addVariant = () => {
    setVariants([...variants, { model:"", weight: "", color: "", size: "", stock: "", retail_price: "", wholesale_price: "" }]);
  };

  const removeVariant = (index) => {
    const filtered = variants.filter((_, i) => i !== index);
    setVariants(filtered);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("variants", JSON.stringify(variants));

      if (newImages) {
        Array.from(newImages).forEach((image) => {
          formData.append("images[]", image);
        });
      }

      // DEBUG: Ver contenido del FormData
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      await createProduct(formData);
      toast.success("Producto creado exitosamente!");
      refetch();
      onClose();

    } catch (error) {
      console.error("Error al crear el producto:", error);
      toast.error("Hubo un error al crear el producto.");
    }
  };


  useEffect(() => {

    showSizes();
    showColores();

  }, [])

  return (
    <div className="containerFormInserProd">
      
      <div className="casperFormInsertProd">
        <h2>Nuevo Producto</h2>
       {/*  <div className="headerFormInserProd">
         <h2 className="btnCreateBox">
            <FontAwesomeIcon icon={faPlus} style={{ fontSize: "20px", color: "#fff" }} />
            Agregar un nuevo producto
          </h2>
         
        </div>*/}
        <button className="btnCloseModalVF" onClick={onClose}>×</button>
        <form className="addProd" onSubmit={handleSubmit}>
          <div className="containerTopFormAddProd">
            <div className="formGroup fgupmg">
              <label htmlFor="name">Art</label>
              <input
                className="inputFormPBB"
                placeholder="Articulo del producto"
                type="text"
                id="name"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="formGroup fgupmg">
              <label htmlFor="description">Descripción</label>
              <input
                className="inputFormPBB"
                placeholder="Descripción del producto"
                type="text"
                id="description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
        
          <div className="formGroup variants">
            <div className="casperTopAddVariant">
              <button type="button" className="addVariant" onClick={addVariant}>Agregar variante</button>
              <label>Variantes</label>
            </div>
            {variants.map((variant, index) => (
              <div className="variantRow" key={index}>
                 <input
                  type="text"
                  placeholder="Modelo"
                  value={variant.model}
                  onChange={(e) => handleVariantChange(index, "model", e.target.value)}
                  required
                />
                  <input
                  type="number"
                  placeholder="Peso"
                  value={variant.weight}
                  onChange={(e) => handleVariantChange(index, "weight", e.target.value)}
                  required
                />
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
                <input
                  type="number"
                  placeholder="Precio minorista"
                  value={variant.retail_price}
                  onChange={(e) => handleVariantChange(index, "retail_price", e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Precio mayorista"
                  value={variant.wholesale_price}
                  onChange={(e) => handleVariantChange(index, "wholesale_price", e.target.value)}
                  required
                />
                 <input
                  type="number"
                  placeholder="Stock"
                  value={variant.stock}
                  onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                  required
                />
                <button type="button" className="removeVariant" onClick={() => removeVariant(index)}>
                  <FontAwesomeIcon icon={faTrash} style={{ fontSize: "20px", color: "#fff" }} />
                </button>
              </div>
            ))}
            
          </div>

          <div className="formGroup">
            <label className="labelImages" htmlFor="images">Agregá tus imagenes</label>
            <input
              className="inputFormImages"
              type="file"
              id="images"
              name="images"
              multiple
              accept="image/*"
              onChange={(e) => setNewImages(e.target.files)}
              required
            />
          </div>
          <div>
            <button type="submit" className="btnSubmit">
              Guardar producto{" "}
              <FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: "20px", color: "#fff" }} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormCreateProduct;
