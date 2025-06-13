import React, { useState, useEffect } from "react";

const FormAgregarProd = ( {  } ) => {

   
    const [productFormData, setProductFormData] = useState({
        name: '',
        description: '',
        sizes: '',
        colors: '',
        price: '',
        box_id: '',
    });

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setProductFormData({ ...productFormData, [name]: value });
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await createProductByBox(productFormData);
            if (data) {
                toast.success("Producto agregado al paquete con éxito");
                setProductFormData({
                    name: '',
                    description: '',
                    sizes: '',
                    colors: '',
                    price: '',
                    box_id: selectedBox?.id || '',  // Resetear ID del box
                });
                showProductsByBox(selectedBox?.id); // Actualizar productos en el modal


            } else {
                toast.error("Hubo un problema al agregar el producto. Intenta nuevamente.");
            }
        } catch (error) {
            toast.error("Error al agregar el producto. Por favor, intente más tarde.");
        }
    };

    return (
        <div className="containerFormByBox">
            <h3 className="btnCreateBox">Agregar un producto al empaque</h3>
            <form className="addProdByBox" onSubmit={handleProductSubmit}>
                <div className="formGroup">
                    <label htmlFor="name">Nombre del Producto</label>
                    <input
                        className="inputFormPBB"
                        placeholder="Nombre del producto"
                        type="text"
                        id="name"
                        name="name"
                        value={productFormData.name}
                        onChange={handleProductChange}
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="description">Descripción</label>
                    <input
                        className="inputFormPBB"
                        placeholder="Descripcion del producto"
                        type="text"
                        id="description"
                        name="description"
                        value={productFormData.description}
                        onChange={handleProductChange}
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="sizes">Talles</label>
                    <input
                        className="inputFormPBB"
                        placeholder="Talles del producto"
                        type="text"
                        id="sizes"
                        name="sizes"
                        value={productFormData.sizes}
                        onChange={handleProductChange}
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="colors">Colores</label>
                    <input
                        className="inputFormPBB"
                        placeholder="Colores del producto"
                        type="text"
                        id="colors"
                        name="colors"
                        value={productFormData.colors}
                        onChange={handleProductChange}
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="price">Precio</label>
                    <input
                        className="inputFormPBB"
                        placeholder="Precio del producto"
                        type="number"
                        id="price"
                        name="price"
                        value={productFormData.price}
                        onChange={handleProductChange}
                    />
                </div>
                <div>
                    <button type="submit" className="btnSubmit">Guardar producto  <FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: '20px', color: '#fff' }} /></button>
                </div>
            </form>
        </div>
    )

}

export default FormAgregarProd;