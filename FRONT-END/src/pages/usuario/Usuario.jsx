// src/pages/usuario/Usuario.jsx
import { useState, useEffect } from 'react';
import { usuarioAPI, rolAPI } from '../../api/api';
import './Usuario.css';

export default function Usuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para el formulario
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    contrasena: '',
    sexo: '',
    telefono: '',
    id_rol: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [usuariosData, rolesData] = await Promise.all([
        usuarioAPI.getAll(),
        rolAPI.getAll() // Asumo que existe este endpoint
      ]);
      setUsuarios(usuariosData);
      setRoles(rolesData);
    } catch (err) {
      setError('Error al cargar los datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setForm({
      nombre: '',
      email: '',
      contrasena: '',
      sexo: '',
      telefono: '',
      id_rol: ''
    });
    setEditingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Actualizar usuario
        await usuarioAPI.update(editingUser.nombre, form);
      } else {
        // Crear usuario
        await usuarioAPI.create(form);
      }
      await cargarDatos();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (usuario) => {
    setEditingUser(usuario);
    setForm({
      nombre: usuario.nombre,
      email: usuario.email,
      contrasena: '', // No mostramos la contraseña actual
      sexo: usuario.sexo || '',
      telefono: usuario.telefono || '',
      id_rol: usuario.id_rol
    });
    setShowModal(true);
  };

  const handleDelete = async (nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar al usuario ${nombre}?`)) {
      try {
        await usuarioAPI.delete(nombre);
        await cargarDatos();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Filtrar usuarios basado en la búsqueda
  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Cargando usuarios...</div>;

  return (
    <div className="usuario-container">
      {/* Header con título y botón */}
      <div className="usuario-header">
        <div className="header-left">
          <h1>Gestión de Usuarios</h1>
          <p>Administra los usuarios del sistema</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Nuevo Usuario
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tabla de usuarios */}
      <div className="table-container">
        <table className="usuario-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Sexo</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.map(usuario => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>{usuario.sexo || 'No especificado'}</td>
                <td>{usuario.telefono || 'No especificado'}</td>
                <td>
                  <span className="rol-badge">
                    {roles.find(r => r.id === usuario.id_rol)?.nombre || usuario.id_rol}
                  </span>
                </td>
                <td className="acciones">
                  <button 
                    className="btn-editar"
                    onClick={() => handleEdit(usuario)}
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    className="btn-eliminar"
                    onClick={() => handleDelete(usuario.nombre)}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsuarios.length === 0 && (
          <div className="no-data">
            {searchTerm ? 'No se encontraron usuarios con ese criterio' : 'No hay usuarios registrados'}
          </div>
        )}
      </div>

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {error && <div className="error-message">{error}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label>Nombre de usuario *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleInputChange}
                    required
                    pattern="[a-zA-Z0-9_]{3,20}"
                    title="Solo letras, números y guiones bajos (3-20 caracteres)"
                    disabled={!!editingUser}
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contraseña {!editingUser && '*'}</label>
                  <input
                    type="password"
                    name="contrasena"
                    value={form.contrasena}
                    onChange={handleInputChange}
                    required={!editingUser}
                    minLength="6"
                  />
                  {editingUser && (
                    <small>Dejar vacío para mantener la contraseña actual</small>
                  )}
                </div>

                <div className="form-group">
                  <label>Rol *</label>
                  <select
                    name="id_rol"
                    value={form.id_rol}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar rol</option>
                    {roles.map(rol => (
                      <option key={rol.id} value={rol.id}>
                        {rol.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Sexo</label>
                  <select
                    name="sexo"
                    value={form.sexo}
                    onChange={handleInputChange}
                  >
                    <option value="">No especificado</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingUser ? 'Actualizar' : 'Crear'} Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}