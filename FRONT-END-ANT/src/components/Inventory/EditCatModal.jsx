import React, { useState } from 'react'
import axios from 'axios';


export const EditCatModal = ({ category, onClose, onUpdate }) => {
  const [nombre, setNombre] = useState(category.nombre);
  const [descripcion, setDescripcion] = useState(category.descripcion);
  
  const [error, setError] = useState(''); // Para manejar errores
  const token = localStorage.getItem('token');
  const handleSave = async (e) => {
  try{
    const codigo=category.ide;
    setError('');
    await axios.put(`${import.meta.env.VITE_API_URL}/api/categorias/${codigo}`, {
        nombre,
        descripcion
    },
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    onUpdate(); 
    onClose(); // Cerrar el modal
} catch (error) {
    setError('Ocurrió un error al actualizar la categoria.'); 
  }
  };
  
  return (
    <div className='modal-background'>
      <div className="modal-content">
        <h2>Editar Categoria</h2>
        {error && <p className="error-message">{error}</p>}
        <label>Nombre: </label>
        <input type='text' value={nombre} onChange={(e) => setNombre(e.target.value)} />
        
        <label>Descripcion:</label>
        <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        

        
        <button onClick={handleSave}>Guardar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  )
}

export default EditCatModal;