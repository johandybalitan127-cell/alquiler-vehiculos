import React, { useState } from 'react';
import { alquileresApi } from '../services/api';
import { formatColones } from '../utils/vehicleImages';
import ConfirmModal from './ConfirmModal';
import DetailModal from './DetailModal';

const getTodayStr = () => new Date().toISOString().split('T')[0];

const initialForm = {
  cliente_id: '',
  vehiculo_id: '',
  empleado_id: '',
  fecha_inicio: getTodayStr(),
  fecha_fin: getTodayStr(),
  total: '',
  estado: 'Activo'
};

export default function AlquileresView({
  alquileres,
  clientes,
  vehiculos,
  empleados,
  onRefresh,
  notify
}) {
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [detailData, setDetailData] = useState(null);

  const calculateAutoTotal = (vehiculoId, inicio, fin) => {
    const veh = vehiculos.find((v) => String(v.id) === String(vehiculoId));
    if (!veh || !inicio || !fin) return '';
    const start = new Date(inicio);
    const end = new Date(fin);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
      return '';
    }
    const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    return (diffDays * Number(veh.precio_dia)).toFixed(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'vehiculo_id' || name === 'fecha_inicio' || name === 'fecha_fin') {
        const suggested = calculateAutoTotal(
          next.vehiculo_id,
          next.fecha_inicio,
          next.fecha_fin
        );
        if (suggested) {
          next.total = suggested;
        }
      }
      return next;
    });
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        cliente_id: Number(form.cliente_id),
        vehiculo_id: Number(form.vehiculo_id),
        empleado_id: Number(form.empleado_id),
        fecha_inicio: form.fecha_inicio,
        fecha_fin: form.fecha_fin,
        total: Number(form.total),
        estado: form.estado
      };

      if (editingId) {
        const res = await alquileresApi.update(editingId, payload);
        notify('success', res.mensaje || 'Contrato de alquiler actualizado.');
      } else {
        const res = await alquileresApi.create(payload);
        notify('success', res.mensaje || 'Contrato de alquiler registrado exitosamente.');
      }
      resetForm();
      await onRefresh();
    } catch (err) {
      notify('error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (alq) => {
    setEditingId(alq.id);
    setForm({
      cliente_id: alq.cliente_id || '',
      vehiculo_id: alq.vehiculo_id || '',
      empleado_id: alq.empleado_id || '',
      fecha_inicio: alq.fecha_inicio || getTodayStr(),
      fecha_fin: alq.fecha_fin || getTodayStr(),
      total: alq.total || '',
      estado: alq.estado || 'Activo'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewById = async (id) => {
    try {
      const data = await alquileresApi.getById(id);
      setDetailData(data);
    } catch (err) {
      notify('error', err.message);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await alquileresApi.remove(deleteTarget.id);
      notify('success', res.mensaje || 'Contrato de alquiler eliminado correctamente.');
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

  const filteredAlquileres = alquileres.filter((a) => {
    const matchesStatus = statusFilter === 'Todos' || a.estado === statusFilter;
    const term = search.toLowerCase();
    const clienteNombre = a.cliente?.nombre?.toLowerCase() || '';
    const vehiculoStr = `${a.vehiculo?.marca || ''} ${a.vehiculo?.modelo || ''} ${a.vehiculo?.placa || ''}`.toLowerCase();
    const empleadoNombre = a.empleado?.nombre?.toLowerCase() || '';

    const matchesSearch =
      String(a.id).includes(term) ||
      clienteNombre.includes(term) ||
      vehiculoStr.includes(term) ||
      empleadoNombre.includes(term);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="crud-layout">
      {/* Formulario de Registro / Edición de Contrato */}
      <div className="panel-card form-panel">
        <div className="panel-header">
          <div>
            <span className="panel-eyebrow">Reservas</span>
            <h2 className="panel-title">
              {editingId ? `Editar alquiler #${editingId}` : 'Nuevo alquiler'}
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
            <label htmlFor="alquiler-cliente">Cliente Titular *</label>
            <select
              id="alquiler-cliente"
              name="cliente_id"
              value={form.cliente_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Seleccione un cliente --</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} ({c.identificacion})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="alquiler-vehiculo">Vehículo Asignado *</label>
            <select
              id="alquiler-vehiculo"
              name="vehiculo_id"
              value={form.vehiculo_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Seleccione un vehículo --</option>
              {vehiculos.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.marca} {v.modelo} [{v.placa}] — {formatColones(v.precio_dia)}/día ({v.estado})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="alquiler-empleado">Asesor / Empleado Responsable *</label>
            <select
              id="alquiler-empleado"
              name="empleado_id"
              value={form.empleado_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Seleccione un empleado --</option>
              {empleados.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nombre} — {emp.cargo}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="alquiler-inicio">Fecha de Inicio *</label>
              <input
                id="alquiler-inicio"
                type="date"
                name="fecha_inicio"
                value={form.fecha_inicio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="alquiler-fin">Fecha de Fin *</label>
              <input
                id="alquiler-fin"
                type="date"
                name="fecha_fin"
                value={form.fecha_fin}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="alquiler-total">Monto Total (₡ Colones) *</label>
              <input
                id="alquiler-total"
                type="number"
                step="100"
                min="1"
                name="total"
                placeholder="Calculado automáticamente"
                value={form.total}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="alquiler-estado">Estado del Contrato *</label>
              <select
                id="alquiler-estado"
                name="estado"
                value={form.estado}
                onChange={handleChange}
                required
              >
                <option value="Activo">Activo</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting
                ? 'Procesando...'
                : editingId
                  ? 'Actualizar Contrato de Alquiler'
                  : 'Emitir Contrato de Alquiler'}
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de Alquileres */}
      <div className="panel-card table-panel">
        <div className="fleet-photo-strip">
          <img
            src="/entrega-llaves.jpg"
            alt="Entrega de llaves AutoRent"
            className="fleet-strip-img"
          />
          <div className="fleet-strip-overlay">
            <span className="fleet-strip-tag">Atención personalizada</span>
            <h3 className="fleet-strip-title">Reservas y entrega de vehículos</h3>
          </div>
        </div>

        <div className="panel-header table-toolbar">
          <div>
            <h2 className="panel-title">
              Registro de Contratos de Alquiler ({filteredAlquileres.length})
            </h2>
            <p className="panel-subtitle">
              Historial completo de reservas, clientes, unidades asignadas y facturación
            </p>
          </div>

          <div className="toolbar-controls">
            <div className="filter-pills">
              {['Todos', 'Activo', 'Finalizado', 'Cancelado'].map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`filter-pill ${statusFilter === st ? 'active' : ''}`}
                  onClick={() => setStatusFilter(st)}
                >
                  {st}
                </button>
              ))}
            </div>
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar cliente, vehículo, placa o ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Vehículo</th>
                <th>Asesor</th>
                <th>Fechas</th>
                <th>Total</th>
                <th>Estado</th>
                <th className="actions-col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlquileres.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-cell">
                    No se encontraron contratos de alquiler con los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                filteredAlquileres.map((alq) => (
                  <tr key={alq.id} className={editingId === alq.id ? 'row-editing' : ''}>
                    <td className="id-cell">#{alq.id}</td>
                    <td>
                      <div className="cell-primary">
                        {alq.cliente ? alq.cliente.nombre : `Cliente #${alq.cliente_id}`}
                      </div>
                      <div className="cell-secondary">
                        {alq.cliente ? alq.cliente.identificacion : ''}
                      </div>
                    </td>
                    <td>
                      {alq.vehiculo ? (
                        <>
                          <div className="cell-primary">
                            {alq.vehiculo.marca} {alq.vehiculo.modelo}
                          </div>
                          <span className="plate-chip">{alq.vehiculo.placa}</span>
                        </>
                      ) : (
                        `Vehículo #${alq.vehiculo_id}`
                      )}
                    </td>
                    <td>
                      <div className="cell-primary">
                        {alq.empleado ? alq.empleado.nombre : `Empleado #${alq.empleado_id}`}
                      </div>
                      <div className="cell-secondary">
                        {alq.empleado ? alq.empleado.cargo : ''}
                      </div>
                    </td>
                    <td>
                      <div className="date-range">
                        <span>{alq.fecha_inicio}</span>
                        <span className="date-arrow">→</span>
                        <span>{alq.fecha_fin}</span>
                      </div>
                    </td>
                    <td className="amount-cell">{formatColones(alq.total)}</td>
                    <td>
                      <span className={`badge badge-${(alq.estado || '').toLowerCase()}`}>
                        {alq.estado}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="btn-action btn-view"
                        onClick={() => handleViewById(alq.id)}
                      >
                        Ver
                      </button>
                      <button
                        type="button"
                        className="btn-action btn-edit"
                        onClick={() => handleEdit(alq)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn-action btn-delete"
                        onClick={() => setDeleteTarget(alq)}
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
        title="Eliminar Contrato de Alquiler"
        message="¿Está seguro de que desea eliminar este registro de alquiler?"
        itemLabel={
          deleteTarget
            ? `Contrato #${deleteTarget.id} — ${deleteTarget.cliente?.nombre || ''} (${deleteTarget.vehiculo?.placa || ''})`
            : ''
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {/* Modal Detalle por ID */}
      <DetailModal
        isOpen={Boolean(detailData)}
        title={detailData ? `Detalle del Contrato #${detailData.id}` : ''}
        subtitle="Consulta individual desde endpoint GET /api/alquileres/:id"
        fields={
          detailData
            ? [
                { label: 'Número de Contrato', value: `#${detailData.id}` },
                {
                  label: 'Cliente',
                  value: detailData.cliente
                    ? `${detailData.cliente.nombre} (${detailData.cliente.identificacion})`
                    : `ID #${detailData.cliente_id}`
                },
                {
                  label: 'Vehículo',
                  value: detailData.vehiculo
                    ? `${detailData.vehiculo.marca} ${detailData.vehiculo.modelo} [${detailData.vehiculo.placa}]`
                    : `ID #${detailData.vehiculo_id}`
                },
                {
                  label: 'Empleado Responsable',
                  value: detailData.empleado
                    ? `${detailData.empleado.nombre} (${detailData.empleado.cargo})`
                    : `ID #${detailData.empleado_id}`
                },
                { label: 'Fecha de Inicio', value: detailData.fecha_inicio },
                { label: 'Fecha de Fin', value: detailData.fecha_fin },
                {
                  label: 'Monto Total',
                  value: `${formatColones(detailData.total)}`
                },
                { label: 'Estado del Contrato', value: detailData.estado }
              ]
            : []
        }
        onClose={() => setDetailData(null)}
      />
    </div>
  );
}

