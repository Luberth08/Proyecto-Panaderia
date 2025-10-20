import React, { useEffect,useState } from 'react';
import axios from 'axios';

export const EditSuppModal = ({ supplier, onClose, onUpdate }) => {
  const [nombre, setNombre] = useState(supplier.nombre);
  const [sexo, setsexo] = useState(supplier.sexo);
  const [telefono, setTelefono] = useState(supplier.telefono);
  const [estado, setEstado] = useState(supplier.estado);
  const [error, setError] = useState(''); // Para manejar errores
  const Role= JSON.parse(localStorage.getItem('user')).ide_rol;
 const token = localStorage.getItem('token');

  const handleSave = async (e) => {
  try{
    const codigo=supplier.codigo;

    setError('');
     await axios.put(`${import.meta.env.VITE_API_URL}/api/proveedores/${codigo}`, {
      codigo,
      nombre,
      sexo,
      telefono,
      estado
    },
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    onUpdate(); // Llamar a onUpdate para refrescar la lista de proveedores
    onClose(); // Cerrar el modal
  } catch (error) {
    console.error('Error al actualizar el proveedor:', error);
    setError('Ocurrió un error al actualizar el proveedor.'); // Mensaje de error
  }
  };

  return (
    <div className='modal-background'>
      <div className="modal-content">
        <h2>Editar proveedor</h2>
        {error && <p className="error-message">{error}</p>}
        <label>Nombre: </label>
        <input type='text' value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <label>Sexo:</label>
        <select value={sexo} onChange={(e) => setsexo(e.target.value)}>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
        </select>
        <label>Teléfono:</label>
        <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        <label>Estado:</label>
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="Disponible">Disponible</option>
            <option value="Indisponible">Indisponible</option>
        </select>

        
        <button onClick={handleSave}>Guardar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  )
}
export default EditSuppModal;