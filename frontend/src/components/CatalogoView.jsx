import React, { useState } from 'react';
import { getVehicleImage, saveCustomVehicleImage, formatColones } from '../utils/vehicleImages';

export default function CatalogoView({
  vehiculos,
  alquileres,
  onNavigate,
  notify
}) {
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const [editingPhotoCar, setEditingPhotoCar] = useState(null);
  const [photoInput, setPhotoInput] = useState('');
  const [, setVersion] = useState(0);

  const filtered = vehiculos.filter((v) => {
    const matchFilter = filter === 'Todos' || v.estado === filter;
    const term = search.toLowerCase();
    const matchSearch =
      (v.marca || '').toLowerCase().includes(term) ||
      (v.modelo || '').toLowerCase().includes(term) ||
      (v.placa || '').toLowerCase().includes(term) ||
      String(v.anio).includes(term);
    return matchFilter && matchSearch;
  });

  const getActiveRentalForVehicle = (vehiculoId) => {
    return alquileres.find(
      (a) => Number(a.vehiculo_id) === Number(vehiculoId) && a.estado === 'Activo'
    );
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoInput(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = (e) => {
    e.preventDefault();
    if (!editingPhotoCar || !photoInput.trim()) return;
    saveCustomVehicleImage(editingPhotoCar.placa, photoInput);
    setEditingPhotoCar(null);
    setPhotoInput('');
    setVersion((v) => v + 1);
    if (notify) {
      notify('success', `Fotografía actualizada para ${editingPhotoCar.marca} ${editingPhotoCar.modelo}.`);
    }
  };

  return (
    <div className="catalog-section">
      {/* Barra superior de filtros */}
      <div className="panel-card catalog-toolbar-card">
        <div className="catalog-toolbar-top">
          <div>
            <span className="panel-eyebrow">Galería de Flota</span>
            <h2 className="panel-title">Vehículos en Alquiler y Disponibles</h2>
            <p className="panel-subtitle">
              Visualiza las unidades de nuestra flota, sus tarifas por día y quién las tiene en alquiler
            </p>
          </div>

          <div className="toolbar-controls">
            <div className="filter-pills">
              {[
                { key: 'Todos', label: 'Todos' },
                { key: 'Alquilado', label: 'En alquiler' },
                { key: 'Disponible', label: 'Disponibles' },
                { key: 'Mantenimiento', label: 'En taller' }
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`filter-pill ${filter === item.key ? 'active' : ''}`}
                  onClick={() => setFilter(item.key)}
                >
                  {item.label}
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
      </div>

      {/* Cuadrícula de tarjetas con imagen */}
      {filtered.length === 0 ? (
        <div className="panel-card empty-cell">
          No hay vehículos que coincidan con el filtro seleccionado.
        </div>
      ) : (
        <div className="vehicle-gallery-grid">
          {filtered.map((v) => {
            const activeRental = getActiveRentalForVehicle(v.id);
            const imgSrc = getVehicleImage(v);

            return (
              <article className="vehicle-photo-card" key={v.id}>
                <div className="vehicle-photo-wrapper">
                  <img
                    src={imgSrc}
                    alt={`${v.marca} ${v.modelo}`}
                    className="vehicle-photo-img"
                    onError={(e) => {
                      e.currentTarget.src = '/flota-autorent.jpg';
                    }}
                  />
                  <span className={`badge vehicle-floating-badge badge-${(v.estado || '').toLowerCase()}`}>
                    {v.estado}
                  </span>
                  <button
                    type="button"
                    className="change-photo-btn"
                    title="Cambiar foto de este vehículo"
                    onClick={() => {
                      setEditingPhotoCar(v);
                      setPhotoInput('');
                    }}
                  >
                    Cambiar foto
                  </button>
                </div>

                <div className="vehicle-photo-body">
                  <div className="vehicle-photo-header">
                    <div>
                      <h3 className="vehicle-card-title">
                        {v.marca} {v.modelo}
                      </h3>
                      <span className="vehicle-card-year">Modelo {v.anio}</span>
                    </div>
                    <span className="plate-chip">{v.placa}</span>
                  </div>

                  <div className="vehicle-price-row">
                    <div>
                      <span className="vehicle-price-amount">
                        {formatColones(v.precio_dia)}
                      </span>
                      <span className="vehicle-price-unit"> / día</span>
                    </div>
                  </div>

                  {activeRental ? (
                    <div className="vehicle-rental-info">
                      <span className="rental-info-label">En alquiler activo:</span>
                      <strong className="rental-info-client">
                        {activeRental.cliente
                          ? activeRental.cliente.nombre
                          : `Cliente #${activeRental.cliente_id}`}
                      </strong>
                      <span className="rental-info-dates">
                        Del {activeRental.fecha_inicio} al {activeRental.fecha_fin}
                      </span>
                    </div>
                  ) : (
                    <div className="vehicle-rental-info vehicle-rental-free">
                      <span className="rental-info-label">
                        {v.estado === 'Disponible'
                          ? 'Listo para entrega inmediata en sucursal'
                          : 'Unidad en revisión preventiva'}
                      </span>
                    </div>
                  )}

                  <div className="vehicle-card-footer">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => onNavigate('alquileres')}
                    >
                      {v.estado === 'Alquilado' ? 'Ver contrato' : 'Reservar vehículo'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => onNavigate('vehiculos')}
                    >
                      Editar datos
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal para subir o cambiar la foto de un vehículo */}
      {editingPhotoCar && (
        <div className="modal-overlay" onClick={() => setEditingPhotoCar(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">
                  Foto de {editingPhotoCar.marca} {editingPhotoCar.modelo}
                </h3>
                <p className="modal-subtitle">Placa {editingPhotoCar.placa}</p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setEditingPhotoCar(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="entity-form">
              <div className="form-group">
                <label>Subir imagen desde tu computadora</label>
                <input type="file" accept="image/*" onChange={handleFileUpload} />
              </div>

              <div className="form-group">
                <label>O pegar enlace (URL) de la imagen</label>
                <input
                  type="text"
                  placeholder="https://ejemplo.com/mi-auto.jpg"
                  value={photoInput}
                  onChange={(e) => setPhotoInput(e.target.value)}
                />
              </div>

              {photoInput && (
                <div className="photo-preview-box">
                  <img src={photoInput} alt="Vista previa" className="photo-preview-img" />
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingPhotoCar(null)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar fotografía
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

