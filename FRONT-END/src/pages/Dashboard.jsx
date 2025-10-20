import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ContentRenderer from "../components/ContentRenderer";
import "../styles/button.css";
import "../styles/section.css";
import "../styles/MainLayout.css";

import { useTheme } from "../components/ThemeContext"; // Importa el hook
import "../styles/App.css";

const MainLayout = () => {
  const [activeComponent, setActiveComponent] = useState("Facturas");
  const navigate = useNavigate();

  const { isDarkMode, toggleDarkMode } = useTheme(); // Usar el estado del tema

  // Cambiar la clase del body según el estado del modo oscuro
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const handleLogOut = () => {
    // Eliminar token y datos del usuario de localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirigir al login
    navigate("/");
  };

  return (
    <div className="main-layout">
      <Navbar
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
      />
      <div className="content">
        <header className="header">
          <button className="delete-btn" onClick={handleLogOut}>
            Cerrar sesion
          </button>

          <div>
            <button className="toggle-theme" onClick={toggleDarkMode}>
              Cambiar a {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
            </button>
          </div>
        </header>

        <ContentRenderer activeComponent={activeComponent} />
      </div>
    </div>
  );
};

export default MainLayout;
