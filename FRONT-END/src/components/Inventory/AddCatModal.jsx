import React, { useState } from 'react'
import axios from 'axios';


export const AddCatModal = ({ onClose, onUpdate }) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [error, setError] = useState(''); // Para manejar errores

    const token = localStorage.getItem('token');
    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/categorias`, {
            nombre,
            descripcion
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.success) {
            setError('La categoria ya existe.'); // Mensaje de error
            return;
          }
          onUpdate(); // Llamar a onUpdate para refrescar la lista de proveedores
          onClose(); // Cerrar el modal
        } catch (error) {
          console.error('Error al agregar la categoria:', error);
          setError('Ocurrió un error al agregar la categoria.'); // Mensaje de error
        }
        }

  return (
    <div className="modal-background">
      <div className="modal-content">
        <h2>Agregar Categorias</h2>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción:</label>
            <input
              type="text"
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>

            <button type="submit" >Guardar</button>
            <button type="button"  onClick={onClose}>Cancelar</button>
          
        </form>

      </div>
  </div>
  )
}

export default AddCatModal;
