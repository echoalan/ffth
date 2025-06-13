import React, { useState, useEffect } from "react";
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
import { ToastContainer, toast } from "react-toastify";
import getAllProducts from "../../services/ProductsService/getAllProducts";
import FormCreateProduct from "./formCreateProduct/FormCreatePRoduct";
import Empaquetar from "./Empaquetar/Empaquetar";
import FormAddVariant from "./formAddVariant/FormAddVariant";
import FormEditarVariant from "./formEditarVariant/FormEditarVariant";
import FormEditProduct from "./formEditProduct/FormEditProduct"
import Colores from "./Colores/Colores";
import Talles from "./Talles/Talles";
import PATH_IMG from "../../services/PATH_IMG";

const ProductsComponent = () => {
  const [openModalEditProd, setopenModalEditProd] = useState(false);
  const [idProdToAct, setIdProdToAct] = useState("")
  const [openModalForm, setOpenModalForm] = useState(false);
  const [modalVerFotos, setModalVerFotos] = useState(false);
  const [productToViewPhotos, setProductToViewPhotos] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [allProducts, setAllProducts] = useState([]);
  const [openModalEmpaquetar, setOpenModalEmpaquetar] = useState(false);
  const [productId, setProductId] = useState(null);
  const [openVariants, setOpenVariants] = useState({});
  const [openAddVariants, serOpenVariats] = useState(false);
  const [openEditVariant, setOpenEditVariants] = useState(false);
  const [idProdToAddVariant, setIdProdToAddVariant] = useState("")
  const [idProdToUpdtadeVariant, setIdProdUpdateVariant] = useState("");
  const [modalColores, setModalColores] = useState(false);
  const [modalTalles, setModalTalles] = useState(false);


  const handleOpenModalEmpaquetar = (id_product) => {

    console.log(id_product)

    setOpenModalEmpaquetar(!openModalEmpaquetar);
    setProductId(id_product);

  };
  const handleCloseModalEmpaquetar = () => {
    setOpenModalEmpaquetar(false);
  };

  const toggleModalForm = () => {
    setOpenModalForm(!openModalForm);
  };

  const closeModalForm = () => {
    setOpenModalForm(false);
  };

  const showAllProducts = async () => {
    try {
      const data = await getAllProducts();
      setAllProducts(data);
      console.log(data)
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const openModalVerFotos = (product) => {
    setProductToViewPhotos(product);
    setModalVerFotos(true);
  };

  const closeModalVerFotos = () => {
    setModalVerFotos(false);
    setCurrentImage(0);
  }

  const handleNextImage = () => {
    if (!productToViewPhotos) return;
    setCurrentImage((prev) =>
      prev === productToViewPhotos.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    if (!productToViewPhotos) return;
    setCurrentImage((prev) =>
      prev === 0 ? productToViewPhotos.images.length - 1 : prev - 1
    );
  };

  const toggleVariants = (productId) => {
    setOpenVariants((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  //addVariant

  const openModalVariant = (idProd) => {
    setIdProdToAddVariant(idProd)
    serOpenVariats(true)
  }

  const closeOpenModalVariant = () => {
    setIdProdToAddVariant("")
    serOpenVariats(false);

  }


  //edit variants

  const openModalEditVariant = (idVariantUpdate) => {
    setOpenEditVariants(true);
    setIdProdUpdateVariant(idVariantUpdate)
  }

  const closeModalEditVariant = () => {

    setOpenEditVariants(false);

  }

  //edit prod

  const openEditProd = (id) => {
    setopenModalEditProd(!openModalEditProd)
    setIdProdToAct(id)
  }

  //colores


  const openCloseModalColores = () => {
    setModalColores(!modalColores)
  }


  //talles

  const openCloseModalTalles = () =>{
    setModalTalles(!modalTalles);
  }

  useEffect(() => {
    showAllProducts();
  }, []);

  useEffect(() => {
    if (modalVerFotos) setCurrentImage(0);
  }, [modalVerFotos]);

  return (
    <article className="articleProducts">
      <div className="actionsProducts">
        <div className="casperActionBtns">
          <button className="btnOpenModal" onClick={openCloseModalColores}>
            Colores <FontAwesomeIcon icon={faPalette} style={{ fontSize: "15px", color: "#fff", paddingTop: "2px" }}  />
          </button>
          <button className="btnOpenModal"  onClick={openCloseModalTalles}>
            Talles <FontAwesomeIcon icon={faShirt} style={{ fontSize: "15px", color: "#fff", paddingTop: "2px" }}  />
            </button>
          <button className="btnOpenModal g" onClick={toggleModalForm}>
            Agregar un nuevo producto <FontAwesomeIcon icon={faSquarePlus} style={{ fontSize: "15px", color: "#fff", paddingTop: "2px" }} />
          </button>
        
          {openModalForm && (
            <FormCreateProduct refetch={showAllProducts} onClose={closeModalForm} />
          )}
          {
            modalColores &&(
              <Colores onClose={openCloseModalColores} />
            )
          }
          {
            modalTalles &&(
              <Talles onClose={openCloseModalTalles}/>
            )
          }
        </div>
      </div>
      <div className="containerProductsV">
        <h2 className="titleBox tbp">Productos
          <FontAwesomeIcon icon={faBoxOpen} style={{ fontSize: '20px', color: '#fff' }} />
        </h2>
        <div className="tableProducts">
          <div className="headerTableProducts">
            <div className="headerItem">Art</div>
            <div className="headerItem">Descripción</div>
            <div className="headerItem dateBI">Fecha ingreso</div>
            <div className="headerItem actionsBItem"></div>
          </div>

          <div className="bodyTableProducts">
            <div className="casperBodyTableProducts">
              {allProducts.map((product) => (
                <div key={product.id} className="productItemWrapper">
                  <div className="productItem">
                    <p className="bodyItem"><strong className="strongMobileP">Art: </strong>{product.name}</p>
                    <p className="bodyItem"><strong className="strongMobileP">Descripción: </strong>{product.description}</p>
                    <p className="bodyItem dateBI">
                      <strong className="strongMobileP">Fecha: </strong>
                      {new Date(product.created_at).toLocaleDateString()}
                    </p>
                    <p className="bodyItem actionsBItem">
                      <button className="btnVerFoto" onClick={() => openModalVerFotos(product)}>
                        Fotos <FontAwesomeIcon icon={faImages} style={{ fontSize: "15px", color: "#fff", paddingTop: "2px" }} />
                      </button>

                      <button onClick={()=>{openEditProd(product)}}  className="btnActualizarV">
                        Editar <FontAwesomeIcon icon={faPenToSquare} style={{ fontSize: "15px", color: "#fff", paddingTop: "2px" }} />
                      </button>

                      <button
                        className={`btnToggleVariants ${openVariants[product.id] ? "activo" : ""}`}
                        onClick={() => toggleVariants(product.id)}
                      >
                       Variantes <FontAwesomeIcon icon={faEye}  style={{ fontSize: "15px", color: "#fff", paddingTop: "2px" }}/> 
                      </button>
                      <button onClick={() => { openModalVariant(product.id) }} className="agregarVarianteBtn">
                        Agregar variante <FontAwesomeIcon icon={faSquarePlus} style={{ fontSize: "15px", color: "#fff", paddingTop: "2px" }} /> 
                      </button>
                    </p>
                  </div>

                  {/* VARIANTES */}
                  {openVariants[product.id] && (
                    <div className="containerVrianList">
                      <h3 className="h3TitleVariantList">Variantes</h3>
                      <div className="variantList">
                        <div className="casperOneVarianList">
                          <div className="variantHeader">
                            <div className="variantCol">Modelo</div>
                            <div className="variantCol">Peso</div>
                            <div className="variantCol">Talle</div>
                            <div className="variantCol">Color</div>
                            <div className="variantCol">Precio min</div>
                            <div className="variantCol">Precio may</div>
                            <div className="variantCol">Cantidad</div>
                            <div className="variantCol actionColumn">Acciones</div>
                          </div>
                          {product.product_variants.map((variant) => (
                            <div key={variant.id} className="variantItem">
                              <div className="variantColB">{variant.model}</div>
                              <div className="variantColB">{variant.weight}</div>
                              <div className="variantColB">{variant.size?.size}</div>
                              <div className="variantColB">{variant.color?.color}</div>
                              <div className="variantColB">${variant.retail_price}</div>
                              <div className="variantColB">${variant.wholesale_price}</div>
                              <div className="variantColB">{variant.quantity}</div>
                              <div className="variantColB actionColumn">
                                <button onClick={()=>{openModalEditVariant(variant.id)}} className="btnEditar">Editar</button>
                                <button className="btnEmpaquetar" onClick={() => handleOpenModalEmpaquetar(variant.id)}>Empaquetar</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {modalVerFotos && productToViewPhotos && (
              <div className="modalVerFotos">
                <div className="modalContent">
                  <button className="btnCloseModalVF" onClick={closeModalVerFotos}>×</button>

                  <div className="carouselContainer">
                    <button className="carouselBtn left" onClick={handlePrevImage}>❮</button>

                    <img
                      src={'http://localhost:8000/storage/' + productToViewPhotos.images[currentImage].image_path}
                      alt={`Imagen de ${productToViewPhotos.name}`}
                      className="carouselImage"
                    />

                    <button className="carouselBtn right" onClick={handleNextImage}>❯</button>
                  </div>

                  <p className="carouselCounter">
                    {currentImage + 1} / {productToViewPhotos.images.length}
                  </p>
                </div>
              </div>
            )}


           
          </div>
        </div>
      </div>
      {
        openModalEmpaquetar && (
          <Empaquetar id_product={productId} refetchProd={showAllProducts} onClose={handleCloseModalEmpaquetar} />
        )
      }
      {
        openAddVariants && (
          <div className="modalAddVariant">
            <FormAddVariant idProd={idProdToAddVariant} refetch={showAllProducts} onClose={closeOpenModalVariant}/>
          </div>
        )
      }
      {
        openEditVariant && (
          <div className="modalEditarVariant"> 
            <FormEditarVariant close={closeModalEditVariant} refetch={showAllProducts} idProdUpdate={idProdToUpdtadeVariant} />
          </div>
        )
      }
      {
        openModalEditProd && (
          <FormEditProduct productAct={idProdToAct} refetch={showAllProducts} closeModalEP={openEditProd}/>
        )
      }
      <ToastContainer />
    </article>
  );
};

export default ProductsComponent;