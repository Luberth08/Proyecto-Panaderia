// src/pages/dashboard/Dashboard.jsx
import PageHeader from '../../components/ui/PageHeader'; // ✅ Sin subcarpeta
import '../../styles/dashboard/Dashboard.css';

export default function Dashboard() {
  const stats = [
    { 
      icon: '👥', 
      title: 'Usuarios', 
      description: 'Gestión de usuarios del sistema' 
    },
    { 
      icon: '🛡️', 
      title: 'Roles', 
      description: 'Administración de roles y permisos' 
    },
    { 
      icon: '📁', 
      title: 'Categorías', 
      description: 'Gestión de categorías de productos' 
    },
    { 
      icon: '🔐', 
      title: 'Permisos', 
      description: 'Control de acceso al sistema' 
    }
  ];

  return (
    <div className="dashboard">
      <PageHeader
        title="Dashboard Principal"
        description="Bienvenido al sistema de gestión integral"
      />

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <h3>{stat.title}</h3>
            <p>{stat.description}</p>
          </div>
        ))}
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