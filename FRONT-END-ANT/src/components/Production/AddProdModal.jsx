import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddProdModal = ({ onClose, onUpdate }) => {
  const [descripcion, setDescripcion] = useState('');
  const [selectedReceta, setSelectedReceta] = useState(null);
  const [recetas, setRecetas] = useState([]);

  const token = localStorage.getItem('token');

  const fetchRecetas = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/recetas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const recetasConNombreProducto = await Promise.all(
        response.data.map(async (receta) => {
          try {
            // Obtener el nombre del producto asociado a la receta
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/productos/${receta.ide_producto}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            // Retornar la receta con el atributo nombre_producto añadido
            return {
              ...receta,  // Mantiene los datos de la receta
              nombre_producto: data?.[0]?.nombre || 'Producto no disponible',  // Agrega el nombre del producto o un mensaje si no se encuentra
            };
          } catch (error) {
            console.error('Error al obtener el producto:', error);
            return receta;  // Si hay un error, retornamos la receta sin el nombre del producto
          }
        })
      );

      // Actualizamos el estado con las recetas modificadas
      setRecetas(recetasConNombreProducto);
    } catch (error) {
      console.error('Error al cargar las recetas:', error);
    }
  };

  useEffect(() => {
    fetchRecetas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.error('Error al agregar el proceso:', descripcion);
      console.error('Error al agregar el proceso:', selectedReceta);
      
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/producciones`,
        {
          descripcion,
          terminado: false,
          ide_receta: selectedReceta,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onUpdate(); // Actualiza el listado de procesos en el componente principal
      onClose();  // Cierra el modal
    } catch (error) {
      console.error('Error al agregar el proceso:', error);
    }
  };

  return (
    <div className="modal-background">
      <form onSubmit={handleSubmit} className="modal-content">

        <select
          value={selectedReceta}
          onChange={(e) => setSelectedReceta(e.target.value)}
        >
          <option value="">Seleccionar receta</option>
          {recetas.map((receta) => (
            <option key={receta.ide} value={receta.ide}>
              {receta.nombre_producto || 'Receta sin nombre'} {/* Aseguramos que si no hay nombre, se vea un mensaje claro */}
            </option>
          ))}
        </select>

        <label>Descripcion</label>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />

        <div className="modal-actions">
          <button type="submit">Agregar Proceso</button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProdModal;
