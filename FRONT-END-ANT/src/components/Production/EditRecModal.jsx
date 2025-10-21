import React, { useState } from 'react';
import axios from 'axios';

const EditRecModal = ({ receta, producto, onClose, onUpdate }) => {
  const [unidades, setUnidades] = useState(receta.unidades);
  const [tiempo, setTiempo] = useState(receta.tiempo);
  const [error, setError] = useState('');
const token = localStorage.getItem('token');
  // Maneja la lógica de envío del formulario
  const handleSave = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    try {
      setError(''); // Limpiar mensajes de error
      await axios.put(`${import.meta.env.VITE_API_URL}/api/recetas/${receta.ide}`, {
        unidades,
        tiempo,
        ide_producto: producto.ide_producto,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onUpdate(); // Actualiza la lista de recetas
      onClose(); // Cierra el modal
    } catch (error) {
      setError('Ocurrió un error al actualizar la receta.');
      console.error('Error al actualizar la receta:', error);
    }
  };

  return (
    <div className="modal-background">
      <div className="modal-content">
        <h2>Editar Receta</h2>
        {error && <p className="error-message">{error}</p>}

        <h3>{producto.nombre}</h3>
        
        <form onSubmit={handleSave}>
          <div>
            <label>Unidades:</label>
            <input
              type="number"
              value={unidades}
              onChange={(e) => setUnidades(Number(e.target.value))}
              required // Agrega validación
            />
          </div>

          <div>
            <label>Tiempo de Preparación:</label>
            <input
              type="time"
              value={tiempo}
              onChange={(e) => setTiempo(e.target.value)}
              required // Agrega validación
            />
          </div>

          <div className="modal-actions">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecModal;
