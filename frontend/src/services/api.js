const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg =
      data.error ||
      (Array.isArray(data.detalles) ? data.detalles.join(', ') : null) ||
      `Error HTTP ${response.status} al procesar la solicitud.`;
    throw new Error(errorMsg);
  }

  return data;
}

function createCrudService(resource) {
  return {
    getAll: () => request(`/${resource}`),
    getById: (id) => request(`/${resource}/${id}`),
    create: (payload) =>
      request(`/${resource}`, {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    update: (id, payload) =>
      request(`/${resource}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      }),
    remove: (id) =>
      request(`/${resource}/${id}`, {
        method: 'DELETE'
      })
  };
}

// Controladores #1 a #4: CRUD principales
export const clientesApi = createCrudService('clientes');
export const vehiculosApi = createCrudService('vehiculos');
export const empleadosApi = createCrudService('empleados');
export const alquileresApi = createCrudService('alquileres');

// Controladores #5 a #15: Operaciones empresariales, reportes, cotizador, taller y perfil
export const operacionesApi = {
  getResumenDashboard: () => request('/dashboard/resumen'),
  getFlotaDisponible: () => request('/flota/disponibles'),
  getFlotaAlquilada: () => request('/flota/alquilados'),
  cambiarEstadoVehiculo: (id, estado) =>
    request(`/flota/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado })
    }),
  getFacturacionResumen: () => request('/facturacion/resumen'),
  getFacturacionPorVehiculo: () => request('/facturacion/por-vehiculo'),
  getReporteGeneral: () => request('/reportes/general'),
  getClientesFrecuentes: () => request('/reportes/clientes-frecuentes'),
  buscarGlobal: (q) => request(`/busqueda?q=${encodeURIComponent(q)}`),
  getHistorialCliente: (clienteId) => request(`/historial-clientes/${clienteId}`),
  getHistorialVehiculo: (vehiculoId) => request(`/historial-vehiculos/${vehiculoId}`),
  getRendimientoEmpleados: () => request('/rendimiento-empleados'),
  getRendimientoEmpleadoPorId: (empleadoId) =>
    request(`/rendimiento-empleados/${empleadoId}`),
  cotizarAlquiler: (payload) =>
    request('/cotizador', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  getMantenimiento: () => request('/mantenimiento'),
  enviarAMantenimiento: (vehiculoId) =>
    request(`/mantenimiento/${vehiculoId}/enviar`, { method: 'POST' }),
  liberarDeMantenimiento: (vehiculoId) =>
    request(`/mantenimiento/${vehiculoId}/liberar`, { method: 'POST' }),
  getPerfilAgencia: () => request('/perfil'),
  actualizarPerfilAgencia: (payload) =>
    request('/perfil', {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),
  crearEnEntidad: (tabla, payload) =>
    request(`/entidades/${tabla}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  eliminarDeEntidad: (tabla, id) =>
    request(`/entidades/${tabla}/${id}`, {
      method: 'DELETE'
    })
};
