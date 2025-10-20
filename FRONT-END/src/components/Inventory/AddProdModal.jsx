import React, { useState, useEffect } from "react";
import axios from "axios";

const AddProdModal = ({ ide_categoria, onClose, onUpdate }) => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [stock_minimo, setStock_minimo] = useState("");
  const [id_cat, setIde_categoria] = useState(ide_categoria);
  const [categorias, setCategorias] = useState([]);

  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/categorias`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategorias(response.data);
      } catch (error) {
        console.error("Error al cargar las categorías:", error);
      }
    };
    fetchCategorias();
  }, []);
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/productos`,
        {
          nombre,
          precio,
          stock,
          stock_minimo,
          ide_categoria: id_cat,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setError("El producto ya existe.");
        return;
      }
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      setError("Ocurrió un error al agregar el producto."); // Mensaje de error
    }
  };
  return (
    <div className="modal-background">
      <div className="modal-content">
        <h2>Agregar Producto</h2>
        {error && <p className="error-message">{error}</p>}
        <label>Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <label>Precio:</label>
        <input
          type="text"
          value={precio}
          placeholder="16.5"
          onChange={(e) => setPrecio(e.target.value)}
        />
        <label>Stock:</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <label>Stock Minimo:</label>
        <input
          type="number"
          value={stock_minimo}
          onChange={(e) => setStock_minimo(e.target.value)}
        />
        <label>Categoria:</label>
        <select
          value={id_cat}
          onChange={(e) => setIde_categoria(e.target.value)}
        >
          {categorias.map((categoria) => (
            <option key={categoria.ide} value={categoria.ide}>
              {categoria.nombre}
            </option>
          ))}
        </select>

        <button onClick={handleSave}>Guardar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default AddProdModal;
