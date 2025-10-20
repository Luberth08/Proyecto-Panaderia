import React, { useState, useEffect } from 'react';
import { EditSuppModal } from './EditSuppModal';
import { AddSuppModal } from './AddSuppModal';
import axios from 'axios';

export const Supplier = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [selected, setSelected] = useState(null);
  const Role = JSON.parse(localStorage.getItem('user')).ide_rol;

  const token = localStorage.getItem('token');
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/proveedores`,
          {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
        setSuppliers(response.data.proveedores);
      } catch (error) {
        console.error('Error al cargar los proveedores:', error);
      }
    };
    fetchSuppliers();
  }, []);

  const handleUpdate = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/proveedores?userRole`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
      setSuppliers(response.data.proveedores);
    } catch (error) {
      console.error('Error al actualizar la lista de proveedores:', error);
    }
  };

  const handleModify = () => {
    setIsEditModalOpen(true); 
  };

  const handleDelete = async () => {
    if (!selected) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/proveedores/${selected}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
      const updatedSuppliers = suppliers.filter(supplier => supplier.codigo !== selected);
      setSuppliers(updatedSuppliers);
      setSelected(null); 
    } catch (error) {
      console.error('Error al eliminar el proveedor:', error);
    }
  };

  return (
    <div className="background">
      <h2>Gestión de Proveedores</h2>

     
      <table className="table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr
              key={supplier.codigo}
              className={selected === supplier.codigo ? 'selected' : ''}
              onClick={() => setSelected(supplier.codigo)}
            >
              <td>{supplier.codigo}</td>
              <td>{supplier.nombre}</td>
              <td>{supplier.telefono}</td>
              <td>{supplier.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
     

      <div className="action-buttons">
        {Role === 'RL01' && (
          <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>Agregar Proveedor</button>
        )}
        <button className="modify-btn" onClick={handleModify} disabled={!selected}>Modificar</button>
        <button className="delete-btn" onClick={handleDelete} disabled={!selected}>Eliminar</button>
      </div>

      {isEditModalOpen && (
        <EditSuppModal
          supplier={suppliers.find(supplier => supplier.codigo === selected)}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
      {isAddModalOpen && (
        <AddSuppModal
          onClose={() => setIsAddModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default Supplier;
