// src/pages/compra/NotaCompra.jsx
import { useState, useEffect } from 'react';
import {
  notaCompraAPI,
  usuarioAPI,
  proveedorAPI,
  compraInsumoAPI,
  compraProductoAPI,
  insumoAPI,
  productoAPI
} from '../../api/api';
import CRUDPage from '../../components/common/CRUDPage';
import FormInput from '../../components/ui/Form/FormInput';
import FormSelect from '../../components/ui/Form/FormSelect';
import FormRow from '../../components/ui/Form/FormRow';
import { useForm } from '../../hooks/useForm';
import { useApi } from '../../hooks/useApi';
import { useModal, useConfirmModal } from '../../hooks/useModal';
import Modal from '../../components/ui/Modal/Modal';
import ConfirmModal from '../../components/ui/Modal/ConfirmModal';
import '../../styles/compra/NotaCompra.css';

// ----------------------------
// Formulario de Nota de Compra
// ----------------------------
const NotaCompraForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const { execute: loadUsuarios } = useApi(() => usuarioAPI.getAll(), true);
  const { execute: loadProveedores } = useApi(() => proveedorAPI.getAll(), true);

  useEffect(() => {
    const fetch = async () => {
      const u = await loadUsuarios();
      const p = await loadProveedores();
      setUsuarios(u || []);
      setProveedores(p || []);
    };
    fetch();
  }, []);

  const { form, handleChange, validateForm } = useForm(initialData, {
    fecha_pedido: { required: true },
    fecha_entrega: { required: true },
    id_usuario: { required: true },
    codigo_proveedor: { required: true }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form nota-compra-form">
      <FormRow>
        <FormInput
          label="Fecha de Pedido"
          name="fecha_pedido"
          value={form.fecha_pedido}
          onChange={handleChange}
          type="date"
          required
        />
        <FormInput
          label="Fecha de Entrega"
          name="fecha_entrega"
          value={form.fecha_entrega}
          onChange={handleChange}
          type="date"
          required
        />
      </FormRow>

      <FormRow>
        <FormSelect
          label="Usuario"
          name="id_usuario"
          value={form.id_usuario}
          onChange={handleChange}
          options={usuarios.map(u => ({ value: u.id, label: u.nombre }))}
          placeholder="Seleccionar usuario"
          required
        />
        <FormSelect
          label="Proveedor"
          name="codigo_proveedor"
          value={form.codigo_proveedor}
          onChange={handleChange}
          options={proveedores.map(p => ({ value: p.codigo, label: p.nombre }))}
          placeholder="Seleccionar proveedor"
          required
        />
      </FormRow>

      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">
          {isEditing ? 'Actualizar' : 'Crear'} Nota
        </button>
      </div>
    </form>
  );
};

// ----------------------------
// Formulario reutilizable para Detalle (Add / Edit)
// ----------------------------
const DetalleForm = ({ initialData, insumosOptions = [], productosOptions = [], onSubmit, onCancel, type = 'insumo' }) => {
  const validations = { cantidad: { required: true }, precio: { required: true } };
  const { form, handleChange, validateForm } = useForm(initialData, validations);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const cleaned = { ...form, cantidad: Number(form.cantidad), precio: Number(form.precio) };
    cleaned.total = Number((cleaned.cantidad * cleaned.precio).toFixed(2));
    onSubmit(cleaned);
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form detalle-compra-form">
      <FormRow>
        {type === 'insumo' ? (
          <FormSelect
            label="Insumo"
            name="id_insumo"
            value={form.id_insumo}
            onChange={handleChange}
            options={insumosOptions}
            placeholder="Seleccionar insumo"
            required={!form.id_insumo}
            disabled={!!form.id_insumo}
          />
        ) : (
          <FormSelect
            label="Producto"
            name="id_producto"
            value={form.id_producto}
            onChange={handleChange}
            options={productosOptions}
            placeholder="Seleccionar producto"
            required={!form.id_producto}
            disabled={!!form.id_producto}
          />
        )}

        <FormInput
          label="Cantidad"
          name="cantidad"
          type="number"
          value={form.cantidad}
          onChange={handleChange}
          min="0"
          required
        />
        <FormInput
          label="Precio"
          name="precio"
          type="number"
          value={form.precio}
          onChange={handleChange}
          min="0"
          step="0.01"
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
// Columnas principales NotaCompra
// ----------------------------
const notaCompraColumns = (onVerInsumos, onVerProductos) => [
  { key: 'id', title: 'ID', width: '70px' },
  { key: 'fecha_pedido', title: 'Fecha de Pedido' },
  { key: 'fecha_entrega', title: 'Fecha de Entrega' },
  { key: 'usuario', title: 'Usuario' },
  { key: 'proveedor', title: 'Proveedor' },
  {
    key: 'acciones',
    title: 'Acciones',
    render: (nota) => (
      <div className="table-actions">
        <button className="btn-secondary btn-sm" onClick={() => onVerInsumos(nota)}>Ver Insumos</button>
        <button className="btn-primary btn-sm" onClick={() => onVerProductos(nota)}>Ver Productos</button>
      </div>
    )
  }
];

// ----------------------------
// Componente principal
// ----------------------------
export default function NotaCompra() {
  const [notaSeleccionada, setNotaSeleccionada] = useState(null);
  const [detalleInsumos, setDetalleInsumos] = useState([]);
  const [detalleProductos, setDetalleProductos] = useState([]);
  const [insumosOptions, setInsumosOptions] = useState([]);
  const [productosOptions, setProductosOptions] = useState([]);

  const insumoModal = useModal();
  const productoModal = useModal();
  const confirmModal = useConfirmModal();

  const { execute: loadCompraInsumo } = useApi(() => compraInsumoAPI.getAll(), true);
  const { execute: loadCompraProducto } = useApi(() => compraProductoAPI.getAll(), true);
  const { execute: loadInsumos } = useApi(() => insumoAPI.getAll(), true);
  const { execute: loadProductos } = useApi(() => productoAPI.getAll(), true);

  useEffect(() => {
    const preload = async () => {
      const ins = await loadInsumos();
      const prods = await loadProductos();
      setInsumosOptions((ins || []).map(i => ({ value: i.id, label: i.nombre })));
      setProductosOptions((prods || []).map(p => ({ value: p.id, label: p.nombre })));
    };
    preload();
  }, []);

  const refreshDetalleInsumos = async (idNota) => {
    const all = await loadCompraInsumo();
    const filtered = (all || []).filter(d => d.id_nota_compra === idNota);
    setDetalleInsumos(filtered);
  };

  const refreshDetalleProductos = async (idNota) => {
    const all = await loadCompraProducto();
    const filtered = (all || []).filter(d => d.id_nota_compra === idNota);
    setDetalleProductos(filtered);
  };

  const handleVerInsumos = async (nota) => {
    await refreshDetalleInsumos(nota.id);
    setNotaSeleccionada(nota);
    setTimeout(() => insumoModal.openModal(), 0);
  };

  const handleVerProductos = async (nota) => {
    await refreshDetalleProductos(nota.id);
    setNotaSeleccionada(nota);
    setTimeout(() => productoModal.openModal(), 0);
  };

  // ---------- INSUMOS ----------
  const handleAddInsumo = () => {
    insumoModal.openModal({
      id_nota_compra: notaSeleccionada.id,
      id_insumo: '',
      cantidad: '',
      precio: '',
      total: ''
    });
  };

  const handleEditInsumo = (detalle) => {
    insumoModal.openModal({ ...detalle });
  };

  const handleSaveInsumo = async (form) => {
    try {
      if (insumoModal.modalData && insumoModal.modalData.id_insumo) {
        await compraInsumoAPI.update(form.id_nota_compra, form.id_insumo, {
          cantidad: form.cantidad,
          precio: form.precio,
          total: form.total
        });
      } else {
        await compraInsumoAPI.create({
          id_insumo: form.id_insumo,
          id_nota_compra: form.id_nota_compra,
          cantidad: form.cantidad,
          precio: form.precio,
          total: form.total
        });
      }
      insumoModal.closeModal();
      await refreshDetalleInsumos(form.id_nota_compra);
    } catch (err) {
      console.error('Error guardando insumo:', err);
    }
  };

  const handleConfirmDeleteInsumo = (detalle) => {
    confirmModal.openConfirmModal(detalle, async (item) => {
      try {
        await compraInsumoAPI.delete(item.id_nota_compra, item.id_insumo);
        await refreshDetalleInsumos(item.id_nota_compra);
      } catch (err) {
        console.error('Error eliminando insumo:', err);
      }
    });
  };

  // ---------- PRODUCTOS ----------
  const handleAddProducto = () => {
    productoModal.openModal({
      id_nota_compra: notaSeleccionada.id,
      id_producto: '',
      cantidad: '',
      precio: '',
      total: ''
    });
  };

  const handleEditProducto = (detalle) => {
    productoModal.openModal({ ...detalle });
  };

  const handleSaveProducto = async (form) => {
    try {
      if (productoModal.modalData && productoModal.modalData.id_producto) {
        await compraProductoAPI.update(form.id_nota_compra, form.id_producto, {
          cantidad: form.cantidad,
          precio: form.precio,
          total: form.total
        });
      } else {
        await compraProductoAPI.create({
          id_producto: form.id_producto,
          id_nota_compra: form.id_nota_compra,
          cantidad: form.cantidad,
          precio: form.precio,
          total: form.total
        });
      }
      productoModal.closeModal();
      await refreshDetalleProductos(form.id_nota_compra);
    } catch (err) {
      console.error('Error guardando producto:', err);
    }
  };

  const handleConfirmDeleteProducto = (detalle) => {
    confirmModal.openConfirmModal(detalle, async (item) => {
      try {
        await compraProductoAPI.delete(item.id_nota_compra, item.id_producto);
        await refreshDetalleProductos(item.id_nota_compra);
      } catch (err) {
        console.error('Error eliminando producto:', err);
      }
    });
  };

  return (
    <>
      <CRUDPage
        title="Notas de Compra"
        description="Administra las notas de compra del sistema"
        api={notaCompraAPI}
        columns={notaCompraColumns(handleVerInsumos, handleVerProductos)}
        FormComponent={NotaCompraForm}
        initialFormState={{
          fecha_pedido: '',
          fecha_entrega: '',
          id_usuario: '',
          codigo_proveedor: ''
        }}
        searchFields={['usuario', 'proveedor']}
        rowKey="id"
      />

      {/* Modal Insumos */}
      <Modal
        isOpen={insumoModal.isOpen}
        onClose={() => insumoModal.closeModal() || setNotaSeleccionada(null)}
        title={`Insumos - Nota ${notaSeleccionada?.id ?? ''}`}
        size="large"
      >
        <div className="modal-toolbar">
          <button className="btn-primary" onClick={handleAddInsumo}>+ Agregar Insumo</button>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Insumo</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
                <th style={{ width: 180 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {detalleInsumos.length === 0 ? (
                <tr><td colSpan={5} className="empty-message">No hay insumos registrados</td></tr>
              ) : detalleInsumos.map(det => (
                <tr key={`${det.id_nota_compra}-${det.id_insumo}`}>
                  <td>{det.insumo ?? det.id_insumo}</td>
                  <td>{det.cantidad}</td>
                  <td>{det.precio}</td>
                  <td>{det.total}</td>
                  <td>
                    <button className="btn-secondary btn-sm" onClick={() => handleEditInsumo(det)}>Editar</button>
                    <button className="btn-danger btn-sm" onClick={() => handleConfirmDeleteInsumo(det)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Submodal: Add / Edit Insumo */}
      <Modal
        isOpen={insumoModal.modalData !== null && !!insumoModal.isOpen}
        onClose={() => insumoModal.closeModal()}
        title={insumoModal.modalData && insumoModal.modalData.id_insumo ? 'Editar Insumo' : 'Agregar Insumo'}
        size="medium"
      >
        {insumoModal.modalData && (
          <DetalleForm
            initialData={insumoModal.modalData}
            insumosOptions={insumosOptions}
            onSubmit={handleSaveInsumo}
            onCancel={() => insumoModal.closeModal()}
            type="insumo"
          />
        )}
      </Modal>

      {/* Modal Productos */}
      <Modal
        isOpen={productoModal.isOpen}
        onClose={() => productoModal.closeModal() || setNotaSeleccionada(null)}
        title={`Productos - Nota ${notaSeleccionada?.id ?? ''}`}
        size="large"
      >
        <div className="modal-toolbar">
          <button className="btn-primary" onClick={handleAddProducto}>+ Agregar Producto</button>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
                <th style={{ width: 180 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {detalleProductos.length === 0 ? (
                <tr><td colSpan={5} className="empty-message">No hay productos registrados</td></tr>
              ) : detalleProductos.map(det => (
                <tr key={`${det.id_nota_compra}-${det.id_producto}`}>
                  <td>{det.producto ?? det.id_producto}</td>
                  <td>{det.cantidad}</td>
                  <td>{det.precio}</td>
                  <td>{det.total}</td>
                  <td>
                    <button className="btn-secondary btn-sm" onClick={() => handleEditProducto(det)}>Editar</button>
                    <button className="btn-danger btn-sm" onClick={() => handleConfirmDeleteProducto(det)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Submodal: Add / Edit Producto */}
      <Modal
        isOpen={productoModal.modalData !== null && !!productoModal.isOpen}
        onClose={() => productoModal.closeModal()}
        title={productoModal.modalData && productoModal.modalData.id_producto ? 'Editar Producto' : 'Agregar Producto'}
        size="medium"
      >
        {productoModal.modalData && (
          <DetalleForm
            initialData={productoModal.modalData}
            productosOptions={productosOptions}
            onSubmit={handleSaveProducto}
            onCancel={() => productoModal.closeModal()}
            type="producto"
          />
        )}
      </Modal>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.closeConfirmModal}
        onConfirm={confirmModal.handleConfirm}
        title={confirmModal.itemToDelete ? 'Confirmar eliminación' : undefined}
        message={confirmModal.itemToDelete ? '¿Confirma eliminar este elemento?' : undefined}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
      />
    </>
  );
}
