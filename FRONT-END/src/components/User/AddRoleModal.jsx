import React, {useState, useEffect} from 'react'
import axios from 'axios'

export const AddRoleModal = ({onClose,onUpdate}) => {
  const [ide, setIde] = useState('')
  const [nombre, setNombre] = useState('');
  const [permisos, setPermisos] = useState([]);  // Lista de permisos disponibles
  const [selectedPermisos, setSelectedPermisos] = useState([]);  // Permisos seleccionados
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  useEffect(() => {
    const fetchPermisos = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/permisos`); 
            setPermisos(response.data); // Supone que la respuesta es un array de permisos
        } catch (error) {
            console.error('Error al cargar los permisos:', error);
        }
    };

    fetchPermisos();
}, []);

    // Manejar la selección de permisos
    const handlePermisoChange = (permisoId) => {
      if (selectedPermisos.includes(permisoId)) {
          setSelectedPermisos(selectedPermisos.filter(id => id !== permisoId));  // Desmarcar permiso
      } else {
          setSelectedPermisos([...selectedPermisos, permisoId]);  // Marcar permiso
      }
  };
  const handleSave = async (e) => {
    e.preventDefault();
    setError(''); 

    // Validar los campos antes de hacer la solicitud
    if (!ide || !nombre) {
        setError('Por favor, complete todos los campos.');
        return;
    }

    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/roles`, {
            ide,
            nombre
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Comprobar si el rol ya existe según la respuesta del servidor
        if (response.data.exists) {
            setError('El rol ya existe.'); 
            return;
        }

        // Guardar permisos si el rol fue creado con éxito
        await Promise.all(
            selectedPermisos.map((permisoId) => {
                return axios.post(`${import.meta.env.VITE_API_URL}/api/rol/permisos`, {
                    ide_rol: ide,
                    ide_permiso: permisoId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            })
        );

        // Llamar a la función onUpdate para refrescar la lista de roles
        onUpdate();
        // Cerrar el modal
        onClose();
    } catch (error) {
        console.error('Error al agregar el rol:', error);
    }
};


return (
  <div className="modal-background">
      <div className="modal-content">
          <h2>Agregar Rol</h2>
          {error && <p className="error-message">{error}</p>}
          <label>IDE:</label>
          <input
              type="text"
              value={ide}
              onChange={(e) => setIde(e.target.value)}
              placeholder="Código del Rol"
          />
          <label>Nombre:</label>
          <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del Rol"
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

export default AddRoleModal;