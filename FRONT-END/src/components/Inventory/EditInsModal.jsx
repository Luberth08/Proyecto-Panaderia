import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/modal.css';
const EditInsModal = ({ insumo, onClose, onUpdate }) => {
  const [nombre, setNombre] = useState(insumo?.nombre || '');
  const [medida, setMedida] = useState(insumo?.medida || '');
  const [stock, setStock] = useState(insumo?.stock || '');
  const [stockMinimo, setStockMinimo] = useState(insumo?.stock_minimo || '');
const token = localStorage.getItem('token');

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/insumos/${insumo.ide}`, {
        nombre,
        medida,
        stock,
        stock_minimo: stockMinimo,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onUpdate(); // Llamar para refrescar la lista de insumos
      onClose();  // Cerrar el modal después de guardar
    } catch (error) {
      console.error('Error al actualizar el insumo:', error);
    }
  };

  return (
    <div className="modal-background">
     <div className="modal-content">
      
      <h2>Editar Insumo</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </label>
        <label>
          Stock (en {medida}):
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </label>
        <label>
          Stock Mínimo (en {medida}):
          <input
            type="number"
            value={stockMinimo}
            onChange={(e) => setStockMinimo(e.target.value)}
          />
        </label>
        <button type="submit">Guardar Cambios</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
      </div> 
    </div>
  );
};

export default EditInsModal;
