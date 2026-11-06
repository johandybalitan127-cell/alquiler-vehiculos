import React, { useState } from 'react';
import { vehiculosApi } from '../services/api';
import { getVehicleImage, formatColones } from '../utils/vehicleImages';
import ConfirmModal from './ConfirmModal';
import DetailModal from './DetailModal';

const initialForm = {
  marca: '',
  modelo: '',
  anio: new Date().getFullYear(),
  placa: '',
  precio_dia: '',
  estado: 'Disponible'
};

export default function VehiculosView({ vehiculos, onRefresh, notify }) {
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
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
      const payload = {
        ...form,
        anio: Number(form.anio),
        precio_dia: Number(form.precio_dia)
      };

      if (editingId) {
        const res = await vehiculosApi.update(editingId, payload);
        notify('success', res.mensaje || 'Vehículo actualizado correctamente.');
      } else {
        const res = await vehiculosApi.create(payload);
        notify('success', res.mensaje || 'Vehículo registrado exitosamente.');
      }
      resetForm();
      await onRefresh();
    } catch (err) {
      notify('error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (vehiculo) => {
    setEditingId(vehiculo.id);
    setForm({
      marca: vehiculo.marca || '',
      modelo: vehiculo.modelo || '',
      anio: vehiculo.anio || 2024,
      placa: vehiculo.placa || '',
      precio_dia: vehiculo.precio_dia || '',
      estado: vehiculo.estado || 'Disponible'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewById = async (id) => {
    try {
      const data = await vehiculosApi.getById(id);
      setDetailData(data);
    } catch (err) {
      notify('error', err.message);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await vehiculosApi.remove(deleteTarget.id);
      notify('success', res.mensaje || 'Vehículo eliminado correctamente.');
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

  const filteredVehiculos = vehiculos.filter((v) => {
    const matchesStatus = statusFilter === 'Todos' || v.estado === statusFilter;
    const term = search.toLowerCase();
    const matchesSearch =
      String(v.id).includes(term) ||
      (v.marca || '').toLowerCase().includes(term) ||
      (v.modelo || '').toLowerCase().includes(term) ||
      (v.placa || '').toLowerCase().includes(term) ||
      String(v.anio).includes(term);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="crud-layout">
      {/* Formulario de Registro / Edición */}
      <div className="panel-card form-panel">
        <div className="panel-header">
          <div>
            <span className="panel-eyebrow">Flota</span>
            <h2 className="panel-title">
              {editingId ? `Editar vehículo #${editingId}` : 'Agregar vehículo'}
            </h2>
          </div>
          {editingId && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={resetForm}>
              Cancelar edición
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="entity-form">
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="vehiculo-marca">Marca *</label>
              <input
                id="vehiculo-marca"
                type="text"
                name="marca"
                placeholder="Ej: Toyota, BMW, Audi"
                value={form.marca}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="vehiculo-modelo">Modelo *</label>
              <input
                id="vehiculo-modelo"
                type="text"
                name="modelo"
                placeholder="Ej: Corolla Cross XLE"
                value={form.modelo}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="vehiculo-anio">Año de Fabricación *</label>
              <input
                id="vehiculo-anio"
                type="number"
                name="anio"
                min="1980"
                max="2030"
                value={form.anio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="vehiculo-placa">Placa (Matrícula) *</label>
              <input
                id="vehiculo-placa"
                type="text"
                name="placa"
                placeholder="Ej: ABC-104"
                value={form.placa}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="vehiculo-precio">Precio por Día (₡ Colones) *</label>
              <input
                id="vehiculo-precio"
                type="number"
                step="100"
                min="1"
                name="precio_dia"
                placeholder="Ej: 35000"
                value={form.precio_dia}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="vehiculo-estado">Estado Operativo *</label>
              <select
                id="vehiculo-estado"
                name="estado"
                value={form.estado}
                onChange={handleChange}
                required
              >
                <option value="Disponible">Disponible</option>
                <option value="Alquilado">Alquilado</option>
                <option value="Mantenimiento">Mantenimiento</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting
                ? 'Guardando...'
                : editingId
                  ? 'Actualizar Vehículo'
                  : 'Registrar Vehículo en Flota'}
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de Vehículos */}
      <div className="panel-card table-panel">
        <div className="fleet-photo-strip">
          <img
            src="/flota-autorent.jpg"
            alt="Patio de vehículos AutoRent"
            className="fleet-strip-img"
          />
          <div className="fleet-strip-overlay">
            <span className="fleet-strip-tag">Sucursal Central</span>
            <h3 className="fleet-strip-title">Patio y unidades en exhibición</h3>
          </div>
        </div>

        <div className="panel-header table-toolbar">
          <div>
            <h2 className="panel-title">Catálogo de Flota ({filteredVehiculos.length})</h2>
            <p className="panel-subtitle">
              Control de unidades, placas, tarifas diarias y disponibilidad
            </p>
          </div>

          <div className="toolbar-controls">
            <div className="filter-pills">
              {['Todos', 'Disponible', 'Alquilado', 'Mantenimiento'].map((st) => (
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
                placeholder="Buscar marca, modelo o placa..."
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
                <th>Vehículo</th>
                <th>Año</th>
                <th>Placa</th>
                <th>Tarifa / Día</th>
                <th>Estado</th>
                <th className="actions-col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehiculos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-cell">
                    No se encontraron vehículos con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredVehiculos.map((v) => (
                  <tr key={v.id} className={editingId === v.id ? 'row-editing' : ''}>
                    <td className="id-cell">#{v.id}</td>
                    <td>
                      <div className="table-car-cell">
                        <img
                          src={getVehicleImage(v)}
                          alt={`${v.marca} ${v.modelo}`}
                          className="table-car-thumb"
                          onError={(e) => {
                            e.currentTarget.src = '/flota-autorent.jpg';
                          }}
                        />
                        <div>
                          <div className="cell-primary">{v.marca}</div>
                          <div className="cell-secondary">{v.modelo}</div>
                        </div>
                      </div>
                    </td>
                    <td>{v.anio}</td>
                    <td>
                      <span className="plate-chip">{v.placa}</span>
                    </td>
                    <td className="amount-cell">{formatColones(v.precio_dia)}</td>
                    <td>
                      <span className={`badge badge-${(v.estado || '').toLowerCase()}`}>
                        {v.estado}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="btn-action btn-view"
                        onClick={() => handleViewById(v.id)}
                      >
                        Ver
                      </button>
                      <button
                        type="button"
                        className="btn-action btn-edit"
                        onClick={() => handleEdit(v)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn-action btn-delete"
                        onClick={() => setDeleteTarget(v)}
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
        title="Eliminar Vehículo de la Flota"
        message="¿Está seguro de que desea eliminar este vehículo?"
        itemLabel={
          deleteTarget
            ? `${deleteTarget.marca} ${deleteTarget.modelo} (${deleteTarget.placa})`
            : ''
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {/* Modal Detalle por ID */}
      <DetailModal
        isOpen={Boolean(detailData)}
        title={detailData ? `Ficha Técnica Vehículo #${detailData.id}` : ''}
        subtitle="Consulta individual desde endpoint GET /api/vehiculos/:id"
        fields={
          detailData
            ? [
                { label: 'ID de Unidad', value: `#${detailData.id}` },
                { label: 'Marca', value: detailData.marca },
                { label: 'Modelo', value: detailData.modelo },
                { label: 'Año', value: detailData.anio },
                { label: 'Placa', value: detailData.placa },
                {
                  label: 'Tarifa Diaria',
                  value: `${formatColones(detailData.precio_dia)}`
                },
                { label: 'Estado Actual', value: detailData.estado }
              ]
            : []
        }
        relatedRentals={detailData?.alquileres || []}
        onClose={() => setDetailData(null)}
      />
    </div>
  );
}

