import React, { useState } from 'react';
import { clientesApi } from '../services/api';
import ConfirmModal from './ConfirmModal';
import DetailModal from './DetailModal';

const initialForm = {
  nombre: '',
  correo: '',
  telefono: '',
  identificacion: ''
};

export default function ClientesView({ clientes, onRefresh, notify }) {
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [detailData, setDetailData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        const res = await clientesApi.update(editingId, form);
        notify('success', res.mensaje || 'Cliente actualizado correctamente.');
      } else {
        const res = await clientesApi.create(form);
        notify('success', res.mensaje || 'Cliente registrado exitosamente.');
      }
      resetForm();
      await onRefresh();
    } catch (err) {
      notify('error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cliente) => {
    setEditingId(cliente.id);
    setForm({
      nombre: cliente.nombre || '',
      correo: cliente.correo || '',
      telefono: cliente.telefono || '',
      identificacion: cliente.identificacion || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewById = async (id) => {
    try {
      const data = await clientesApi.getById(id);
      setDetailData(data);
    } catch (err) {
      notify('error', err.message);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await clientesApi.remove(deleteTarget.id);
      notify('success', res.mensaje || 'Cliente eliminado correctamente.');
      if (editingId === deleteTarget.id) resetForm();
      setDeleteTarget(null);
      await onRefresh();
    } catch (err) {
      notify('error', err.message);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const filteredClientes = clientes.filter((c) => {
    const term = search.toLowerCase();
    return (
      String(c.id).includes(term) ||
      (c.nombre || '').toLowerCase().includes(term) ||
      (c.correo || '').toLowerCase().includes(term) ||
      (c.identificacion || '').toLowerCase().includes(term) ||
      (c.telefono || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="crud-layout">
      {/* Formulario de Registro / Edición */}
      <div className="panel-card form-panel">
        <div className="panel-header">
          <div>
            <span className="panel-eyebrow">Registro</span>
            <h2 className="panel-title">
              {editingId ? `Editar cliente #${editingId}` : 'Nuevo cliente'}
            </h2>
          </div>
          {editingId && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={resetForm}>
              Cancelar edición
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="entity-form">
          <div className="form-group">
            <label htmlFor="cliente-nombre">Nombre Completo *</label>
            <input
              id="cliente-nombre"
              type="text"
              name="nombre"
              placeholder="Ej: Carlos Mendoza Rivera"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cliente-identificacion">Número de Identificación *</label>
            <input
              id="cliente-identificacion"
              type="text"
              name="identificacion"
              placeholder="Ej: 1-1452-0893"
              value={form.identificacion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cliente-correo">Correo Electrónico *</label>
            <input
              id="cliente-correo"
              type="email"
              name="correo"
              placeholder="cliente@empresa.com"
              value={form.correo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cliente-telefono">Teléfono de Contacto *</label>
            <input
              id="cliente-telefono"
              type="text"
              name="telefono"
              placeholder="Ej: +506 8845-1290"
              value={form.telefono}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting
                ? 'Guardando...'
                : editingId
                  ? 'Actualizar Datos del Cliente'
                  : 'Registrar Cliente'}
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de Clientes */}
      <div className="panel-card table-panel">
        <div className="panel-header table-toolbar">
          <div>
            <h2 className="panel-title">Directorio de Clientes ({filteredClientes.length})</h2>
            <p className="panel-subtitle">
              Administre la información de contacto e identificación de los clientes
            </p>
          </div>
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por nombre, cédula, correo o ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Identificación</th>
                <th>Contacto</th>
                <th>Alquileres</th>
                <th className="actions-col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClientes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-cell">
                    No se encontraron clientes que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredClientes.map((cliente) => (
                  <tr key={cliente.id} className={editingId === cliente.id ? 'row-editing' : ''}>
                    <td className="id-cell">#{cliente.id}</td>
                    <td>
                      <div className="cell-primary">{cliente.nombre}</div>
                    </td>
                    <td>
                      <span className="mono-chip">{cliente.identificacion}</span>
                    </td>
                    <td>
                      <div className="cell-primary">{cliente.correo}</div>
                      <div className="cell-secondary">{cliente.telefono}</div>
                    </td>
                    <td>
                      <span className="count-pill">
                        {Array.isArray(cliente.alquileres) ? cliente.alquileres.length : 0} contratos
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="btn-action btn-view"
                        title="Consultar por ID"
                        onClick={() => handleViewById(cliente.id)}
                      >
                        Ver
                      </button>
                      <button
                        type="button"
                        className="btn-action btn-edit"
                        onClick={() => handleEdit(cliente)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn-action btn-delete"
                        onClick={() => setDeleteTarget(cliente)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Confirmación Eliminar */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Eliminar Cliente"
        message="¿Está seguro de que desea eliminar este cliente del sistema?"
        itemLabel={
          deleteTarget
            ? `${deleteTarget.nombre} (ID: #${deleteTarget.id} - ${deleteTarget.identificacion})`
            : ''
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {/* Modal Detalle por ID */}
      <DetailModal
        isOpen={Boolean(detailData)}
        title={detailData ? `Ficha de Cliente #${detailData.id}` : ''}
        subtitle="Consulta individual desde endpoint GET /api/clientes/:id"
        fields={
          detailData
            ? [
                { label: 'ID de Registro', value: `#${detailData.id}` },
                { label: 'Nombre Completo', value: detailData.nombre },
                { label: 'Identificación', value: detailData.identificacion },
                { label: 'Correo Electrónico', value: detailData.correo },
                { label: 'Teléfono', value: detailData.telefono }
              ]
            : []
        }
        relatedRentals={detailData?.alquileres || []}
        onClose={() => setDetailData(null)}
      />
    </div>
  );
}

