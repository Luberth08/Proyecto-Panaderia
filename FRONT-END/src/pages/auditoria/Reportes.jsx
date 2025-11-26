import { reporteAPI } from '../../api/api';
import { useState } from 'react';
import FormSelect from '../../components/ui/Form/FormSelect';
import FormInput from '../../components/ui/Form/FormInput';
import FormRow from '../../components/ui/Form/FormRow';
import '../../styles/auditoria/reportes.css';

// Componente para generar reportes
export default function Reportes() {
  const [tipoReporte, setTipoReporte] = useState('ventas');
  const [formato, setFormato] = useState('PDF');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);

  const reportesDisponibles = [
    { value: 'ventas', label: 'Reporte de Ventas' },
    { value: 'produccion', label: 'Reporte de Producción' },
    { value: 'inventario', label: 'Reporte de Inventario' },
    { value: 'pedidos-clientes', label: 'Reporte de Pedidos y Clientes' }
  ];

  const formatosDisponibles = [
    { value: 'PDF', label: 'PDF' },
    { value: 'EXCEL', label: 'Excel' },
    { value: 'TXT', label: 'Texto' }
  ];

  const descargarReporte = async (blob, nombreArchivo) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nombreArchivo);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleGenerarReporte = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    setExito(null);

    try {
      let blob;
      let nombreArchivo;

      const extensiones = {
        'PDF': 'pdf',
        'EXCEL': 'xlsx',
        'TXT': 'txt'
      };

      switch (tipoReporte) {
        case 'ventas':
          blob = await reporteAPI.generarReporteVentas(formato, fechaInicio, fechaFin);
          nombreArchivo = `reporte_ventas.${extensiones[formato]}`;
          break;
        case 'produccion':
          blob = await reporteAPI.generarReporteProduccion(formato, fechaInicio, fechaFin);
          nombreArchivo = `reporte_produccion.${extensiones[formato]}`;
          break;
        case 'inventario':
          blob = await reporteAPI.generarReporteInventario(formato);
          nombreArchivo = `reporte_inventario.${extensiones[formato]}`;
          break;
        case 'pedidos-clientes':
          blob = await reporteAPI.generarReportePedidosClientes(formato, fechaInicio, fechaFin);
          nombreArchivo = `reporte_pedidos_clientes.${extensiones[formato]}`;
          break;
        default:
          setError('Tipo de reporte no válido');
          return;
      }

      if (blob) {
        await descargarReporte(blob, nombreArchivo);
        setExito(`Reporte descargado exitosamente: ${nombreArchivo}`);
      }
    } catch (err) {
      setError(err.message || 'Error al generar el reporte');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="reportes-container">
      <div className="header-section">
        <h1>Generar Reportes</h1>
        <p>Selecciona el tipo de reporte, formato y descarga los datos</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {exito && <div className="success-message">{exito}</div>}

      <form onSubmit={handleGenerarReporte} className="reporte-form">
        <div className="form-section">
          <h3>Configuración del Reporte</h3>

          <FormRow>
            <FormSelect
              label="Tipo de Reporte"
              name="tipoReporte"
              value={tipoReporte}
              onChange={(e) => setTipoReporte(e.target.value)}
              options={reportesDisponibles}
              required
            />

            <FormSelect
              label="Formato de Descarga"
              name="formato"
              value={formato}
              onChange={(e) => setFormato(e.target.value)}
              options={formatosDisponibles}
              required
            />
          </FormRow>

          {(tipoReporte !== 'inventario') && (
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
          )}
        </div>

        <button type="submit" className="btn-primary" disabled={cargando}>
          {cargando ? 'Generando...' : 'Generar y Descargar Reporte'}
        </button>
      </form>

      <div className="info-section">
        <h3>Información de Reportes</h3>
        <div className="info-items">
          <div className="info-item">
            <h4>Reporte de Ventas</h4>
            <p>Muestra todos los pedidos realizados con detalles de cliente, total y estado de entrega.</p>
          </div>
          <div className="info-item">
            <h4>Reporte de Producción</h4>
            <p>Contiene información de todas las órdenes de producción, estado y fechas.</p>
          </div>
          <div className="info-item">
            <h4>Reporte de Inventario</h4>
            <p>Detalle actual de todos los insumos, stock disponible y nivel de stock.</p>
          </div>
          <div className="info-item">
            <h4>Reporte de Pedidos y Clientes</h4>
            <p>Información consolidada de pedidos junto con datos de los clientes que los realizaron.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
