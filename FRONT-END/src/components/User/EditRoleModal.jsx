import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const EditRoleModal = ({ role, onClose, onUpdate }) => {
    const [nombre, setNombre] = useState(role ? role.nombre : '');
    const [permisos, setPermisos] = useState([]);
    const [selectedPermisos, setSelectedPermisos] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchPermisos = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/permisos`);
                setPermisos(response.data || []);
                
                const response2 = await axios.get(`${import.meta.env.VITE_API_URL}/api/rol/permisos/${role.ide}`);
                setSelectedPermisos(response2.data.map(permiso => permiso.ide_permiso)); // Almacena solo los IDs de permisos
                
            } catch (error) {
                console.error('Error al cargar los permisos:', error);
            }
        };

        fetchPermisos();
    }, [role]);

    const handlePermisoChange = (permisoId) => {
        if (selectedPermisos.includes(permisoId)) {
            setSelectedPermisos(selectedPermisos.filter(id => id !== permisoId));
        } else {
            setSelectedPermisos([...selectedPermisos, permisoId]);
        }
    };

    const handleSave = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/roles/${role.ide}`, {
                nombre
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            await axios.delete(`${import.meta.env.VITE_API_URL}/api/rol/permisos/${role.ide}`);

            await Promise.all(
                selectedPermisos.map((permisoId) =>
                    axios.post(`${import.meta.env.VITE_API_URL}/api/rol/permisos`, {
                        ide_rol: role.ide,
                        ide_permiso: permisoId
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                )
            );

            onUpdate();
            onClose();
        } catch (error) {
            console.error('Error al actualizar el rol:', error);
        }
    };

    return (
        <div className="modal-background">
            <div className="modal-content">
                <h2>Editar Rol</h2>
                <label>Nombre:</label>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <h3>Permisos</h3>
                <div className="permissions-list">
                    {permisos.map((permiso) => (
                        <label key={permiso.ide}>
                            <input
                                type="checkbox"
                                checked={selectedPermisos.includes(permiso.ide)}
                                onChange={() => handlePermisoChange(permiso.ide)}
                            />
                            {permiso.nombre}  
                            <p>{permiso.descripcion}</p>
                        </label>
                    ))}
                </div>
                <button onClick={handleSave}>Guardar</button>
                <button onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
};

export default EditRoleModal;
