import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/itemCard.css';
import EditRecModal from './EditRecModal';
import AddRecModal from './AddRecModal';

const ListaReceta = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [recetas, setRecetas] = useState([]);
  const [detalleRecetas, setDetalleRecetas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [verReceta, setVerReceta] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRecetas();
  }, []);

  const fetchRecetas = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/recetas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecetas(response.data);

      const productosPromises = response.data.map(async (receta) => {
        const responseP = await axios.get(`${import.meta.env.VITE_API_URL}/api/productos/${receta.ide_producto}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return {
          ide_producto: responseP.data[0].ide,
          nombre: responseP.data[0].nombre,
        };
      });
      const productosData = await Promise.all(productosPromises);
      setProductos(productosData);
    } catch (error) {
      console.error('Error al cargar las recetas:', error);
    }
  };

  const handleSelectReceta = async (recetaId) => {
    setSelected(recetaId);
    setVerReceta(false);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/detalle_recetas/${recetaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDetalleRecetas(response.data);
      
    } catch (error) {
      console.error('Error al cargar los detalles de la receta:', error);
    }
  };

  const handleModify = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/recetas/${selected}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecetas((prevRecetas) => prevRecetas.filter((receta) => receta.ide !== selected));
      setSelected(null);
      setVerReceta(true);
    } catch (error) {
      console.error('Error al eliminar la receta:', error);
    }
  };

  const handleUpdate = async () => {
    await fetchRecetas();
  };

  return (
    <>
      {verReceta ? (
        <>
          <h2>Lista de Recetas</h2>
          <div className="items-list">
            <div className="item-card" onClick={() => setIsAddModalOpen(true)}>
              <h3>+</h3>
              <p>Añadir receta</p>
            </div>
            {recetas.map((receta, index) => {
              const producto = productos.find((prod) => prod.ide_producto === receta.ide_producto);
              return (
                <div
                  key={receta.ide || index} // Usa índice como respaldo
                  className="item-card"
                  onClick={() => handleSelectReceta(receta.ide)}
                >
                  <h3>{producto ? producto.nombre : 'Producto no encontrado'}</h3>
                  <p>Unidades: {receta.unidades}</p>
                  <p>Tiempo: {receta.tiempo}</p>
                </div>
              );
            })}

          </div>
        </>
      ) : (
        <div className="item-detail">
          <button onClick={() => { setVerReceta(true); setSelected(null); }}>Volver a la lista</button>
          {selected && (
            <>
              <div className="action-buttons">
                <button className="modify-btn" onClick={handleModify} disabled={!selected}>
                  Modificar
                </button>
                <button className="delete-btn" onClick={handleDelete} disabled={!selected}>
                  Eliminar
                </button>
              </div>
              <h2>
                {productos.find((prod) => prod.ide_producto === recetas.find((receta) => receta.ide === selected)?.ide_producto)?.nombre}
              </h2>
              <p>Unidades: {recetas.find((receta) => receta.ide === selected)?.unidades}</p>
              <p>Tiempo: {recetas.find((receta) => receta.ide === selected)?.tiempo}</p>
              <h3>Ingredientes</h3>
              <div className="items-list">
                {detalleRecetas.map((detalle, index) => (
                  <div key={detalle.ide_insumo || index} className="item-card">
                    <p>Insumo: {detalle.nombre_insumo}</p>
                    <p>Cantidad: {detalle.cantidad} {detalle.medida}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {isEditModalOpen && (
        <EditRecModal
          receta={recetas.find((receta) => receta.ide === selected)}
          producto={productos.find((prod) => prod.ide_producto === recetas.find((receta) => receta.ide === selected)?.ide_producto)}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
      {isAddModalOpen && (
        <AddRecModal
          onClose={() => setIsAddModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
};

export default ListaReceta;
