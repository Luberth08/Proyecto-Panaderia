import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditRoleModal from './EditRoleModal';
import AddRolModal from './AddRoleModal';

export const Role = () => {
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const token = localStorage.getItem('token');
  const Role = JSON.parse(localStorage.getItem('user')).ide_rol;

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/roles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoles(response.data);
    } catch (error) {
      console.error('Error al cargar los roles:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/permisos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPermisos(response.data || []);
    } catch (error) {
      console.error('Error al cargar los permisos:', error);
    }
  };

  const fetchRolePermissions = async (roleId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/rol/permisos/${roleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedPermisos(response.data.map(permiso => permiso.ide_permiso));
    } catch (error) {
      console.error('Error al cargar los permisos del rol:', error);
    }
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    fetchRolePermissions(roleId);
  };

  const handleDelete = async () => {
    if (selectedRole) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/roles/${selectedRole}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRoles(roles.filter((role) => role.ide !== selectedRole));
        setSelectedRole(null);
        setSelectedPermisos([]);
      } catch (error) {
        console.error('Error al eliminar el rol:', error);
      }
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  return (
    <div className="background">
      <h2>Gestión de Roles</h2>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr
              key={role.ide}
              onClick={() => handleRoleSelect(role.ide)}
              className={selectedRole === role.ide ? 'selected' : ''}
            >
              <td>{role.ide}</td>
              <td>{role.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedRole && (
        <div className="permissions-section">
          <h3>Permisos para el rol</h3>
          <ul>
            {permisos.map((permiso) => (
              <li key={permiso.ide}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedPermisos.includes(permiso.ide)}
                    disabled
                  />
                  {permiso.nombre}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {Role === 'RL01' && (
        <div className="action-buttons">
          <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
            Agregar Rol
          </button>
          <button className="delete-btn" onClick={handleDelete} disabled={!selectedRole}>
            Eliminar
          </button>
          <button className="modify-btn" onClick={() => setIsEditModalOpen(true)} disabled={!selectedRole}>
            Modificar
          </button>
        </div>
      )}

      {isEditModalOpen && (
        <EditRoleModal
          role={roles.find((rol) => rol.ide === selectedRole)}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={fetchRoles}
        />
      )}
      {isAddModalOpen && (
        <AddRolModal
          onClose={() => setIsAddModalOpen(false)}
          onUpdate={fetchRoles}
        />
      )}
    </div>
  );
};

export default Role;
