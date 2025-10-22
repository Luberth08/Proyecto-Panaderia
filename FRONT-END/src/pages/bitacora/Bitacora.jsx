// src/pages/bitacora/Bitacora.jsx
import { useState} from "react";
import { bitacoraAPI } from "../../api/api";
import CRUDPage from "../../components/common/CRUDPage";
import "../../styles/bitacora/Bitacora.css";

// Componente para mostrar detalles dentro del modal
const DetalleList = ({ detalles }) => {
  if (!detalles || detalles.length === 0) return <p>No hay detalles registrados.</p>;

  return (
    <ul className="detalle-list">
      {detalles.map(det => (
        <li key={det.id} className="detalle-item">
          <span className="detalle-fecha">{new Date(det.fecha).toLocaleString()}</span>
          <span className="detalle-metodo">{det.metodo}</span>
          <span className="detalle-ruta">{det.ruta}</span>
          <p className="detalle-mensaje">{det.mensaje}</p>
        </li>
      ))}
    </ul>
  );
};

// Modal básico
const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

// Columnas de bitácora
const bitacoraColumns = [
  { key: "usuario", title: "Usuario", render: (b) => b.usuario },
  { key: "ip", title: "IP", render: (b) => b.ip },
  { key: "fecha_inicio", title: "Inicio", render: (b) => new Date(b.fecha_inicio).toLocaleString() },
  { key: "fecha_fin", title: "Fin", render: (b) => b.fecha_fin ? new Date(b.fecha_fin).toLocaleString() : "Activo" },
];

export default function Bitacora() {
  const [selectedBitacora, setSelectedBitacora] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Función para cargar detalles de una bitácora
  const loadDetalles = async (id) => {
    try {
      const detalleData = await bitacoraAPI.getDetalle(id);
      setSelectedBitacora(id);
      setDetalles(detalleData);
      setModalVisible(true);
    } catch (error) {
      console.error("Error al cargar detalles:", error);
    }
  };

  return (
    <div className="bitacora-page">
      <h1>Bitácora de Actividades</h1>
      <p>Visualiza las sesiones y acciones de los usuarios en el sistema.</p>

      <CRUDPage
        title="Bitácoras"
        description="Registro de sesiones de usuarios"
        api={bitacoraAPI}            // usa la API actualizada
        columns={bitacoraColumns}
        initialFormState={{}}
        searchFields={["usuario", "ip"]}
        rowKey="id"
        onRowClick={(bitacora) => loadDetalles(bitacora.id)}
        hideActions                 // no mostrar acciones de CRUD
      />

      <Modal
        show={modalVisible}
        onClose={() => setModalVisible(false)}
        title={`Detalles de Bitácora #${selectedBitacora}`}
      >
        <DetalleList detalles={detalles} />
      </Modal>
    </div>
  );
}
