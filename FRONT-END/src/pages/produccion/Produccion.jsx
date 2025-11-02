// src/pages/produccion/Produccion.jsx
import { useState, useEffect } from "react";
import CRUDPage from "../../components/common/CRUDPage";
import Modal from "../../components/ui/Modal/Modal";
import FormInput from "../../components/ui/Form/FormInput";
import FormSelect from "../../components/ui/Form/FormSelect";
import FormRow from "../../components/ui/Form/FormRow";
import { useForm } from "../../hooks/useForm";
import { useApi } from "../../hooks/useApi";
import { useModal } from "../../hooks/useModal";
import { produccionAPI, recetaAPI, participaAPI, usuarioAPI } from "../../api/api";

// ----------------------------
// Formulario de Producción
// ----------------------------
const ProduccionForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const [recetas, setRecetas] = useState([]);
  const { execute: loadRecetas } = useApi(() => recetaAPI.getAll(), true);

  const { form, handleChange, validateForm } = useForm(initialData, {
    descripcion: { required: true },
    fecha: { required: true },
    hora_inicio: { required: true },
    terminado: { required: true },
    id_receta: { required: true }
  });

  // Cargamos recetas
  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const res = await loadRecetas();
        if (res && Array.isArray(res)) {
          console.log('Recetas cargadas:', res); // Para debug
          setRecetas(res);
        } else {
          console.error('Error: las recetas no son un array:', res);
          setRecetas([]);
        }
      } catch (error) {
        console.error('Error al cargar recetas:', error);
        setRecetas([]);
      }
    };
    fetchRecetas();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form produccion-form">
      <FormRow>
        <FormInput label="Descripción" name="descripcion" value={form.descripcion} onChange={handleChange} required />
        <FormInput label="Fecha" name="fecha" type="date" value={form.fecha} onChange={handleChange} required />
        <FormInput label="Hora de inicio" name="hora_inicio" type="time" value={form.hora_inicio} onChange={handleChange} required />
        <FormSelect
          label="Terminado"
          name="terminado"
          value={form.terminado}
          onChange={handleChange}
          options={[
            { value: false, label: "No" },
            { value: true, label: "Sí" }
          ]}
          required
        />
      </FormRow>

      <FormRow>
        <FormSelect
          label="Receta"
          name="id_receta"
          value={form.id_receta}
          onChange={handleChange}
          options={(recetas || []).map(r => ({ value: r.id, label: r.producto }))}
          placeholder="Seleccionar receta"
          required
        />
      </FormRow>

      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">{isEditing ? "Actualizar" : "Crear"} Producción</button>
      </div>
    </form>
  );
};

// ----------------------------
// Formulario de Participante
// ----------------------------
const ParticipanteForm = ({ initialData, usuariosOptions = [], onSubmit, onCancel }) => {
  const { form, handleChange, validateForm } = useForm(initialData, {
    id_usuario: { required: true },
    fecha: { required: true }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form participante-form">
      <FormRow>
        <FormSelect
          label="Usuario"
          name="id_usuario"
          value={form.id_usuario}
          onChange={handleChange}
          options={usuariosOptions}
          placeholder="Seleccionar usuario"
          required={!form.id_usuario}
          disabled={!!form.id_usuario}
        />
        <FormInput
          label="Fecha"
          name="fecha"
          type="date"
          value={form.fecha}
          onChange={handleChange}
          required
        />
      </FormRow>

      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">Guardar</button>
      </div>
    </form>
  );
};

// ----------------------------
// Componente Principal
// ----------------------------
export default function Produccion() {
  const [produccionSeleccionada, setProduccionSeleccionada] = useState(null);
  const [participantes, setParticipantes] = useState([]);
  const [usuariosOptions, setUsuariosOptions] = useState([]);
  const [participanteEditing, setParticipanteEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const produccionModal = useModal();
  const participanteModal = useModal();

  const { execute: loadParticipa } = useApi(() => participaAPI.getAll(), true);
  const { execute: loadUsuarios } = useApi(() => usuarioAPI.getAll(), true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const res = await loadUsuarios();
      setUsuariosOptions((res || []).map(u => ({ value: u.id, label: u.nombre })));
    };
    fetchUsuarios();
  }, []);

  // PARTICIPANTES
  const refreshParticipantes = async (idProduccion) => {
    const all = await loadParticipa();
    setParticipantes((all || []).filter(p => p.id_produccion === idProduccion));
  };

  const handleVerParticipantes = async (produccion) => {
    setProduccionSeleccionada(produccion);
    await refreshParticipantes(produccion.id);
    participanteModal.openModal();
  };

  const handleAddParticipante = () => {
    setParticipanteEditing({ id_usuario: "", id_produccion: produccionSeleccionada.id, fecha: "" });
    participanteModal.openModal();
  };

  const handleEditParticipante = (p) => {
    setParticipanteEditing({ ...p });
    participanteModal.openModal();
  };

  const handleSaveParticipante = async (form) => {
    try {
      const exists = participantes.find(p => p.id_usuario === form.id_usuario && p.id_produccion === form.id_produccion);
      if (exists) {
        await participaAPI.update(form.id_usuario, form.id_produccion, { fecha: form.fecha });
      } else {
        await participaAPI.create(form);
      }
      setParticipanteEditing(null);
      await refreshParticipantes(form.id_produccion);
    } catch (err) {
      console.error("Error guardando participante:", err);
    }
  };

  // ELIMINAR PARTICIPANTE
  const handleRequestDelete = (p) => setConfirmDelete(p);
  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    try {
      await participaAPI.delete(confirmDelete.id_usuario, confirmDelete.id_produccion);
      await refreshParticipantes(confirmDelete.id_produccion);
      setConfirmDelete(null);
    } catch (err) {
      console.error("Error eliminando participante:", err);
      setConfirmDelete(null);
    }
  };
  const handleCancelDelete = () => setConfirmDelete(null);

  // COLUMNAS
  const produccionColumns = (onVerParticipantes) => [
    { key: "id", title: "ID", width: "70px" },
    { key: "descripcion", title: "Descripción" },
    { key: "fecha", title: "Fecha" },
    { key: "hora_inicio", title: "Hora Inicio" },
    { key: "terminado", title: "Terminado", render: p => (p.terminado ? "Sí" : "No") },
    { key: "producto", title: "Producto" },
    {
      key: "acciones",
      title: "Acciones",
      render: (p) => (
        <div className="table-actions">
          <button className="btn-secondary btn-sm" onClick={() => onVerParticipantes(p)}>Ver Participantes</button>
        </div>
      )
    }
  ];

  return (
    <>
      <CRUDPage
        title="Producciones"
        description="Administra las producciones del sistema"
        api={produccionAPI}
        columns={produccionColumns(handleVerParticipantes)}
        FormComponent={ProduccionForm}
        initialFormState={{
          descripcion: "",
          fecha: "",
          hora_inicio: "",
          terminado: false,
          id_receta: ""
        }}
        searchFields={["descripcion", "producto"]}
        rowKey="id"
      />

      {/* Modal Participantes */}
      <Modal
        isOpen={participanteModal.isOpen}
        onClose={() => { participanteModal.closeModal(); setProduccionSeleccionada(null); }}
        title={`Participantes - Producción ${produccionSeleccionada?.id ?? ""}`}
        size="large"
      >
        <div className="modal-toolbar">
          <button className="btn-primary" onClick={handleAddParticipante}>+ Agregar Participante</button>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Fecha</th>
                <th style={{ width: 180 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {participantes.length === 0 ? (
                <tr>
                  <td colSpan={3} className="empty-message">No hay participantes registrados</td>
                </tr>
              ) : (
                participantes.map(p => (
                  <tr key={`${p.id_usuario}-${p.id_produccion}`}>
                    <td>{p.usuario}</td>
                    <td>{p.fecha}</td>
                    <td>
                      <button className="btn-secondary btn-sm" onClick={() => handleEditParticipante(p)}>Editar</button>
                      <button className="btn-danger btn-sm" onClick={() => handleRequestDelete(p)}>Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Submodal Agregar/Editar Participante */}
      <Modal
        isOpen={participanteEditing !== null && participanteModal.isOpen}
        onClose={() => setParticipanteEditing(null)}
        title={participanteEditing?.id_usuario ? "Editar Participante" : "Agregar Participante"}
        size="medium"
      >
        {participanteEditing && (
          <ParticipanteForm
            initialData={participanteEditing}
            usuariosOptions={usuariosOptions}
            onSubmit={handleSaveParticipante}
            onCancel={() => setParticipanteEditing(null)}
          />
        )}
      </Modal>

      {/* Modal Confirmación */}
      <Modal
        isOpen={confirmDelete !== null}
        onClose={handleCancelDelete}
        title="Confirmar eliminación"
        size="small"
      >
        <p>¿Está seguro que desea eliminar este participante?</p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={handleCancelDelete}>Cancelar</button>
          <button className="btn-danger" onClick={handleConfirmDelete}>Sí, eliminar</button>
        </div>
      </Modal>
    </>
  );
}
