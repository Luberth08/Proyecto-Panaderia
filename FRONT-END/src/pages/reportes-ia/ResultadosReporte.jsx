import { useState } from 'react';

export default function ResultadosReporte({ resultado, onDescargar }) {
  const [seccionesExpandidas, setSeccionesExpandidas] = useState({
    resumen: true,
    datos: true,
    analisisIA: true,
    archivos: true
  });

  const toggleSeccion = (seccion) => {
    setSeccionesExpandidas(prev => ({
      ...prev,
      [seccion]: !prev[seccion]
    }));
  };

  const renderizarDatos = (datos, nivel = 0) => {
    if (!datos) return null;

    if (Array.isArray(datos)) {
      return (
        <ul className="datos-list">
          {datos.slice(0, 10).map((item, idx) => (
            <li key={idx}>
              {typeof item === 'object' ? (
                <details className="nested-object">
                  <summary>{`Item ${idx + 1}`}</summary>
                  {renderizarDatos(item, nivel + 1)}
                </details>
              ) : (
                <span>{String(item)}</span>
              )}
            </li>
          ))}
          {datos.length > 10 && <li className="truncated">... y {datos.length - 10} más</li>}
        </ul>
      );
    }

    if (typeof datos === 'object') {
      return (
        <table className="datos-table">
          <tbody>
            {Object.entries(datos).map(([key, value]) => (
              <tr key={key}>
                <td className="key">{key}:</td>
                <td className="value">
                  {typeof value === 'object' ? (
                    <details className="nested-object">
                      <summary>Ver detalle</summary>
                      {renderizarDatos(value, nivel + 1)}
                    </details>
                  ) : (
                    String(value)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return <span>{String(datos)}</span>;
  };

  return (
    <div className="resultados-reporte">
      <h2>📊 Resultados del Análisis</h2>

      {/* Resumen */}
      <div className="seccion-resultado">
        <button
          className="seccion-titulo"
          onClick={() => toggleSeccion('resumen')}
        >
          <span className="icon">{seccionesExpandidas.resumen ? '▼' : '▶'}</span>
          <h3>ℹ️ Información del Reporte</h3>
        </button>
        {seccionesExpandidas.resumen && (
          <div className="seccion-contenido">
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Tipo:</span>
                <span className="value">{resultado.tipo_reporte}</span>
              </div>
              <div className="info-item">
                <span className="label">Período:</span>
                <span className="value">{resultado.periodo}</span>
              </div>
              <div className="info-item">
                <span className="label">Generado:</span>
                <span className="value">
                  {new Date(resultado.fecha_generacion).toLocaleString('es-ES')}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Formatos:</span>
                <span className="value">
                  {resultado.archivos_generados.map(a => a.formato.toUpperCase()).join(', ')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Análisis IA */}
      {resultado.analisis_ia && (
        <div className="seccion-resultado">
          <button
            className="seccion-titulo"
            onClick={() => toggleSeccion('analisisIA')}
          >
            <span className="icon">{seccionesExpandidas.analisisIA ? '▼' : '▶'}</span>
            <h3>🤖 Análisis Inteligente de IA</h3>
          </button>
          {seccionesExpandidas.analisisIA && (
            <div className="seccion-contenido analisis-ia-content">
              {typeof resultado.analisis_ia === 'string' ? (
                <p className="analisis-texto">{resultado.analisis_ia}</p>
              ) : (
                renderizarDatos(resultado.analisis_ia)
              )}
            </div>
          )}
        </div>
      )}

      {/* Datos Crudos */}
      {resultado.datos && (
        <div className="seccion-resultado">
          <button
            className="seccion-titulo"
            onClick={() => toggleSeccion('datos')}
          >
            <span className="icon">{seccionesExpandidas.datos ? '▼' : '▶'}</span>
            <h3>📈 Datos Completos</h3>
          </button>
          {seccionesExpandidas.datos && (
            <div className="seccion-contenido datos-content">
              {renderizarDatos(resultado.datos)}
            </div>
          )}
        </div>
      )}

      {/* Archivos Generados */}
      {resultado.archivos_generados && resultado.archivos_generados.length > 0 && (
        <div className="seccion-resultado">
          <button
            className="seccion-titulo"
            onClick={() => toggleSeccion('archivos')}
          >
            <span className="icon">{seccionesExpandidas.archivos ? '▼' : '▶'}</span>
            <h3>📥 Descargar Reportes</h3>
          </button>
          {seccionesExpandidas.archivos && (
            <div className="seccion-contenido">
              <div className="archivos-grid">
                {resultado.archivos_generados.map((archivo, idx) => (
                  <div key={idx} className="archivo-item">
                    <div className="archivo-info">
                      <span className="formato-badge">{archivo.formato.toUpperCase()}</span>
                      <span className="ruta">{archivo.ruta.split('/').pop()}</span>
                    </div>
                    <button
                      className="btn-descargar"
                      onClick={() => onDescargar(archivo)}
                    >
                      ⬇️ Descargar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
