import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const AddUserModal = ({ onClose, onUpdate }) => {
    const [codigo, setCodigo] = useState('');
    const [nombre, setNombre] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [sexo, setSexo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [ide_rol, setRol] = useState('');
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Obtener el rol del usuario actual desde localStorage
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user?.ide_rol || '';

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/roles`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                setRoles(response.data);
            } catch (error) {
                console.error('Error al cargar los roles:', error);
                setError('Error al cargar los roles');
            }
        };

        fetchRoles();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');

        // Validaciones simples
        if (!nombre || !contrasena || !telefono || !sexo || !ide_rol) {
            setError('Por favor, complete todos los campos.');
            return;
        }

        setLoading(true); // Iniciar carga
        try {
            // Obtener el token almacenado en localStorage

            // Enviar la solicitud para agregar el usuario
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/add?userRole=${role}`,
                {
                    codigo,
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
                }
            );
            
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Error al agregar el usuario:', error);
            setError('Ocurrió un error al agregar el usuario.');
        } finally {
            setLoading(false); // Detener carga
        }
    };

    return (
        <div className="modal-background"> 
    <div className="modal-content">
        <h2>Agregar Usuario</h2>
        {error && <p className="error-message">{error}</p>}
        
        <label>Código:</label>
        <input 
            type="text" 
            value={codigo} 
            onChange={(e) => setCodigo(e.target.value)} 
            placeholder="USXX" // Placeholder añadido
        />
        
        <label>Nombre:</label>
        <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            placeholder="nombre del usuario" // Placeholder añadido
        />
        
        <label>Contraseña:</label>
        <input 
            type="password" 
            value={contrasena} 
            onChange={(e) => setContrasena(e.target.value)} 
            placeholder="Ingrese la contraseña" // Placeholder añadido
        />
        
        <label>Sexo:</label>
        <select 
            value={sexo} 
            onChange={(e) => setSexo(e.target.value)}
        >
            <option value="">Seleccione el sexo</option> {/* Opción por defecto */}
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
        </select>
        
        <label>Teléfono:</label>
        <input 
            type="text" 
            value={telefono} 
            onChange={(e) => setTelefono(e.target.value)} 
            placeholder="Ingrese el teléfono" // Placeholder añadido
        />
        
        <label>Rol:</label>
        <select 
            value={ide_rol} 
            onChange={(e) => setRol(e.target.value)}
        >
            <option value="">Seleccione un rol</option> {/* Opción por defecto */}
            {roles.map((role) => (
                <option key={role.ide} value={role.ide}>
                    {role.nombre}
                </option>
            ))}
        </select>
        
        <button onClick={handleSave} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
        </button>
        <button onClick={onClose}>Cancelar</button>
    </div>
</div>

    );
};

export default AddUserModal;