import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Search from '../search';
import EditInsModal from './EditInsModal';
import AddInsModal from './AddInsModal';

export const Insumo = () => {  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [insumos, setInsumos] = useState([]);
  const [selected, setSelected] = useState(null);
  
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('token');
  
  const fetchInsumos = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/insumos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInsumos(response.data);
      setFiltered(response.data);
    } catch (error) {
      console.error('Error al cargar los insumos:', error);
    }
  };

  useEffect(() => {
    fetchInsumos();
  }, []);

  const handleModify = () => {
    if (selected) setIsEditModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/insumos/${selected}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedInsumos = insumos.filter(insumo => insumo.ide !== selected);
      setInsumos(updatedInsumos);
      setFiltered(updatedInsumos);
      setSelected(null); // Limpiar selección después de eliminar
    } catch (error) {
      console.error('Error al eliminar el insumo:', error);
    }
  };

  const handleSearch = (searchTerm) => {
    
    const term = searchTerm.target.value;
    setSearchTerm(term);
    if (term === '') {
      setFiltered(insumos);
    } else {
      const results = insumos.filter(insumo =>
        insumo.nombre.toLowerCase().includes(term.toLowerCase())
      );
      setFiltered(results);
    }
  };

  return (
    <div className="background">
      <h1 className="text-center">Insumos</h1>
      
        <Search searchTerm={searchTerm} onChange={handleSearch} />
      
      <div className="table-container">
        
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Stock</th>
              <th>Stock Mínimo</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(insumo => (
              <tr
                key={insumo.ide}
                className={selected === insumo.ide ? 'selected' : ''}
                onClick={() => setSelected(insumo.ide)}
              >
                <td>{insumo.nombre}</td>
                <td>{insumo.stock} {insumo.medida}</td>
                <td>{insumo.stock_minimo} {insumo.medida}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       
      <div className="action-buttons">
              <button className='add-btn' onClick={() => setIsAddModalOpen(true)}>Añadir</button>      
            
            <button className="modify-btn" onClick={handleModify} disabled={!selected}>Modificar</button>
            <button className="delete-btn" onClick={handleDelete} disabled={!selected}>Eliminar</button>
          </div>     
      {isEditModalOpen && (
        <EditInsModal
          insumo={insumos.find(insumo => insumo.ide === selected)}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={fetchInsumos}
        />
      )}
      {isAddModalOpen && (
        <AddInsModal
          onClose={() => setIsAddModalOpen(false)}
          onUpdate={fetchInsumos}
        />
      )}
    </div>
  );
};

export default Insumo;
