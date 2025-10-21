import React, { useState } from "react"; // Importa React y el hook useState desde la librería de React.
import home from "../img/home.svg"; // Importa la imagen home.svg desde el directorio especificado.
import person from "../img/person_add.svg"; // Importa la imagen person_add.svg desde el directorio especificado.
import shopping from "../img/shopping.svg"; // Importa la imagen shopping.svg desde el directorio especificado.

import "../styles/Navbar.css"; // Importa los estilos CSS específicos para el componente Navbar.

const Navbar = ({ activeComponent, setActiveComponent }) => {
  // Define el componente Navbar, el cual acepta dos props: activeComponent y setActiveComponent.

  const [expandedSection, setExpandedSection] = useState(null);
  // Crea un estado local expandedSection para controlar cuál sección está expandida, con un valor inicial de null.

  const sections = [
    {
      name: "Inventario",
      icon: home,
      options: ["Categorías", "Insumos", "Producto"],
    },
    { name: "Produccion", icon: shopping, options: ["Recetas", "Producir"] },
    {
      name: "Compra",
      icon: shopping,
      options: ["Ver compras", "Añadir compras", "Proveedores"],
    },
    {
      name: "Venta",
      icon: person,
      options: ["Reportes Graficos", "Facturas Reporte", "Facturas", "Pedidos"],
    },
    { name: "Usuario", icon: person, options: ["Empleados", "Roles"] },
  ];
  // Define un array sections que contiene objetos con el nombre de la sección, el icono y las opciones de cada sección.

  const handleSectionClick = (sectionName) => {
    setExpandedSection(expandedSection === sectionName ? null : sectionName);
  };
  // Define una función handleSectionClick que actualiza el estado expandedSection cuando se hace clic en una sección.

  return (
    <nav className="navbar">
      <h2>Panadería</h2>
      {/* Muestra el título de la barra de navegación. */}
      <ul className="navbar-list">
        {/* Comienza la lista de elementos de navegación. */}
        {sections.map((section) => (
          <li key={section.name} className="navbar-item">
            {/* Recorre cada sección en el array sections y crea un elemento de lista para cada una. */}
            <button
              className={`navbar-button ${
                activeComponent === section.name ? "active" : ""
              }`}
              onClick={() => handleSectionClick(section.name)}
            >
              <img src={section.icon} alt="" className="icon" />
              {/* Muestra el icono de la sección. */}
              <span>{section.name}</span>
              {/* Muestra el nombre de la sección. */}
            </button>

            {expandedSection === section.name && section.options.length > 0 && (
              <ul className="submenu">
                {/* Muestra el submenú solo si la sección está expandida y tiene opciones. */}
                {section.options.map((option) => (
                  <li key={option} className="submenu-item">
                    <button
                      className="submenu-button"
                      onClick={() => {
                        // Actualiza el estado `activeComponent` con la opción seleccionad
                        setActiveComponent(option);
                        // Cierra el submenú después de seleccionar una opción.
                        setExpandedSection(null);
                      }}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
// Exporta el componente Navbar como el export por defecto.
