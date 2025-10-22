// src/components/common/StatusBadge.jsx
import './StatusBadge.css';

const StatusBadge = ({ 
  status, 
  type = 'default',
  text,
  showIcon = true 
}) => {
  const getStatusConfig = () => {
    const configs = {
      // Estados de proveedores
      'ACTIVOP': { 
        text: 'Activo', 
        className: 'status-activo',
        icon: '✅'
      },
      'INACTIVOP': { 
        text: 'Inactivo', 
        className: 'status-inactivo',
        icon: '❌'
      },
      
      // Estados de stock
      'normal': { 
        text: 'Normal', 
        className: 'status-normal',
        icon: '🟢'
      },
      'bajo': { 
        text: 'Stock Bajo', 
        className: 'status-bajo',
        icon: '🟡'
      },
      'critico': { 
        text: 'Stock Crítico', 
        className: 'status-critico',
        icon: '🔴'
      },
      
      // Estados genéricos
      'activo': { 
        text: 'Activo', 
        className: 'status-activo',
        icon: '✅'
      },
      'inactivo': { 
        text: 'Inactivo', 
        className: 'status-inactivo',
        icon: '❌'
      },
      'pendiente': { 
        text: 'Pendiente', 
        className: 'status-pendiente',
        icon: '⏳'
      },
      'completado': { 
        text: 'Completado', 
        className: 'status-completado',
        icon: '✅'
      }
    };

    return configs[status] || { 
      text: text || status, 
      className: `status-${type}`,
      icon: '🔵'
    };
  };

  const config = getStatusConfig();

  return (
    <span className={`status-badge ${config.className}`}>
      {showIcon && <span className="status-icon">{config.icon}</span>}
      <span className="status-text">{config.text}</span>
    </span>
  );
};

export default StatusBadge;