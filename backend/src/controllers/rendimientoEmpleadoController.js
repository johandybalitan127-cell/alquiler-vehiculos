const { Empleado, Alquiler, Cliente, Vehiculo } = require('../models');

// Controlador #12: Productividad y desempeño comercial por empleado
exports.obtenerRendimientoEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.findAll({
      include: [{ model: Alquiler, as: 'alquileres' }]
    });

    const reporte = empleados.map((emp) => {
      const contratos = emp.alquileres || [];
      const contratosValidos = contratos.filter((a) => a.estado !== 'Cancelado');
      const montoGestionado = contratosValidos.reduce(
        (acc, a) => acc + Number(a.total || 0),
        0
      );

      return {
        empleado_id: emp.id,
        nombre: emp.nombre,
        cargo: emp.cargo,
        correo: emp.correo,
        telefono: emp.telefono,
        contratos_totales: contratos.length,
        contratos_activos: contratos.filter((a) => a.estado === 'Activo').length,
        monto_gestionado_colones: montoGestionado
      };
    });

    reporte.sort((a, b) => b.monto_gestionado_colones - a.monto_gestionado_colones);
    return res.status(200).json(reporte);
  } catch (error) {
    return res.status(500).json({
      error: 'Error al consultar el rendimiento del equipo.',
      detalle: error.message
    });
  }
};

exports.obtenerRendimientoPorEmpleadoId = async (req, res) => {
  try {
    const empleadoId = Number(req.params.empleadoId);
    if (!Number.isInteger(empleadoId) || empleadoId <= 0) {
      return res.status(400).json({ error: 'ID de empleado inválido.' });
    }

    const empleado = await Empleado.findByPk(empleadoId, {
      include: [
        {
          model: Alquiler,
          as: 'alquileres',
          include: [
            { model: Cliente, as: 'cliente' },
            { model: Vehiculo, as: 'vehiculo' }
          ]
        }
      ]
    });

    if (!empleado) {
      return res.status(404).json({ error: `Empleado con ID ${empleadoId} no encontrado.` });
    }

    const contratos = empleado.alquileres || [];
    const montoGestionado = contratos
      .filter((a) => a.estado !== 'Cancelado')
      .reduce((acc, a) => acc + Number(a.total || 0), 0);

    return res.status(200).json({
      empleado: {
        id: empleado.id,
        nombre: empleado.nombre,
        cargo: empleado.cargo,
        correo: empleado.correo,
        telefono: empleado.telefono
      },
      estadisticas: {
        contratos_totales: contratos.length,
        monto_gestionado_colones: montoGestionado
      },
      alquileres: contratos
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error al consultar el desempeño del empleado.',
      detalle: error.message
    });
  }
};

