
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // Si hay token, se muestra el contenido protegido
  return token ? children : <Navigate to="/" />;
};

export default PrivateRoute;

