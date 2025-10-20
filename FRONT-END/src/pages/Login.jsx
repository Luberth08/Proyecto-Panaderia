import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

// Cambio: usar una prop con nombre claro (onLogin) para evitar confusiones
const Login = ({ onLogin }) => {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, 
        { nombre, contrasena: password });
      // Guardar el token en localStorage o en el estado
      localStorage.setItem('token', response.data.token);
      console.error(response.data.token);
      // Llamar al callback de login. Usamos 'true' porque si hay token, el login fue exitoso.
      // Evitamos usar response.data.sucess (typo) y delegamos el manejo del usuario al padre.
      if (typeof onLogin === 'function') {
        onLogin(true, response.data.user);
      }
      // Redirigir a la página de inicio o dashboard
      navigate('/dashboard');
  } catch (error) {
    setError(error.response?.data.message || 'Error en el inicio de sesión');
  }
  };

  return (
    <div className="login-container">
   
      <form onSubmit={handleLogin}>
        
        <h2>Login</h2>
        <div>
          <label>Usuario:</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            placeholder="Username" 
            required
            />
        </div>
        <div>
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Contraseña" 
            required
            />
        </div>
        <button type="submit">Iniciar Sesión</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;

// Prop types: validar que onLogin es una función si se pasa
import PropTypes from 'prop-types';

Login.propTypes = {
  onLogin: PropTypes.func,
};
