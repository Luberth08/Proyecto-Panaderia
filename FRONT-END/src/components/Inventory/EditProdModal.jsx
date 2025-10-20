import React, { useEffect, useState } from "react";
import axios from "axios";

const EditProdModal = ({ product, onClose, onUpdate }) => {
  const [nombre, setNombre] = useState(product.nombre);
  const [precio, setPrecio] = useState(product.precio);
  const [stock, setStock] = useState(product.stock);
  const [stock_minimo, setStock_minimo] = useState(product.stock_minimo);
  const [ide_categoria, setIde_categoria] = useState(product.ide_categoria);
  const [categorias, setCategorias] = useState([]); // Para almacenar las categorias

  const [error, setError] = useState(""); // Para manejar errores

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
    try {
      const codigo = product.ide;
      setError("");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/productos/${codigo}`,
        {
          nombre,
          precio,
          stock,
          stock_minimo,
          ide_categoria,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onUpdate();
      onClose(); // Cerrar el modal
    } catch (error) {
      setError("Ocurrió un error al actualizar el producto.");
    }
  };

  return (
    <div className="modal-background">
      <div className="modal-content">
        <h2>Editar Producto</h2>
        {error && <p className="error-message">{error}</p>}
        <label>Nombre: </label>
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
          value={ide_categoria}
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

export default EditProdModal;
