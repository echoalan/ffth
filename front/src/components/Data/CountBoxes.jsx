import React, { useState, useEffect } from "react";
import getAllBoxes from "../../services/PaquetesService/getAllBox";
import getAllProducts from "../../services/ProductsService/getAllProducts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faShirt } from "@fortawesome/free-solid-svg-icons";

const CountBoxes = () => {
  const [boxes, setBoxes] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const [boxResponse, productResponse] = await Promise.all([
        getAllBoxes(),
        getAllProducts(),
      ]);

      setBoxes(boxResponse);
      setProducts(productResponse);

      const total = productResponse.reduce((sum, product) => {
        const variantsTotal = product.product_variants.reduce(
          (variantSum, variant) => variantSum + Number(variant.quantity),
          0
        );
        return sum + variantsTotal;
      }, 0);

      setTotalQuantity(total);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      {loading && <p className="loading">Cargando...</p>}
      {error && <p className="error">Hubo un error al cargar los datos.</p>}
      {!loading && !error && (
        <div className="stats-grid">
          <div className="card">
            <FontAwesomeIcon icon={faBoxOpen} className="icon" />
            <h2 className="count">{boxes.length}</h2>
            <p className="label">Empaques registrados</p>
          </div>
          <div className="card">
            <FontAwesomeIcon icon={faShirt} className="icon" />
            <h2 className="count">{totalQuantity}</h2>
            <p className="label">Unidades en stock</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountBoxes;
