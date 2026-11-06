const { Cliente, Vehiculo, Empleado, Alquiler } = require('../models');

// Controlador #5: Resumen ejecutivo del panel principal (Dashboard)
exports.obtenerResumenDashboard = async (req, res) => {
  try {
    const [clientes, vehiculos, empleados, alquileres] = await Promise.all([
      Cliente.findAll(),
      Vehiculo.findAll(),
      Empleado.findAll(),
      Alquiler.findAll({
        include: [
          { model: Cliente, as: 'cliente' },
          { model: Vehiculo, as: 'vehiculo' },
          { model: Empleado, as: 'empleado' }
        ],
        order: [['id', 'DESC']]
      })
    ]);

    const disponibles = vehiculos.filter((v) => v.estado === 'Disponible').length;
    const alquilados = vehiculos.filter((v) => v.estado === 'Alquilado').length;
    const mantenimiento = vehiculos.filter((v) => v.estado === 'Mantenimiento').length;

    const activos = alquileres.filter((a) => a.estado === 'Activo').length;
    const finalizados = alquileres.filter((a) => a.estado === 'Finalizado').length;
    const cancelados = alquileres.filter((a) => a.estado === 'Cancelado').length;

    const ingresosTotales = alquileres
      .filter((a) => a.estado !== 'Cancelado')
      .reduce((acc, item) => acc + Number(item.total || 0), 0);

    return res.status(200).json({
      totales: {
        clientes: clientes.length,
        vehiculos: vehiculos.length,
        empleados: empleados.length,
        alquileres: alquileres.length
      },
      flota: {
        disponibles,
        alquilados,
        mantenimiento
      },
      contratos: {
        activos,
        finalizados,
        cancelados
      },
      ingresos_colones: ingresosTotales,
      recientes: alquileres.slice(0, 5)
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error interno al obtener el resumen del dashboard.',
      detalle: error.message
    });
  }
};

