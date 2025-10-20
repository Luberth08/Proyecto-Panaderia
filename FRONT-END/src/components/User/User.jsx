import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditUserModal from './EditUserModal';
import AddUserModal from './AddUserModal';


export const User = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModified, setIsUserModified] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const Role = JSON.parse(localStorage.getItem('user')).ide_rol;
  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
  try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/usuarios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if(Role === 'RL01'){
        setUsers(response.data);
      }else{
        setUsers(response.data.filter(user => user.ide_rol === Role));
      }
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [isUserModified]);

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/usuarios/${selectedUser}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedUsers = users.filter((user) => user.codigo !== selectedUser);
      setUsers(updatedUsers);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  return (
    <div className="background">
      <h2>Gestión de Usuarios</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Codigo</th>
            <th>Nombre</th>
            <th>telefono</th>
            <th>sexo</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.codigo}
              className={selectedUser === user.codigo ? 'selected' : ''}
              onClick={() => setSelectedUser(user.codigo)}
            >
              <td>{user.codigo}</td>
              <td>{user.nombre}</td>
              <td>{user.telefono}</td>
              <td>{user.sexo}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="action-buttons">
        {Role === 'RL01' && (
         <>
         <button 
         className="add-btn" 
         onClick={()=>setIsAddModalOpen(true)}>
          Agregar Usuario
          </button>
         <button 
         className="delete-btn" 
         onClick={handleDelete} 
         disabled={!selectedUser}>
          Eliminar
        </button>
         </> 
        )}
        <button className="modify-btn" onClick={()=>setIsEditModalOpen(true)} disabled={!selectedUser}>
          Modificar
        </button>
      </div>

      {isEditModalOpen && (
                <EditUserModal
                    user={users.find(user => user.codigo === selectedUser)}
                    onClose={() => setIsEditModalOpen(false)}
                    onUpdate={fetchUsers}
                />
            )}
      {isAddModalOpen && (
                <AddUserModal
                    onClose={() => setIsAddModalOpen(false)}
                    onUpdate={fetchUsers}
                />
            )}
    </div>
  );
};

export default User;

