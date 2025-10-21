import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddCatModal from './AddCatModal';
import EditCatModal from './EditCatModal';
import Producto from './Producto';
import Search from '../search';
import '../../styles/section.css'; // Asegúrate de crear este archivo para los estilos

export const Categoria = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [prod, setProd] = useState(false);
  const [selected, setSelected] = useState(null);
  const Role = JSON.parse(localStorage.getItem('user')).ide_rol;
  
  const [filteredCategorias, setFilteredCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('token');
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/categorias`,
          {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
        setCategorias(response.data);
        setFilteredCategorias(response.data);
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  const handleUpdate = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/categorias`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
      setCategorias(response.data);
      setFilteredCategorias(response.data);
    } catch (error) {
      console.error('Error al actualizar la lista de categorías:', error);
    }
  };

  const handleModify = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/categorias/${selected}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedCategorias = categorias.filter(categoria => categoria.ide !== selected);
      setCategorias(updatedCategorias);
      setFilteredCategorias(updatedCategorias);
      setSelected(null);
    } catch (error) {
      console.error('Error al eliminar la categoria:', error);
    }
  };

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = categorias.filter(categoria =>
      categoria.nombre.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCategorias(filtered);
  };

  return (
    <>
      {prod ? 
      <Producto 
        category={categorias.find((categoria) => categoria.ide === selected)} 
        back={() => setProd(false)} />
      :
      (
        <div className="background">
          <h2>Categorías</h2>
          <Search value={searchTerm} onChange={handleSearchChange} /> 
          
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredCategorias.map(categoria => (
                <tr
                  key={categoria.ide}
                  className={selected === categoria.ide ? 'selected' : ''}
                  onClick={() => setSelected(categoria.ide)}
                >
                  <td>{categoria.nombre}</td>
                  <td>{categoria.descripcion}</td>
                  <td>
                    <button 
                      className="view-btn"
                      onClick={() => { 
                        setProd(true); 
                        setSelected(categoria.ide); 
                      }}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="action-buttons">
            {console.log(Role)}
            {Role === 'RL01' && (
              <button className='add-btn' onClick={() => setIsAddModalOpen(true)}>Añadir</button>      
            )}
            <button className="modify-btn" onClick={handleModify} disabled={!selected}>Modificar</button>
            <button className="delete-btn" onClick={handleDelete} disabled={!selected}>Eliminar</button>
          </div>

          {isEditModalOpen && (
            <EditCatModal
              category={categorias.find(categoria => categoria.ide == selected)}
              onClose={() => setIsEditModalOpen(false)}
              onUpdate={handleUpdate}
            />
          )}
          {isAddModalOpen && (
            <AddCatModal
              onClose={() => setIsAddModalOpen(false)}
              onUpdate={handleUpdate}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Categoria;
