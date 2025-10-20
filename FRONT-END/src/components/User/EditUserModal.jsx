import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EditUserModal = ({ user, onClose, onUpdate }) => {
    const [nombre, setNombre] = useState(user.nombre);
    const [sexo, setSexo] = useState(user.sexo);
    const [contrasena, setContrasena] = useState(user.contrasena);
    const [telefono, setTelefono] = useState(user.telefono);
    const [ide_rol, setId_rol] = useState(user.ide_rol);
    const [roles, setRoles] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const Role = JSON.parse(localStorage.getItem('user')).ide_rol;
    const token = localStorage.getItem('token');
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/roles`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (Role == 'RL01') {
                    setRoles(response.data);
                } else {
                    const filtered = response.data.filter(role => role.ide === Role);
                    setRoles(filtered);
                }
            } catch (error) {
                console.error('Error al cargar los roles:', error);
            }
        };

        fetchRoles();
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(true);
        setTimeout(() => {
            setShowPassword(false);
        }, 3000);
    };

    const handleSave = async () => {

        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/usuarios/${user.codigo}`, {
                codigo: user.codigo,
                nombre,
                sexo,
                contrasena,
                telefono,
                ide_rol
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (user.codigo === JSON.parse(localStorage.getItem('user')).codigo) {
                localStorage.setItem('user', JSON.stringify({
                    ...JSON.parse(localStorage.getItem('user')),
                    codigo: user.codigo,
                    nombre,
                    sexo,
                    contrasena,
                    telefono,
                    ide_rol
                }));
            }
            onUpdate(); // Llamar a onUpdate para refrescar la lista de usuarios
            onClose(); // Cerrar el modal
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
        }
    };

    return (
        <div className="modal-background">
            <div className="modal-content">
                <h2>Editar Usuario</h2>
                <label>Nombre:</label>
                <input type='text' value={nombre} onChange={(e) => setNombre(e.target.value)} />
                <label>Contraseña:</label>
                <input type={showPassword ? 'text' : 'password'} value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
                <button type="button" onClick={togglePasswordVisibility}>
                    {showPassword ? 'Ocultando...' : 'Mostrar'}
                </button>
                <label>Teléfono:</label>
                <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                {Role === 'RL01' && (
                    <>
                        <label>Rol:</label>
                        <select value={ide_rol} onChange={(e) => {setId_rol( e.target.value)}} >
                            {roles.map((role) => (
                                <option key={role.ide} value={role.ide}>
                                    {role.nombre}
                                </option>
                            ))}
                        </select>
                    </>
                )}
                <button onClick={handleSave}>Guardar</button>
                <button onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
};

export default EditUserModal;
