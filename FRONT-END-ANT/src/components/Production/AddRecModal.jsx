import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddRecModal = ({ onClose, onUpdate }) => {
  const [unidades, setUnidades] = useState('');
  const [tiempo, setTiempo] = useState('00:00');
  const [productos, setProductos] = useState([]);
  const [ideProducto, setIdeProducto] = useState('');
 const token = localStorage.getItem('token');
 
  // Efecto para cargar productos desde la API al montar el componente
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/productos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProductos(response.data);
      } catch (error) {
        console.error('Error fetching productos:', error);
      }
    };
    fetchProductos();
  }, []);

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convierte el valor del campo `time` a formato HH:MM:SS
    const tiempoFormato = `${tiempo}:00`;  // Asumiendo que el tiempo siempre será HH:MM

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/recetas`, {
        unidades,
        tiempo: tiempoFormato,
        ide_producto: ideProducto,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onUpdate(); // Actualiza la lista de recetas en el componente principal
      onClose();  // Cierra el modal o formulario
    } catch (error) {
      console.error('Error al agregar la receta:', error);
    }
  };

  return (
    <div className='modal-background'>
    <form onSubmit={handleSubmit} className='modal-content'>
      <label>Producto</label>
      <select
        value={ideProducto}
        onChange={(e) => setIdeProducto(e.target.value)}
        required
      >
        <option value="">Seleccione un producto</option>
        {productos.map((producto) => (
          <option key={producto.ide} value={producto.ide}>
            {producto.nombre}
          </option>
        ))}
      </select>

      <label>Unidades:</label>
      <input
        type="number"
        value={unidades}
        onChange={(e) => setUnidades(e.target.value)}
        required
      />
      
      <label>Tiempo:</label>
      <input
        type="time"
        value={tiempo}
        onChange={(e) => setTiempo(e.target.value)}
        required
      />

        <button type="submit">Agregar Receta</button>
        <button onClick={onClose}>Cancelar</button>
    </form>
    </div>
  );
};

export default AddRecModal;
