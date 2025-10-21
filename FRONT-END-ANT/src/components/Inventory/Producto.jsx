import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Search from "../search";
import AddProdModal from "./AddProdModal";
import EditProdModal from "./EditProdModal";
export const Producto = ({ category, back }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productos, setProductos] = useState([]);
  const [selected, setSelected] = useState(null);

  const token = localStorage.getItem("token");

  const [filtered, setFiltered] = useState([]); // Estado para categorías filtradas
  const [searchTerm, setSearchTerm] = useState(""); // Estado para término de búsqueda

  const fetchProductos = async () => {
    try {
      const url = category
        ? `${import.meta.env.VITE_API_URL}/api/productos/categoria/${
            category.ide
          }`
        : `${import.meta.env.VITE_API_URL}/api/productos`;

      // Hacer la solicitud
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProductos(response.data);
      setFiltered(response.data);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleModify = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selected) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/productos/${selected}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedProductos = productos.filter(
        (producto) => producto.ide !== selected
      );
      setProductos(updatedProductos);

      setFiltered(updatedProductos);
      setSelected(null);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(term.toLowerCase())
    );
    setFiltered(filtered);
  };

  return (
    <div className="background">
      <h2>Gestión de Productos</h2>
      {category && (
        <>
          <h3>Categoria: {category.nombre}</h3>
          <button onClick={back}>Categorias</button>
        </>
      )}
      <Search value={searchTerm} onChange={handleSearchChange} />

      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Stock Mínimo</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((producto) => (
            <tr
              key={producto.ide}
              className={selected === producto.ide ? "selected" : ""}
              onClick={() => setSelected(producto.ide)}
            >
              <td>{producto.nombre}</td>
              <td>{producto.precio}</td>
              <td>{producto.stock}</td>
              <td>{producto.stock_minimo}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="action-buttons">
        <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
          Agregar Producto
        </button>
        <button
          className="modify-btn"
          onClick={handleModify}
          disabled={!selected}
        >
          Modificar
        </button>
        <button
          className="delete-btn"
          onClick={handleDelete}
          disabled={!selected}
        >
          Eliminar
        </button>
      </div>

      {isEditModalOpen && (
        <EditProdModal
          product={productos.find((producto) => producto.ide === selected)}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={fetchProductos}
        />
      )}
      {isAddModalOpen && (
        <AddProdModal
          ide_categoria={category || null}
          onClose={() => setIsAddModalOpen(false)}
          onUpdate={fetchProductos}
        />
      )}
    </div>
  );
};

export default Producto;
