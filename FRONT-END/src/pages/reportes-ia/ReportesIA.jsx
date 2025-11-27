import { useState, useEffect } from 'react';
import { reportesIAAPI } from '../../api/api';
import FormSelect from '../../components/ui/Form/FormSelect';
import FormInput from '../../components/ui/Form/FormInput';
import FormRow from '../../components/ui/Form/FormRow';
import ResultadosReporte from './ResultadosReporte';
import GraficosReporte from './GraficosReporte';
import '../../styles/reportes-ia/reportes-ia.css';

export default function ReportesIA() {
  const [tipoReporte, setTipoReporte] = useState('VENTAS');
  const [promptCustom, setPromptCustom] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [formatos, setFormatos] = useState(['json']);
  const [incluirGraficos, setIncluirGraficos] = useState(true);
  
  const [tiposReportes, setTiposReportes] = useState({});
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [servicioActivo, setServicioActivo] = useState(false);

  // Verificar estado del servicio al montar
  useEffect(() => {
    const verificarServicio = async () => {
      try {
        await reportesIAAPI.verificarEstado();
        setServicioActivo(true);
      } catch (err) {
        setServicioActivo(false);
        setError('El servicio de IA no está disponible. Asegúrate que está corriendo en puerto 5001');
      }
    };

    const cargarTipos = async () => {
      try {
        const tipos = await reportesIAAPI.obtenerTiposReportes();
        setTiposReportes(tipos);
      } catch (err) {
        console.error('Error cargando tipos:', err);
      }
    };

    verificarServicio();
    cargarTipos();
  }, []);

  const tiposOptions = Object.entries(tiposReportes).map(([key, value]) => ({
    value: key,
    label: `${key} - ${value}`
  }));

  const formatosOptions = [
    { value: 'json', label: 'JSON' },
    { value: 'pdf', label: 'PDF' },
    { value: 'excel', label: 'Excel' }
  ];

  const handleFormatoChange = (formato) => {
    setFormatos(prev =>
      prev.includes(formato)
        ? prev.filter(f => f !== formato)
        : [...prev, formato]
    );
  };

  const handleGenerarReporte = async (e) => {
    e.preventDefault();
    
    if (!servicioActivo) {
      setError('El servicio de IA no está disponible');
      return;
    }

    if (!promptCustom.trim()) {
      setError('Por favor ingresa un prompt/pregunta');
      return;
    }

    setCargando(true);
    setError(null);
    setResultado(null);

    try {
      const formatosSeleccionados = formatos.length > 0 ? formatos : ['json'];
      
      const respuesta = await reportesIAAPI.generarReporte(
        tipoReporte,
        promptCustom,
        fechaInicio,
        fechaFin,
        formatosSeleccionados,
        incluirGraficos
      );

      setResultado(respuesta);
    } catch (err) {
      setError(err.message || 'Error generando reporte');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const descargarArchivo = async (archivo) => {
    try {
      const nombreArchivo = archivo.ruta.split('/').pop();
      await reportesIAAPI.descargarArchivo(archivo.ruta, nombreArchivo);
    } catch (err) {
      setError(`Error descargando: ${err.message}`);
    }
  };

  return (
    <div className="reportes-ia-container">
      <div className="header-section">
        <h1>🤖 Reportes con IA</h1>
        <p>Genera reportes inteligentes usando IA - Especifica qué deseas analizar con un prompt personalizado</p>
        {!servicioActivo && (
          <div className="alert-warning">
            ⚠️ Servicio de IA no disponible. Asegúrate de ejecutar: <code>python main.py</code> en la carpeta <code>ia_reportes</code>
          </div>
        )}
      </div>

      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleGenerarReporte} className="reporte-form">
        <div className="form-section">
          <h3>Configuración del Reporte</h3>

          <FormRow>
            <FormSelect
              label="Tipo de Reporte"
              name="tipoReporte"
              value={tipoReporte}
              onChange={(e) => setTipoReporte(e.target.value)}
              options={tiposOptions}
              required
            />
          </FormRow>

          <div className="form-group">
            <label htmlFor="promptCustom">
              <strong>Tu Pregunta / Análisis</strong>
              <span className="required">*</span>
            </label>
            <textarea
              id="promptCustom"
              value={promptCustom}
              onChange={(e) => setPromptCustom(e.target.value)}
              placeholder="Ej: ¿Cuál fue el producto más vendido en el último mes? Muestra el ranking top 10 y el análisis de tendencias..."
              className="textarea-custom"
              rows={5}
              required
            />
            <small>Sé específico sobre qué quieres analizar para mejores resultados</small>
          </div>

          <FormRow>
            <FormInput
              label="Fecha Inicio (opcional)"
              name="fechaInicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />

            <FormInput
              label="Fecha Fin (opcional)"
              name="fechaFin"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </FormRow>

          <div className="form-group">
            <label><strong>Formatos de Salida</strong></label>
            <div className="checkboxes-group">
              {formatosOptions.map(formato => (
                <label key={formato.value} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formatos.includes(formato.value)}
                    onChange={() => handleFormatoChange(formato.value)}
                  />
                  {formato.label}
                </label>
              ))}
            </div>
            <small>Selecciona los formatos que deseas descargar</small>
          </div>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={incluirGraficos}
              onChange={(e) => setIncluirGraficos(e.target.checked)}
            />
            <strong>Incluir Gráficos en Análisis</strong>
          </label>
        </div>

        <button 
          type="submit" 
          className="btn-primary btn-large"
          disabled={cargando || !servicioActivo}
        >
          {cargando ? '⏳ Generando Reporte con IA...' : '✨ Generar Reporte Inteligente'}
        </button>
      </form>

      {resultado && (
        <div className="resultado-section">
          <ResultadosReporte 
            resultado={resultado}
            onDescargar={descargarArchivo}
          />
          
          {resultado.graficos && Object.keys(resultado.graficos).length > 0 && (
            <GraficosReporte graficos={resultado.graficos} />
          )}
        </div>
      )}

      <div className="info-section">
        <h3>💡 Ejemplos de Prompts</h3>
        <div className="ejemplos-grid">
          <div className="ejemplo-card">
            <strong>Para Ventas:</strong>
            <p>"Analiza las ventas del último trimestre. ¿Cuáles fueron los mejores días? ¿Qué categoría de productos tuvo mayor aumento?"</p>
          </div>
          <div className="ejemplo-card">
            <strong>Para Inventario:</strong>
            <p>"¿Cuáles son los productos con menor rotación? ¿Hay insumos en riesgo de vencimiento?"</p>
          </div>
          <div className="ejemplo-card">
            <strong>Para Clientes:</strong>
            <p>"¿Cuál es el perfil del cliente más frecuente? ¿Hay clientes con compras decrecientes?"</p>
          </div>
          <div className="ejemplo-card">
            <strong>Para Producción:</strong>
            <p>"¿Cuál ha sido la eficiencia de producción? ¿Hay recetas con problemas de rendimiento?"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
