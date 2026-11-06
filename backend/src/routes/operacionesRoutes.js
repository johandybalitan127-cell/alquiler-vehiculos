const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const flotaController = require('../controllers/flotaController');
const facturacionController = require('../controllers/facturacionController');
const reporteController = require('../controllers/reporteController');
const busquedaController = require('../controllers/busquedaController');
const historialClienteController = require('../controllers/historialClienteController');
const historialVehiculoController = require('../controllers/historialVehiculoController');
const rendimientoEmpleadoController = require('../controllers/rendimientoEmpleadoController');
const cotizadorController = require('../controllers/cotizadorController');
const mantenimientoController = require('../controllers/mantenimientoController');
const perfilAgenciaController = require('../controllers/perfilAgenciaController');

// #5 Dashboard
router.get('/dashboard/resumen', dashboardController.obtenerResumenDashboard);

// #6 Flota
router.get('/flota/disponibles', flotaController.obtenerVehiculosDisponibles);
router.get('/flota/alquilados', flotaController.obtenerVehiculosEnAlquiler);
router.patch('/flota/:id/estado', flotaController.cambiarEstadoVehiculo);

// #7 Facturación
router.get('/facturacion/resumen', facturacionController.obtenerResumenFacturacion);
router.get('/facturacion/por-vehiculo', facturacionController.obtenerFacturacionPorVehiculo);

// #8 Reportes y Explorador de las 15 Entidades de Base de Datos
router.get('/reportes/general', reporteController.obtenerReporteGeneral);
router.get('/reportes/clientes-frecuentes', reporteController.obtenerClientesFrecuentes);
router.post('/entidades/:tabla', reporteController.crearRegistroEntidad);
router.delete('/entidades/:tabla/:id', reporteController.eliminarRegistroEntidad);

// #9 Búsqueda Global
router.get('/busqueda', busquedaController.buscarEnSistema);

// #10 Historial por Cliente
router.get('/historial-clientes/:clienteId', historialClienteController.obtenerHistorialPorCliente);

// #11 Historial por Vehículo
router.get('/historial-vehiculos/:vehiculoId', historialVehiculoController.obtenerHistorialPorVehiculo);

// #12 Rendimiento de Empleados
router.get('/rendimiento-empleados', rendimientoEmpleadoController.obtenerRendimientoEmpleados);
router.get(
  '/rendimiento-empleados/:empleadoId',
  rendimientoEmpleadoController.obtenerRendimientoPorEmpleadoId
);

// #13 Cotizador de Alquiler
router.post('/cotizador', cotizadorController.calcularCotizacion);

// #14 Mantenimiento / Taller
router.get('/mantenimiento', mantenimientoController.obtenerVehiculosEnMantenimiento);
router.post('/mantenimiento/:vehiculoId/enviar', mantenimientoController.enviarVehiculoAMantenimiento);
router.post(
  '/mantenimiento/:vehiculoId/liberar',
  mantenimientoController.liberarVehiculoDeMantenimiento
);

// #15 Perfil Corporativo de la Agencia
router.get('/perfil', perfilAgenciaController.obtenerPerfilAgencia);
router.put('/perfil', perfilAgenciaController.actualizarPerfilAgencia);

module.exports = router;

