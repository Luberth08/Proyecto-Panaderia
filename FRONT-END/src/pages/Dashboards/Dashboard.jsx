// src/pages/Dashboards/Dashboard.jsx
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Principal</h1>
        <p>Bienvenido al sistema de gestión integral</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>👥 Usuarios</h3>
          <p>Gestión de usuarios del sistema</p>
        </div>
        
        <div className="stat-card">
          <h3>🛡️ Roles</h3>
          <p>Administración de roles y permisos</p>
        </div>
        
        <div className="stat-card">
          <h3>📁 Categorías</h3>
          <p>Gestión de categorías de productos</p>
        </div>
        
        <div className="stat-card">
          <h3>🔐 Permisos</h3>
          <p>Control de acceso al sistema</p>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Actividad Reciente</h2>
        <div className="activity-list">
          <p>Bienvenido al sistema. Selecciona una opción del menú para comenzar.</p>
        </div>
      </div>
    </div>
  );
}