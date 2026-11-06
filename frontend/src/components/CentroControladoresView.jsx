import React, { useState, useEffect, useCallback } from 'react';
import { operacionesApi } from '../services/api';
import { formatColones } from '../utils/vehicleImages';

const getTodayStr = () => new Date().toISOString().split('T')[0];

const LISTA_15_ENTIDADES_BD = [
  { key: 'clientes', num: 1, modelo: 'Cliente.js', tabla: 'clientes', desc: 'Clientes registrados (cédula, correo, teléfono)' },
  { key: 'vehiculos', num: 2, modelo: 'Vehiculo.js', tabla: 'vehiculos', desc: 'Flota de vehículos (marca, modelo, placa, tarifa ₡)' },
  { key: 'empleados', num: 3, modelo: 'Empleado.js', tabla: 'empleados', desc: 'Personal operativo y asesores comerciales' },
  { key: 'alquileres', num: 4, modelo: 'Alquiler.js', tabla: 'alquileres', desc: 'Contratos de alquiler (FK cliente, vehículo, empleado)' },
  { key: 'sucursales', num: 5, modelo: 'Sucursal.js', tabla: 'sucursales', desc: 'Sedes y agencias de Rent Car Fios en el país' },
  { key: 'categorias_vehiculo', num: 6, modelo: 'CategoriaVehiculo.js', tabla: 'categorias_vehiculo', desc: 'Categorías de flota, tarifas base y depósitos' },
  { key: 'seguros', num: 7, modelo: 'Seguro.js', tabla: 'seguros', desc: 'Pólizas de cobertura básica y cero deducible' },
  { key: 'pagos', num: 8, modelo: 'Pago.js', tabla: 'pagos', desc: 'Pagos y depósitos asociados a contratos (FK alquiler_id)' },
  { key: 'facturas', num: 9, modelo: 'Factura.js', tabla: 'facturas', desc: 'Facturación electrónica con IVA 13% (FK alquiler_id, cliente_id)' },
  { key: 'mantenimientos', num: 10, modelo: 'Mantenimiento.js', tabla: 'mantenimientos', desc: 'Órdenes de servicio y taller mecánico (FK vehiculo_id)' },
  { key: 'inspecciones', num: 11, modelo: 'Inspeccion.js', tabla: 'inspecciones', desc: 'Hojas de check-in/check-out de kilometraje y combustible' },
  { key: 'multas', num: 12, modelo: 'Multa.js', tabla: 'multas', desc: 'Infracciones de tránsito y peajes asociados a alquileres' },
  { key: 'accesorios', num: 13, modelo: 'Accesorio.js', tabla: 'accesorios', desc: 'Extras de alquiler: GPS, silla infantil, Wi-Fi 5G, racks' },
  { key: 'reservas_web', num: 14, modelo: 'ReservaWeb.js', tabla: 'reservas_web', desc: 'Solicitudes de reserva anticipada por sucursal' },
  { key: 'calificaciones', num: 15, modelo: 'Calificacion.js', tabla: 'calificaciones', desc: 'Evaluaciones y reseñas de clientes (FK cliente, vehículo, alquiler)' }
];

const LISTA_15_CONTROLADORES = [
  { num: 1, archivo: 'clienteController.js', ruta: '/api/clientes', desc: 'CRUD completo de Clientes' },
  { num: 2, archivo: 'vehiculoController.js', ruta: '/api/vehiculos', desc: 'CRUD completo de Vehículos' },
  { num: 3, archivo: 'empleadoController.js', ruta: '/api/empleados', desc: 'CRUD completo de Empleados' },
  { num: 4, archivo: 'alquilerController.js', ruta: '/api/alquileres', desc: 'CRUD completo de Alquileres' },
  { num: 5, archivo: 'dashboardController.js', ruta: '/api/dashboard/resumen', desc: 'Métricas ejecutivas del panel principal' },
  { num: 6, archivo: 'flotaController.js', ruta: '/api/flota/disponibles', desc: 'Disponibilidad y cambio rápido de estado' },
  { num: 7, archivo: 'facturacionController.js', ruta: '/api/facturacion/resumen', desc: 'Resumen financiero y recaudación por unidad' },
  { num: 8, archivo: 'reporteController.js', ruta: '/api/reportes/general', desc: 'Explorador de las 15 entidades de BD y rankings' },
  { num: 9, archivo: 'busquedaController.js', ruta: '/api/busqueda?q=', desc: 'Buscador global multicriterio en el sistema' },
  { num: 10, archivo: 'historialClienteController.js', ruta: '/api/historial-clientes/:id', desc: 'Expediente e inversión histórica por cliente' },
  { num: 11, archivo: 'historialVehiculoController.js', ruta: '/api/historial-vehiculos/:id', desc: 'Historial de contratos por vehículo' },
  { num: 12, archivo: 'rendimientoEmpleadoController.js', ruta: '/api/rendimiento-empleados', desc: 'Productividad y ventas por asesor' },
  { num: 13, archivo: 'cotizadorController.js', ruta: '/api/cotizador', desc: 'Calculadora de tarifas + IVA 13% en colones' },
  { num: 14, archivo: 'mantenimientoController.js', ruta: '/api/mantenimiento', desc: 'Ingreso y liberación de unidades en taller' },
  { num: 15, archivo: 'perfilAgenciaController.js', ruta: '/api/perfil', desc: 'Configuración del perfil oficial de la agencia' }
];

export default function CentroControladoresView({ vehiculos, onRefresh, notify }) {
  const [facturacion, setFacturacion] = useState(null);
  const [clientesFrecuentes, setClientesFrecuentes] = useState([]);
  const [rendimientoEmpleados, setRendimientoEmpleados] = useState([]);
  const [entidadesBD, setEntidadesBD] = useState({});
  const [tablaActiva, setTablaActiva] = useState('sucursales');

  // Estado para Cotizador (#13)
  const [cotForm, setCotForm] = useState({
    vehiculo_id: '',
    fecha_inicio: getTodayStr(),
    fecha_fin: getTodayStr()
  });
  const [cotResult, setCotResult] = useState(null);

  // Estado para Búsqueda Global (#9)
  const [queryGlobal, setQueryGlobal] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const cargarReportes = useCallback(async () => {
    try {
      const [facRes, cliFrec, rendEmp, repGen] = await Promise.all([
        operacionesApi.getFacturacionResumen(),
        operacionesApi.getClientesFrecuentes(),
        operacionesApi.getRendimientoEmpleados(),
        operacionesApi.getReporteGeneral()
      ]);
      setFacturacion(facRes);
      setClientesFrecuentes(Array.isArray(cliFrec) ? cliFrec : []);
      setRendimientoEmpleados(Array.isArray(rendEmp) ? rendEmp : []);
      if (repGen && repGen.entidades) {
        setEntidadesBD(repGen.entidades);
      }
    } catch {
      // handled silently if offline
    }
  }, []);

  useEffect(() => {
    cargarReportes();
  }, [cargarReportes]);

  const handleCotizar = async (e) => {
    e.preventDefault();
    try {
      const data = await operacionesApi.cotizarAlquiler(cotForm);
      setCotResult(data);
    } catch (err) {
      if (notify) notify('error', err.message);
    }
  };

  const handleBuscarGlobal = async (e) => {
    e.preventDefault();
    if (!queryGlobal.trim()) return;
    try {
      const data = await operacionesApi.buscarGlobal(queryGlobal);
      setSearchResult(data);
    } catch (err) {
      if (notify) notify('error', err.message);
    }
  };

  const handleTallerAction = async (vehiculo, accion) => {
    try {
      if (accion === 'enviar') {
        const res = await operacionesApi.enviarAMantenimiento(vehiculo.id);
        if (notify) notify('success', res.mensaje);
      } else {
        const res = await operacionesApi.liberarDeMantenimiento(vehiculo.id);
        if (notify) notify('success', res.mensaje);
      }
      await onRefresh();
      await cargarReportes();
    } catch (err) {
      if (notify) notify('error', err.message);
    }
  };

  const registrosTablaSeleccionada = Array.isArray(entidadesBD[tablaActiva])
    ? entidadesBD[tablaActiva]
    : [];
  const columnasTabla =
    registrosTablaSeleccionada.length > 0
      ? Object.keys(registrosTablaSeleccionada[0])
      : [];

  return (
    <div className="dashboard-container">
      {/* Resumen de Facturación (Controlador #7) */}
      {facturacion && (
        <div className="kpi-grid">
          <div className="kpi-card kpi-card-soft">
            <span className="kpi-label">Total Facturado</span>
            <div className="kpi-value">{formatColones(facturacion.total_facturado)}</div>
            <span className="kpi-note">{facturacion.moneda}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Contratos Activos</span>
            <div className="kpi-value">{formatColones(facturacion.ingresos_activos)}</div>
            <span className="kpi-note">En circulación</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Contratos Finalizados</span>
            <div className="kpi-value">{formatColones(facturacion.ingresos_finalizados)}</div>
            <span className="kpi-note">Liquidados</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Ticket Promedio</span>
            <div className="kpi-value">{formatColones(facturacion.ticket_promedio)}</div>
            <span className="kpi-note">Por contrato válido</span>
          </div>
        </div>
      )}

      {/* EXPLORADOR EN VIVO DE LAS 15 ENTIDADES DE LA BASE DE DATOS MYSQL */}
      <div className="panel-card">
        <div className="panel-header">
          <div>
            <span className="panel-eyebrow">Base de Datos MySQL (autorent_db · 15 Tablas Sequelize)</span>
            <h3 className="panel-title">Explorador de las 15 Entidades de la Base de Datos</h3>
            <p className="panel-subtitle">
              Selecciona cualquiera de las 15 tablas relacionales creadas en MySQL para inspeccionar sus registros en tiempo real
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
          {LISTA_15_ENTIDADES_BD.map((ent) => {
            const count = Array.isArray(entidadesBD[ent.key]) ? entidadesBD[ent.key].length : 0;
            const isSelected = tablaActiva === ent.key;
            return (
              <button
                key={ent.key}
                type="button"
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setTablaActiva(ent.key)}
              >
                {ent.num}. {ent.tabla} ({count})
              </button>
            );
          })}
        </div>

        {/* Tabla dinámica de registros de la entidad seleccionada */}
        <div className="table-responsive" style={{ marginBottom: '22px' }}>
          <table className="data-table">
            <thead>
              <tr>
                {columnasTabla.length === 0 ? (
                  <th>Tabla {tablaActiva}</th>
                ) : (
                  columnasTabla.map((col) => <th key={col}>{col}</th>)
                )}
              </tr>
            </thead>
            <tbody>
              {registrosTablaSeleccionada.length === 0 ? (
                <tr>
                  <td className="empty-cell">
                    No hay registros cargados en la tabla {tablaActiva}.
                  </td>
                </tr>
              ) : (
                registrosTablaSeleccionada.map((row, idx) => (
                  <tr key={row.id || idx}>
                    {columnasTabla.map((col) => (
                      <td key={col}>
                        {typeof row[col] === 'object'
                          ? JSON.stringify(row[col])
                          : String(row[col] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Resumen de arquitectura de las 15 entidades */}
        <h4 className="mini-heading" style={{ marginBottom: '10px' }}>
          Estructura de los 15 Modelos Sequelize en backend/src/models/
        </h4>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Modelo Sequelize</th>
                <th>Tabla en MySQL</th>
                <th>Registros</th>
                <th>Descripción de la Entidad</th>
              </tr>
            </thead>
            <tbody>
              {LISTA_15_ENTIDADES_BD.map((ent) => (
                <tr key={ent.key}>
                  <td className="id-cell">#{ent.num}</td>
                  <td>
                    <span className="mono-chip">{ent.modelo}</span>
                  </td>
                  <td>
                    <span className="plate-chip">{ent.tabla}</span>
                  </td>
                  <td>
                    <span className="count-pill">
                      {Array.isArray(entidadesBD[ent.key]) ? entidadesBD[ent.key].length : 0} filas
                    </span>
                  </td>
                  <td>{ent.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cotizador (#13) + Buscador Global (#9) */}
      <div className="dashboard-panels">
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">Controlador #13 · Cotizador</span>
              <h3 className="panel-title">Calculadora de Alquiler + IVA (13%)</h3>
              <p className="panel-subtitle">Simula el costo en colones antes de emitir contrato</p>
            </div>
          </div>

          <form onSubmit={handleCotizar} className="entity-form">
            <div className="form-group">
              <label>Seleccionar Vehículo *</label>
              <select
                value={cotForm.vehiculo_id}
                onChange={(e) => setCotForm((p) => ({ ...p, vehiculo_id: e.target.value }))}
                required
              >
                <option value="">-- Elija una unidad --</option>
                {vehiculos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.marca} {v.modelo} ({formatColones(v.precio_dia)}/día)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Fecha Inicio</label>
                <input
                  type="date"
                  value={cotForm.fecha_inicio}
                  onChange={(e) => setCotForm((p) => ({ ...p, fecha_inicio: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Fecha Fin</label>
                <input
                  type="date"
                  value={cotForm.fecha_fin}
                  onChange={(e) => setCotForm((p) => ({ ...p, fecha_fin: e.target.value }))}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Calcular Cotización en Colones
            </button>
          </form>

          {cotResult && (
            <div className="vehicle-rental-info" style={{ marginTop: '16px' }}>
              <span className="rental-info-label">
                {cotResult.vehiculo.marca} {cotResult.vehiculo.modelo} · {cotResult.dias_alquiler} día(s)
              </span>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span>Subtotal:</span>
                <strong>{formatColones(cotResult.subtotal_colones)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>IVA (13%):</span>
                <strong>{formatColones(cotResult.iva_13_colones)}</strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #ead3dc',
                  paddingTop: '6px',
                  marginTop: '4px',
                  fontSize: '0.95rem'
                }}
              >
                <strong>Total Estimado:</strong>
                <strong style={{ color: 'var(--accent-rose)' }}>
                  {formatColones(cotResult.total_estimado_colones)}
                </strong>
              </div>
            </div>
          )}
        </div>

        {/* Buscador Global (#9) y Control Rápido de Taller (#14) */}
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">Controlador #9 &amp; #14 · Operaciones</span>
              <h3 className="panel-title">Búsqueda Global y Gestión de Taller</h3>
              <p className="panel-subtitle">
                Busca en las tablas simultáneamente o envía/libera unidades de mantenimiento
              </p>
            </div>
          </div>

          <form
            onSubmit={handleBuscarGlobal}
            style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}
          >
            <input
              type="text"
              placeholder="Ej: Toyota, Carlos, LUX-889, Activo..."
              value={queryGlobal}
              onChange={(e) => setQueryGlobal(e.target.value)}
              style={{
                flex: 1,
                padding: '9px 13px',
                border: '1px solid var(--border-soft)',
                borderRadius: 'var(--radius-sm)'
              }}
            />
            <button type="submit" className="btn btn-primary">
              Buscar en todo el sistema
            </button>
          </form>

          {searchResult && (
            <div className="vehicle-rental-info vehicle-rental-free" style={{ marginBottom: '18px' }}>
              <strong>
                Coincidencias para "{searchResult.termino}": {searchResult.total_coincidencias}
              </strong>
              <span>
                Clientes: {searchResult.resultados.clientes.length} · Vehículos:{' '}
                {searchResult.resultados.vehiculos.length} · Empleados:{' '}
                {searchResult.resultados.empleados.length} · Alquileres:{' '}
                {searchResult.resultados.alquileres.length}
              </span>
            </div>
          )}

          <h4 className="mini-heading" style={{ marginBottom: '10px' }}>
            Control Rápido de Mantenimiento de Flota (Controlador #14)
          </h4>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vehículo</th>
                  <th>Placa</th>
                  <th>Estado Actual</th>
                  <th className="actions-col">Acción de Taller</th>
                </tr>
              </thead>
              <tbody>
                {vehiculos.map((v) => (
                  <tr key={v.id}>
                    <td className="cell-primary">
                      {v.marca} {v.modelo}
                    </td>
                    <td>
                      <span className="plate-chip">{v.placa}</span>
                    </td>
                    <td>
                      <span className={`badge badge-${(v.estado || '').toLowerCase()}`}>
                        {v.estado}
                      </span>
                    </td>
                    <td className="actions-cell">
                      {v.estado === 'Mantenimiento' ? (
                        <button
                          type="button"
                          className="btn-action btn-edit"
                          onClick={() => handleTallerAction(v, 'liberar')}
                        >
                          Habilitar Disponible
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn-action btn-view"
                          disabled={v.estado === 'Alquilado'}
                          onClick={() => handleTallerAction(v, 'enviar')}
                        >
                          Enviar a Taller
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Rankings: Clientes Frecuentes (#8) y Rendimiento Empleados (#12) */}
      <div className="dashboard-panels">
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">Controlador #12 · Productividad</span>
              <h3 className="panel-title">Rendimiento del Equipo</h3>
            </div>
          </div>
          <div className="fleet-mini-catalog" style={{ borderTop: 'none', paddingTop: 0 }}>
            {rendimientoEmpleados.map((emp) => (
              <div className="fleet-mini-row" key={emp.empleado_id}>
                <div>
                  <div className="cell-primary">{emp.nombre}</div>
                  <div className="cell-secondary">
                    {emp.cargo} · {emp.contratos_totales} contrato(s)
                  </div>
                </div>
                <strong className="amount-cell">
                  {formatColones(emp.monto_gestionado_colones)}
                </strong>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">Controlador #8 · Analítica</span>
              <h3 className="panel-title">Clientes Frecuentes</h3>
            </div>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Identificación</th>
                  <th>Contratos</th>
                  <th>Inversión Acumulada</th>
                </tr>
              </thead>
              <tbody>
                {clientesFrecuentes.map((c) => (
                  <tr key={c.id}>
                    <td className="cell-primary">{c.nombre}</td>
                    <td>
                      <span className="mono-chip">{c.identificacion}</span>
                    </td>
                    <td>{c.cantidad_alquileres}</td>
                    <td className="amount-cell">{formatColones(c.inversion_colones)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Directorio Técnico de los 15 Controladores Integrados */}
      <div className="panel-card">
        <div className="panel-header">
          <div>
            <span className="panel-eyebrow">Arquitectura Backend (backend/src/controllers/)</span>
            <h3 className="panel-title">15 Controladores Integrados en el Sistema</h3>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Archivo Controlador</th>
                <th>Endpoint Principal</th>
                <th>Responsabilidad en el Sistema</th>
              </tr>
            </thead>
            <tbody>
              {LISTA_15_CONTROLADORES.map((item) => (
                <tr key={item.num}>
                  <td className="id-cell">#{item.num}</td>
                  <td>
                    <span className="mono-chip">{item.archivo}</span>
                  </td>
                  <td>
                    <span className="plate-chip">{item.ruta}</span>
                  </td>
                  <td>{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
