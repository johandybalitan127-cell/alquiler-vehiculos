import React, { useState } from 'react';
import { formatColones } from '../utils/vehicleImages';

export default function PerfilView({
  profile,
  onSaveProfile,
  clientes,
  vehiculos,
  empleados,
  alquileres,
  onNavigate,
  notify
}) {
  const [form, setForm] = useState({
    nombre: profile.nombre || 'Rent Car Fios',
    rol: profile.rol || 'Administración General',
    correo: profile.correo || 'administracion@rentcarfios.cr',
    telefono: profile.telefono || '+506 2250-1000',
    sucursal: profile.sucursal || 'Sucursal Central, San José',
    horario: profile.horario || 'Lunes a Sábado · 7:00 a.m. – 7:00 p.m.',
    biografia:
      profile.biografia ||
      'Rent Car Fios — Agencia especializada en alquiler de vehículos ejecutivos, SUV y flota corporativa en Costa Rica.',
    avatar: profile.avatar || '/logo-autorent.svg?v=fios'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm((prev) => ({ ...prev, avatar: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRestoreDefaultLogo = () => {
    setForm((prev) => ({ ...prev, avatar: '/logo-autorent.svg?v=fios' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(form);
    if (notify) {
      notify('success', 'Los datos del perfil se actualizaron correctamente.');
    }
  };

  const ingresosTotales = alquileres
    .filter((a) => a.estado !== 'Cancelado')
    .reduce((acc, item) => acc + Number(item.total || 0), 0);

  const activos = alquileres.filter((a) => a.estado === 'Activo').length;

  return (
    <div className="profile-layout">
      {/* Columna izquierda: Tarjeta de presentación del perfil */}
      <div className="panel-card profile-summary-card">
        <div className="profile-cover-banner" />

        <div className="profile-avatar-container">
          <img
            src={form.avatar || '/logo-autorent.svg'}
            alt={form.nombre}
            className="profile-main-avatar"
            onError={(e) => {
              e.currentTarget.src = '/logo-autorent.svg';
            }}
          />
          <span className="badge badge-disponible profile-status-pill">Cuenta Activa</span>
        </div>

        <div className="profile-identity">
          <h2 className="profile-name-heading">{form.nombre}</h2>
          <p className="profile-role-sub">{form.rol}</p>
          <p className="profile-bio-text">{form.biografia}</p>
        </div>

        <div className="profile-info-list">
          <div className="profile-info-item">
            <span className="profile-info-label">Correo electrónico</span>
            <span className="profile-info-val">{form.correo}</span>
          </div>
          <div className="profile-info-item">
            <span className="profile-info-label">Teléfono de contacto</span>
            <span className="profile-info-val">{form.telefono}</span>
          </div>
          <div className="profile-info-item">
            <span className="profile-info-label">Sucursal principal</span>
            <span className="profile-info-val">{form.sucursal}</span>
          </div>
          <div className="profile-info-item">
            <span className="profile-info-label">Horario de atención</span>
            <span className="profile-info-val">{form.horario}</span>
          </div>
        </div>

        <div className="profile-mini-stats">
          <div className="profile-stat-box" onClick={() => onNavigate('vehiculos')}>
            <strong>{vehiculos.length}</strong>
            <span>Vehículos</span>
          </div>
          <div className="profile-stat-box" onClick={() => onNavigate('clientes')}>
            <strong>{clientes.length}</strong>
            <span>Clientes</span>
          </div>
          <div className="profile-stat-box" onClick={() => onNavigate('alquileres')}>
            <strong>{activos}</strong>
            <span>Activos</span>
          </div>
        </div>

        <div className="profile-revenue-box">
          <span className="profile-revenue-label">Facturación gestionada</span>
          <strong className="profile-revenue-amount">{formatColones(ingresosTotales)}</strong>
          <span className="profile-revenue-sub">
            Equipo actual: {empleados.length} colaboradores registrados
          </span>
        </div>
      </div>

      {/* Columna derecha: Formulario editable del perfil */}
      <div className="panel-card">
        <div className="panel-header">
          <div>
            <span className="panel-eyebrow">Configuración de Cuenta</span>
            <h2 className="panel-title">Editar Perfil e Imagen de la Página</h2>
            <p className="panel-subtitle">
              Personaliza el nombre, logo o foto de perfil, sucursal y datos de contacto que se muestran en el sistema
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="entity-form">
          <div className="profile-photo-editor">
            <img
              src={form.avatar || '/logo-autorent.svg'}
              alt="Vista previa de perfil"
              className="profile-editor-preview"
              onError={(e) => {
                e.currentTarget.src = '/logo-autorent.svg';
              }}
            />
            <div className="profile-photo-controls">
              <label className="btn btn-secondary btn-sm profile-upload-label">
                Subir nueva imagen de perfil
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  style={{ display: 'none' }}
                />
              </label>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleRestoreDefaultLogo}
              >
                Usar logo oficial Rent Car Fios
              </button>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="perfil-nombre">Nombre del Perfil / Empresa *</label>
              <input
                id="perfil-nombre"
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="perfil-rol">Cargo / Subtítulo del Perfil *</label>
              <input
                id="perfil-rol"
                type="text"
                name="rol"
                value={form.rol}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="perfil-correo">Correo Electrónico *</label>
              <input
                id="perfil-correo"
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="perfil-telefono">Teléfono *</label>
              <input
                id="perfil-telefono"
                type="text"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="perfil-sucursal">Sucursal / Ubicación *</label>
              <input
                id="perfil-sucursal"
                type="text"
                name="sucursal"
                value={form.sucursal}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="perfil-horario">Horario de Atención *</label>
              <input
                id="perfil-horario"
                type="text"
                name="horario"
                value={form.horario}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="perfil-biografia">Descripción / Presentación</label>
            <input
              id="perfil-biografia"
              type="text"
              name="biografia"
              value={form.biografia}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions" style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary">
              Guardar cambios del perfil
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onNavigate('dashboard')}
            >
              Volver al Inicio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

