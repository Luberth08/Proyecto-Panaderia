import React, { useState } from 'react';
import axios from 'axios';

const AddInsModal = ({ onClose, onUpdate }) => {
  const [nombre, setNombre] = useState('');
  const [medida, setMedida] = useState('');
  const [stock, setStock] = useState('');
  const [stockMinimo, setStockMinimo] = useState('');
  const token = localStorage.getItem('token');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/insumos`, {
        nombre,
        medida,
        stock,
        stock_minimo: stockMinimo,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onUpdate(); // Refrescar la lista de insumos
      onClose();  // Cerrar el modal
    } catch (error) {
      console.error('Error al agregar el insumo:', error);
    }
  };

  return (
    <div className="modal-background">
      <div className="modal-content">
        <h2>Agregar Insumo</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </label>
          <label>
            Medida:
            <input
              type="text"
              value={medida}
              onChange={(e) => setMedida(e.target.value)}
              required
              placeholder='Ejemplo: kg, g, l, ml, u, etc.'
            />
          </label>
          <label>
            Stock:
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </label>
          <label>
            Stock Mínimo:
            <input
              type="number"
              value={stockMinimo}
              onChange={(e) => setStockMinimo(e.target.value)}
              required
            />
          </label>
          <button type="submit">Agregar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default AddInsModal;
