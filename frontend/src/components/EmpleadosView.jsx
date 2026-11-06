import React, { useState } from 'react';
import { empleadosApi } from '../services/api';
import ConfirmModal from './ConfirmModal';
import DetailModal from './DetailModal';

const initialForm = {
  nombre: '',
  correo: '',
  telefono: '',
  cargo: ''
};

export default function EmpleadosView({ empleados, onRefresh, notify }) {
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
        const res = await empleadosApi.update(editingId, form);
        notify('success', res.mensaje || 'Empleado actualizado correctamente.');
      } else {
        const res = await empleadosApi.create(form);
        notify('success', res.mensaje || 'Empleado registrado exitosamente.');
      }
      resetForm();
      await onRefresh();
    } catch (err) {
      notify('error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setForm({
      nombre: emp.nombre || '',
      correo: emp.correo || '',
      telefono: emp.telefono || '',
      cargo: emp.cargo || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewById = async (id) => {
    try {
      const data = await empleadosApi.getById(id);
      setDetailData(data);
    } catch (err) {
      notify('error', err.message);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await empleadosApi.remove(deleteTarget.id);
      notify('success', res.mensaje || 'Empleado eliminado correctamente.');
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

  const filteredEmpleados = empleados.filter((e) => {
    const term = search.toLowerCase();
    return (
      String(e.id).includes(term) ||
      (e.nombre || '').toLowerCase().includes(term) ||
      (e.correo || '').toLowerCase().includes(term) ||
      (e.cargo || '').toLowerCase().includes(term) ||
      (e.telefono || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="crud-layout">
      {/* Formulario de Registro / Edición */}
      <div className="panel-card form-panel">
        <div className="panel-header">
          <div>
            <span className="panel-eyebrow">Equipo</span>
            <h2 className="panel-title">
              {editingId ? `Editar integrante #${editingId}` : 'Agregar al equipo'}
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
            <label htmlFor="empleado-nombre">Nombre Completo *</label>
            <input
              id="empleado-nombre"
              type="text"
              name="nombre"
              placeholder="Ej: Laura Fernández Vega"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="empleado-cargo">Cargo / Puesto Operativo *</label>
            <input
              id="empleado-cargo"
              type="text"
              name="cargo"
              placeholder="Ej: Ejecutiva de Ventas Senior"
              value={form.cargo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="empleado-correo">Correo Corporativo *</label>
            <input
              id="empleado-correo"
              type="email"
              name="correo"
              placeholder="empleado@autorent.com"
              value={form.correo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="empleado-telefono">Teléfono / Extensión *</label>
            <input
              id="empleado-telefono"
              type="text"
              name="telefono"
              placeholder="Ej: +506 2250-1001"
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
                  ? 'Actualizar Datos del Empleado'
                  : 'Registrar Empleado'}
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de Empleados */}
      <div className="panel-card table-panel">
        <div className="panel-header table-toolbar">
          <div>
            <h2 className="panel-title">Personal de AutoRent ({filteredEmpleados.length})</h2>
            <p className="panel-subtitle">
              Ejecutivos, asesores comerciales y coordinadores de flota
            </p>
          </div>
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por nombre, cargo o correo..."
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
                <th>Colaborador</th>
                <th>Cargo</th>
                <th>Contacto</th>
                <th>Gestión</th>
                <th className="actions-col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmpleados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-cell">
                    No se encontraron empleados registrados.
                  </td>
                </tr>
              ) : (
                filteredEmpleados.map((emp) => (
                  <tr key={emp.id} className={editingId === emp.id ? 'row-editing' : ''}>
                    <td className="id-cell">#{emp.id}</td>
                    <td>
                      <div className="cell-primary">{emp.nombre}</div>
                    </td>
                    <td>
                      <span className="role-chip">{emp.cargo}</span>
                    </td>
                    <td>
                      <div className="cell-primary">{emp.correo}</div>
                      <div className="cell-secondary">{emp.telefono}</div>
                    </td>
                    <td>
                      <span className="count-pill">
                        {Array.isArray(emp.alquileres) ? emp.alquileres.length : 0} alquileres
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="btn-action btn-view"
                        onClick={() => handleViewById(emp.id)}
                      >
                        Ver
                      </button>
                      <button
                        type="button"
                        className="btn-action btn-edit"
                        onClick={() => handleEdit(emp)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn-action btn-delete"
                        onClick={() => setDeleteTarget(emp)}
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
        title="Eliminar Empleado"
        message="¿Está seguro de que desea eliminar este empleado del directorio?"
        itemLabel={deleteTarget ? `${deleteTarget.nombre} (${deleteTarget.cargo})` : ''}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {/* Modal Detalle por ID */}
      <DetailModal
        isOpen={Boolean(detailData)}
        title={detailData ? `Perfil de Colaborador #${detailData.id}` : ''}
        subtitle="Consulta individual desde endpoint GET /api/empleados/:id"
        fields={
          detailData
            ? [
                { label: 'ID de Colaborador', value: `#${detailData.id}` },
                { label: 'Nombre Completo', value: detailData.nombre },
                { label: 'Cargo', value: detailData.cargo },
                { label: 'Correo Corporativo', value: detailData.correo },
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

