// src/components/ui/LoadingSpinner.jsx
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  text = 'Cargando...',
  centered = true 
}) => {
  return (
    <div className={`loading-spinner ${centered ? 'centered' : ''}`}>
      <div className={`spinner ${size}`}>
        <div className="spinner-circle"></div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;