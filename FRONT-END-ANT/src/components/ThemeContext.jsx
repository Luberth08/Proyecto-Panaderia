import React, { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

// Crear el proveedor del contexto
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Verificar si el usuario tiene preferencia guardada en localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      setIsDarkMode(JSON.parse(savedMode));
    }
  }, []);

  // Cambiar el tema
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(!isDarkMode)); // Guardar la preferencia
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para usar el contexto en cualquier componente
export const useTheme = () => useContext(ThemeContext);
