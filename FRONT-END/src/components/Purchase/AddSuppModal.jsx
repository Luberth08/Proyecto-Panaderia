import React, { useState } from 'react'
import axios from 'axios';

export const AddSuppModal = ({ onClose, onUpdate }) => {
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [sexo, setSexo] = useState('M');
  const [telefono, setTelefono] = useState(0);
  const [estado, setEstado] = useState('Disponible');
  const [error, setError] = useState(''); // Para manejar errores
  const role= JSON.parse(localStorage.getItem('user')).ide_rol;
  
  const token = localStorage.getItem('token');

  const handleSave = async (e) => {
  e.preventDefault();
  setError('');
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/proveedores`, {
      codigo,
      nombre,
      sexo,
      telefono,
      estado,
      role
    },
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    onUpdate(); // Llamar a onUpdate para refrescar la lista de proveedores
    onClose(); // Cerrar el modal
  } catch (error) {
    console.error('Error al agregar el proveedor:', error);
    setError('Ocurrió un error al agregar el proveedor.'); // Mensaje de error
  }
  }
  return (
    
    <div className="modal-background">
      <div className="modal-content">
        <h2>Agregar Proveedores</h2>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="codigo">Código:</label>
            <input
              type="text"
              id="codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />
          </div>

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
            <label htmlFor="sexo">Sexo:</label>
            <select
              id="sexo"
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
              required
            >
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono:</label>
            <input
              type="text"
              id="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="estado">Estado:</label>
            <select
              id="estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              required
            >
              <option value="Disponible">Disponible</option>
              <option value="Indisponible">Indisponible</option>
            </select>
          </div>

            <button type="submit" >Guardar</button>
            <button type="button"  onClick={onClose}>Cancelar</button>
          
        </form>
      </div>
  </div>
  )

}

export default AddSuppModal;