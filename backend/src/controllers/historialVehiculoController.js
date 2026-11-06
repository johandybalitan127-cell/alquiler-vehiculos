const { Vehiculo, Alquiler, Cliente, Empleado } = require('../models');

// Controlador #11: Historial de contratos y rendimiento por unidad vehicular
exports.obtenerHistorialPorVehiculo = async (req, res) => {
  try {
    const vehiculoId = Number(req.params.vehiculoId);
    if (!Number.isInteger(vehiculoId) || vehiculoId <= 0) {
      return res.status(400).json({ error: 'ID de vehículo inválido.' });
    }

    const vehiculo = await Vehiculo.findByPk(vehiculoId);
    if (!vehiculo) {
      return res.status(404).json({ error: `Vehículo con ID ${vehiculoId} no encontrado.` });
    }

    const alquileres = await Alquiler.findAll({
      where: { vehiculo_id: vehiculoId },
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Empleado, as: 'empleado' }
      ],
      order: [['fecha_inicio', 'DESC']]
    });

    const recaudacionTotal = alquileres
      .filter((a) => a.estado !== 'Cancelado')
      .reduce((acc, a) => acc + Number(a.total || 0), 0);

    return res.status(200).json({
      vehiculo,
      metricas: {
        veces_alquilado: alquileres.length,
        recaudacion_total_colones: recaudacionTotal,
        estado_actual: vehiculo.estado
      },
      contratos: alquileres
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error al consultar el historial del vehículo.',
      detalle: error.message
    });
  }
};

