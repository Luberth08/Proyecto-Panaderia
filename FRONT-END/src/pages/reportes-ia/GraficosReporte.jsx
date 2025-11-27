import { useState } from 'react';

export default function GraficosReporte({ graficos }) {
  const [expandido, setExpandido] = useState(true);

  if (!graficos || Object.keys(graficos).length === 0) {
    return null;
  }

  return (
    <div className="graficos-reporte">
      <button
        className="seccion-titulo"
        onClick={() => setExpandido(!expandido)}
      >
        <span className="icon">{expandido ? '▼' : '▶'}</span>
        <h3>📊 Visualizaciones Gráficas</h3>
      </button>

      {expandido && (
        <div className="seccion-contenido">
          <div className="graficos-grid">
            {Object.entries(graficos).map(([key, grafico]) => (
              <div key={key} className="grafico-container">
                <h4>{formatearNombre(key)}</h4>
                {typeof grafico === 'string' ? (
                  // Si es una URL o base64 de imagen
                  <img 
                    src={grafico} 
                    alt={key}
                    className="grafico-imagen"
                  />
                ) : grafico.tipo === 'plotly' ? (
                  // Si es un gráfico Plotly
                  <div 
                    className="grafico-plotly"
                    dangerouslySetInnerHTML={{ __html: grafico.html }}
                  />
                ) : (
                  // Fallback: mostrar JSON
                  <pre className="grafico-json">
                    {JSON.stringify(grafico, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function formatearNombre(nombre) {
  return nombre
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, str => str.toUpperCase());
}
