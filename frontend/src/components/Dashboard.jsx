import React from 'react';
import { getVehicleImage, formatColones } from '../utils/vehicleImages';

function getInitials(name) {
  if (!name) return 'CL';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function calculateDays(inicio, fin) {
  if (!inicio || !fin) return null;
  const d1 = new Date(inicio);
  const d2 = new Date(fin);
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return Number.isNaN(diffDays) ? null : diffDays;
}

export default function Dashboard({
  clientes,
  vehiculos,
  empleados,
  alquileres,
  onNavigate
}) {
  const disponibles = vehiculos.filter((v) => v.estado === 'Disponible').length;
  const alquilados = vehiculos.filter((v) => v.estado === 'Alquilado').length;
  const mantenimiento = vehiculos.filter((v) => v.estado === 'Mantenimiento').length;
  const totalVehiculos = vehiculos.length || 1;

  const alquileresActivos = alquileres.filter((a) => a.estado === 'Activo').length;
  const ingresosTotales = alquileres
    .filter((a) => a.estado !== 'Cancelado')
    .reduce((acc, item) => acc + Number(item.total || 0), 0);

  const ultimosAlquileres = alquileres.slice(0, 6);

  return (
    <div className="dashboard-container">
      {/* Cabecera de bienvenida ejecutiva con foto de la flota */}
      <div className="welcome-card">
        <div className="welcome-text">
          <div className="welcome-badges-strip">
            <span className="welcome-country-badge">
              🇨🇷 Flota Corporativa & Turística · Costa Rica
            </span>
            <span className="welcome-status-pill">
              <span className="pulse-dot" /> Sistema Operativo
            </span>
          </div>
          <h2 className="welcome-heading">Panel de Control Ejecutivo — Rent Car Fios</h2>
          <p className="welcome-sub">
            Actualmente cuentas con <strong>{disponibles} vehículos disponibles</strong> para entrega
            inmediata y <strong>{alquileresActivos} contratos de alquiler activos</strong> en curso.
          </p>

          <div className="welcome-highlights">
            <span className="highlight-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Tarifas en CRC ₡ con IVA 13%
            </span>
            <span className="highlight-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              15 Entidades Relacionales en MySQL
            </span>
            <span className="highlight-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Seguro Cero Deducible Disponible
            </span>
          </div>

          <div className="welcome-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onNavigate('alquileres')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nuevo Contrato
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onNavigate('catalogo')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              Ver Galería de Autos
            </button>
          </div>
        </div>

        <div className="welcome-image-frame">
          <img
            src="/flota-autorent.jpg"
            alt="Flota de vehículos ejecutivos Rent Car Fios"
            className="welcome-image"
          />
          <div className="welcome-image-tag">Rent Car Fios · Flota 2026</div>
        </div>
      </div>

      {/* Resumen numérico KPI ejecutivo con iconos y tendencias */}
      <div className="kpi-grid">
        <div className="kpi-card" onClick={() => onNavigate('clientes')}>
          <div className="kpi-top">
            <span className="kpi-label">Directorio de Clientes</span>
            <div className="kpi-icon-wrap kpi-icon-clients">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                <circle cx="10" cy="7" r="4" />
                <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
              </svg>
            </div>
          </div>
          <div className="kpi-value">{clientes.length}</div>
          <div className="kpi-footer-row">
            <span className="kpi-trend kpi-trend-positive">↑ Activos</span>
            <span className="kpi-note">Base de clientes verificados</span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => onNavigate('vehiculos')}>
          <div className="kpi-top">
            <span className="kpi-label">Flota Vehicular</span>
            <div className="kpi-icon-wrap kpi-icon-fleet">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
                <circle cx="6.5" cy="16.5" r="2.5" />
                <circle cx="16.5" cy="16.5" r="2.5" />
              </svg>
            </div>
          </div>
          <div className="kpi-value">{vehiculos.length}</div>
          <div className="kpi-footer-row">
            <span className="kpi-trend kpi-trend-accent">{disponibles} libres</span>
            <span className="kpi-note">Para entrega inmediata</span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => onNavigate('empleados')}>
          <div className="kpi-top">
            <span className="kpi-label">Equipo y Asesores</span>
            <div className="kpi-icon-wrap kpi-icon-team">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <circle cx="12" cy="8" r="4" />
                <path d="M5 20a7 7 0 0 1 14 0" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <div className="kpi-value">{empleados.length}</div>
          <div className="kpi-footer-row">
            <span className="kpi-trend kpi-trend-neutral">100% activos</span>
            <span className="kpi-note">En turnos operativos</span>
          </div>
        </div>

        <div className="kpi-card kpi-card-soft" onClick={() => onNavigate('alquileres')}>
          <div className="kpi-top">
            <span className="kpi-label">Facturación Acumulada</span>
            <div className="kpi-icon-wrap kpi-icon-revenue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
          </div>
          <div className="kpi-value">{formatColones(ingresosTotales)}</div>
          <div className="kpi-footer-row">
            <span className="kpi-trend kpi-trend-gold">{alquileres.length} contratos</span>
            <span className="kpi-note">Moneda oficial CRC (₡)</span>
          </div>
        </div>
      </div>

      {/* Sección visual de fotografías de los vehículos en alquiler */}
      <div className="panel-card">
        <div className="panel-header">
          <div>
            <span className="panel-eyebrow">Showroom de Flota</span>
            <h3 className="panel-title">Vehículos en Alquiler y Disponibilidad</h3>
            <p className="panel-subtitle">
              Catálogo fotográfico en tiempo real con tarifas diarias y placas de Costa Rica
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate('catalogo')}
          >
            Abrir galería completa ({vehiculos.length} autos)
          </button>
        </div>

        <div className="dashboard-car-grid">
          {vehiculos.map((v) => (
            <div
              className="mini-car-card"
              key={v.id}
              onClick={() => onNavigate('catalogo')}
            >
              <div className="mini-car-photo-wrap">
                <img
                  src={getVehicleImage(v)}
                  alt={`${v.marca} ${v.modelo}`}
                  className="mini-car-photo"
                  onError={(e) => {
                    e.currentTarget.src = '/flota-autorent.jpg';
                  }}
                />
                <span className={`badge vehicle-floating-badge badge-${(v.estado || '').toLowerCase()}`}>
                  <span className="badge-dot" />
                  {v.estado}
                </span>
              </div>
              <div className="mini-car-info">
                <div className="mini-car-top">
                  <strong className="mini-car-name">
                    {v.marca} {v.modelo}
                  </strong>
                  <span className="plate-chip" title="Placa de Costa Rica">
                    <span className="plate-chip-country">CR</span>
                    {v.placa}
                  </span>
                </div>
                <div className="mini-car-bottom">
                  <span className="mini-car-year">Modelo {v.anio}</span>
                  <span className="mini-car-price">{formatColones(v.precio_dia)}/día</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dos columnas: Estado de vehículos y Reservas recientes */}
      <div className="dashboard-panels">
        {/* Columna 1: Disponibilidad y mini catálogo */}
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">Capacidad de Flota</span>
              <h3 className="panel-title">Disponibilidad en Tiempo Real</h3>
              <p className="panel-subtitle">Distribución porcentual de unidades</p>
            </div>
          </div>

          <div className="fleet-status-list">
            <div className="fleet-status-item">
              <div className="fleet-status-top">
                <span className="fleet-status-name">
                  <span className="dot dot-disponible" /> Disponibles para Alquiler
                </span>
                <span className="fleet-status-count">
                  {disponibles} autos ({Math.round((disponibles / totalVehiculos) * 100)}%)
                </span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill fill-disponible"
                  style={{ width: `${(disponibles / totalVehiculos) * 100}%` }}
                />
              </div>
            </div>

            <div className="fleet-status-item">
              <div className="fleet-status-top">
                <span className="fleet-status-name">
                  <span className="dot dot-alquilado" /> En Alquiler con Clientes
                </span>
                <span className="fleet-status-count">
                  {alquilados} autos ({Math.round((alquilados / totalVehiculos) * 100)}%)
                </span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill fill-alquilado"
                  style={{ width: `${(alquilados / totalVehiculos) * 100}%` }}
                />
              </div>
            </div>

            <div className="fleet-status-item">
              <div className="fleet-status-top">
                <span className="fleet-status-name">
                  <span className="dot dot-mantenimiento" /> En Revisión Preventiva
                </span>
                <span className="fleet-status-count">
                  {mantenimiento} autos ({Math.round((mantenimiento / totalVehiculos) * 100)}%)
                </span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill fill-mantenimiento"
                  style={{ width: `${(mantenimiento / totalVehiculos) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="fleet-mini-catalog">
            <div className="mini-catalog-header">
              <h4 className="mini-heading">Unidades destacadas de la flota</h4>
              <button
                type="button"
                className="btn-text-link"
                onClick={() => onNavigate('vehiculos')}
              >
                Gestionar
              </button>
            </div>
            {vehiculos.slice(0, 4).map((v) => (
              <div className="fleet-mini-row" key={v.id}>
                <div className="fleet-mini-info">
                  <div>
                    <div className="cell-primary">
                      {v.marca} {v.modelo}
                    </div>
                    <span className="cell-secondary">
                      <span className="plate-chip-mini">CR {v.placa}</span> · {formatColones(v.precio_dia)}/día
                    </span>
                  </div>
                </div>
                <span className={`badge badge-${(v.estado || '').toLowerCase()}`}>
                  <span className="badge-dot" />
                  {v.estado}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Columna 2: Últimos alquileres (limpio, sin banner duplicado) */}
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">Movimientos Recientes</span>
              <h3 className="panel-title">Últimos Alquileres Registrados</h3>
              <p className="panel-subtitle">Expedientes y contratos formalizados en el sistema</p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('alquileres')}
            >
              Ver todos los contratos
            </button>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cliente & Asesor</th>
                  <th>Vehículo</th>
                  <th>Periodo</th>
                  <th>Total (CRC ₡)</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {ultimosAlquileres.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-cell">
                      Aún no hay alquileres registrados en la base de datos.
                    </td>
                  </tr>
                ) : (
                  ultimosAlquileres.map((alq) => {
                    const clientName = alq.cliente ? alq.cliente.nombre : `Cliente #${alq.cliente_id}`;
                    const days = calculateDays(alq.fecha_inicio, alq.fecha_fin);
                    return (
                      <tr key={alq.id}>
                        <td>
                          <div className="client-cell-wrap">
                            <span className="client-initials-badge">
                              {getInitials(clientName)}
                            </span>
                            <div>
                              <div className="cell-primary">{clientName}</div>
                              <div className="cell-secondary">
                                {alq.empleado ? `Asesor: ${alq.empleado.nombre}` : 'Sin asesor asignado'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          {alq.vehiculo ? (
                            <div>
                              <div className="cell-primary">
                                {alq.vehiculo.marca} {alq.vehiculo.modelo}
                              </div>
                              <span className="plate-chip-mini">CR {alq.vehiculo.placa}</span>
                            </div>
                          ) : (
                            <span className="cell-secondary">Vehículo #{alq.vehiculo_id}</span>
                          )}
                        </td>
                        <td>
                          <div className="date-range">
                            <span>{alq.fecha_inicio}</span>
                            <span className="date-arrow">→</span>
                            <span>{alq.fecha_fin}</span>
                          </div>
                          {days && <span className="days-badge">{days} {days === 1 ? 'día' : 'días'}</span>}
                        </td>
                        <td className="amount-cell">{formatColones(alq.total)}</td>
                        <td>
                          <span className={`badge badge-${(alq.estado || '').toLowerCase()}`}>
                            <span className="badge-dot" />
                            {alq.estado}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
